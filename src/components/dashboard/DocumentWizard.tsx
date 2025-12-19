"use client";

import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import { useDocuments } from "@/hooks/document";
import { useUserDocuments } from '@/contexts/UserDocumentContext';
import { useUserContext } from "@/contexts/UserContext";
import { Document } from "@/types/document";
import { UserDocument } from "@/types/userDocument";
import QuestionStep from "./QuestionStep";
import DocumentPreview from "./DocumentPreview";
import React from "react";
import LoadingAnimation from "../shared/LoadingAnimation";


interface DocumentWizardProps {
    documentTemplate?: Document;
    userDocument?: UserDocument;
    onComplete?: (userDocument: UserDocument) => void;
    onCancel?: () => void;
    onClose?: () => void;
    onProgressUpdate?: (progress: { currentStep: number; totalSteps: number; progress: number }) => void;
}

export default function DocumentWizard({
    documentTemplate,
    userDocument,
    onComplete,
    onCancel,
    onClose,
    onProgressUpdate,
}: DocumentWizardProps) {

    const { user } = useUserContext();
    const { getDocument } = useDocuments();
    const { createDocument, updateDocument } = useUserDocuments();

    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [template, setTemplate] = useState<Document | null>(documentTemplate || null);
    const [currentUserDocument, setCurrentUserDocument] = useState<UserDocument | null>(userDocument || null);

    useEffect(() => {
        if (userDocument?.documentId?._id && !template) {
            loadTemplate(userDocument.documentId._id);
        }
    }, [userDocument, template]);

    const loadTemplate = async (documentId: string) => {
        try {
            const document = await getDocument(documentId);
            if (document) setTemplate(document);
        } catch (error) {
            console.error('Erro ao carregar template:', error);
            toast.error('Erro ao carregar template do documento');
        }
    };

    useEffect(() => {
        if (userDocument?.answers) {
            setAnswers(userDocument.answers);
            setCurrentStep(userDocument.currentStep || 0);
        }
    }, [userDocument]);

    const questions = React.useMemo(() => {
        if (!template) return [];
        if (template.variables && template.variables.length > 0) {
            return template.variables.map(variable => ({
                id: variable.id,
                question: variable.label,
                type: variable.type as any,
                options: variable.options || [],
                required: variable.required !== false,
                placeholder: variable.placeholder,
                description: variable.description
            }));
        }
        return [];
    }, [template]);

    const currentQuestion = questions[currentStep];
    const progress = questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;

    useEffect(() => {
        if (onProgressUpdate && questions.length > 0) {
            onProgressUpdate({
                currentStep: currentStep + 1,
                totalSteps: questions.length,
                progress: progress
            });
        }
    }, [currentStep, questions.length]);

    const handleAnswer = async (answer: any) => {
        const newAnswers = { ...answers, [currentQuestion.id]: answer };
        setAnswers(newAnswers);

        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            await generateDocument(newAnswers);
        }
    };

    const saveProgress = async (currentAnswers: Record<string, any>, step: number) => {
        if (!currentUserDocument || !template) {
            console.log('⏸️ Save progress pausado: template ou userDocument não disponível');
            return;
        }

        try {
            const totalSteps = template.variables?.length || questions.length || 0;

            const generatedText = generateDocumentText(template, currentAnswers);

            await updateDocument(currentUserDocument._id, {
                answers: currentAnswers,
                currentStep: step,
                totalSteps: totalSteps,
                status: 'in_progress',
                generatedText: generatedText
            });
        } catch (error) {
            console.error("Erro ao salvar rascunho:", error);
        }
    };

    const generateDocument = async (finalAnswers: Record<string, any>) => {
        if (!template || !user) {
            toast.error("Dados insuficientes para gerar documento");
            return;
        }

        setIsGenerating(true);
        try {
            let result: UserDocument | null = null;
            const totalSteps = template.variables?.length || questions.length || 0;

            const generatedText = generateDocumentText(template, finalAnswers);

            if (currentUserDocument) {
                result = await updateDocument(currentUserDocument._id, {
                    answers: finalAnswers,
                    status: "completed",
                    currentStep: questions.length,
                    totalSteps: totalSteps,
                    shouldSave: true,
                    generatedText: generatedText
                });
            } else {
                const documentData = {
                    documentId: template._id,
                    answers: finalAnswers,
                    status: "completed" as const,
                    currentStep: questions.length,
                    totalSteps: totalSteps,
                    shouldSave: true,
                    isPublic: false,
                    userId: user.id,
                    generatedText: generatedText
                };

                result = await createDocument(documentData);
            }

            if (result) {
                console.log('✅ Documento gerado com sucesso:', result._id);
                setCurrentUserDocument(result);
                setShowPreview(true);
            } else {
                console.error('❌ Falha ao gerar documento');
                toast.error("Falha ao gerar documento");
            }

        } catch (error) {
            console.error("💥 Erro ao gerar documento:", error);
            toast.error("Erro ao conectar com o servidor. Verifique se a API está rodando.");
        } finally {
            setIsGenerating(false);
        }
    };

    const generateDocumentText = (template: Document, answers: Record<string, any>): string => {
        if (!template || !template.templateText) {
            return 'Template do documento não disponível.';
        }

        const criarDataLocal = (ano: number, mes: number, dia: number): Date => {
            return new Date(ano, mes - 1, dia);
        };

        const formatarDataABNT = (dataString: string) => {
            if (!dataString) return "Não informado";
            try {
                if (dataString.includes(' de ')) {
                    return dataString;
                }
                let data: Date;
                if (dataString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    const [ano, mes, dia] = dataString.split('-').map(Number);
                    data = criarDataLocal(ano, mes, dia);
                } else {
                    data = new Date(dataString);
                }
                if (isNaN(data.getTime())) {
                    return dataString;
                }
                const options: Intl.DateTimeFormatOptions = {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                };
                return data.toLocaleDateString('pt-BR', options);
            } catch {
                return dataString;
            }
        };

        const capitalizarNomeProprio = (texto: string) => {
            if (!texto) return texto;
            const palavrasMinusculas = ["de", "da", "do", "das", "dos", "e", "em", "por", "para", "com", "sem", "sob", "sobre", "entre", "a", "o"];
            return texto
                .toLowerCase()
                .split(" ")
                .map((palavra, index) =>
                    index > 0 && palavrasMinusculas.includes(palavra)
                        ? palavra
                        : palavra.charAt(0).toUpperCase() + palavra.slice(1)
                )
                .join(" ");
        };

        const capitalizarLocal = (texto: string) => {
            if (!texto) return texto;
            const especiais = {
                "do": "do", "da": "da", "de": "de", "dos": "dos", "das": "das",
                "são": "São", "santo": "Santo", "santa": "Santa", "rio": "Rio",
                "nova": "Nova", "novo": "Novo"
            };
            return texto
                .toLowerCase()
                .split(" ")
                .map((p) => especiais[p as keyof typeof especiais] || p.charAt(0).toUpperCase() + p.slice(1))
                .join(" ");
        };

        // Gerar o texto do documento
        let text = template.templateText;

        try {
            if (!text) {
                text = `\n\n\t\t${template.title.toUpperCase()}\n\n`;
                template.variables?.forEach((variable) => {
                    let value = answers[variable.id] || "Não informado";
                    let formattedValue = String(value);

                    if (variable.type === "date") formattedValue = formatarDataABNT(formattedValue);
                    if (variable.label.toLowerCase().includes("nome")) formattedValue = capitalizarNomeProprio(formattedValue);
                    if (variable.label.toLowerCase().includes("cidade")) formattedValue = capitalizarLocal(formattedValue);

                    text += `${variable.label}: ${formattedValue}\n`;
                });
                text += `\n\nDocumento gerado em ${new Date().toLocaleDateString("pt-BR")}\n`;
            } else {
                Object.entries(answers).forEach(([key, value]) => {
                    const placeholder = `{{${key}}}`;
                    let formattedValue = String(value || "");

                    if (key.includes("data")) formattedValue = formatarDataABNT(formattedValue);
                    if (key.includes("nome")) formattedValue = capitalizarNomeProprio(formattedValue);
                    if (key.includes("cidade")) formattedValue = capitalizarLocal(formattedValue);

                    text = text.replace(new RegExp(placeholder, "g"), formattedValue);
                });
            }

            return text;
        } catch (error) {
            console.error('❌ Erro ao gerar texto do documento:', error);
            return 'Erro ao gerar o documento. Tente novamente.';
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else if (onCancel) onCancel();
        else if (onClose) {
            onClose();
        }
    };

    const handleSaveDraft = async () => {
        if (!template || !user) {
            toast.error('Template não disponível para salvar rascunho');
            return;
        }

        try {
            let result: UserDocument | null = null;
            const totalSteps = template.variables?.length || questions.length || 0;

            const generatedText = generateDocumentText(template, answers);

            console.log('💾 SALVAMENTO MANUAL - Gerando texto para rascunho');

            if (currentUserDocument) {
                result = await updateDocument(currentUserDocument._id, {
                    answers,
                    currentStep,
                    totalSteps: totalSteps,
                    status: 'in_progress',
                    generatedText: generatedText
                });
            } else {
                const documentData = {
                    documentId: template._id,
                    answers,
                    status: 'in_progress' as const,
                    currentStep,
                    totalSteps: totalSteps,
                    shouldSave: true,
                    isPublic: false,
                    userId: user.id,
                    generatedText: generatedText
                };

                result = await createDocument(documentData);
            }

            if (result) {
                setCurrentUserDocument(result);
                toast.success('Rascunho salvo com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao salvar rascunho:', error);
            toast.error('Erro ao salvar rascunho');
        }
    };

    // Função para quando o documento é realmente concluído na preview
    const handleDocumentComplete = (completedDocument: UserDocument) => {
        setCurrentUserDocument(completedDocument);
        toast.success("Documento concluído com sucesso!");
        if (onComplete) onComplete(completedDocument);
        if (onCancel) onCancel();
    };

    useEffect(() => {
        if (!currentUserDocument || !template) {
            return;
        }

        const timeoutId = setTimeout(() => {
            if (Object.keys(answers).length > 0) {
                saveProgress(answers, currentStep);
            }
        }, 1000); // Debounce de 1 segundo

        return () => clearTimeout(timeoutId);
    }, [answers, currentStep, currentUserDocument, template]); // ✅ Adicionar template como dependência

    // LOADING PAGE
    if (isGenerating) {
        return (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="text-center">
                    <div className="mx-auto mb-6">
                        <LoadingAnimation />
                    </div>

                    <h2 className="text-2xl font-bold">Gerando seu documento...</h2>
                    <p className="text-gray-600 mt-2">Aguarde alguns instantes</p>
                </div>
            </div>
        );
    }

    if (showPreview && currentUserDocument && template) {
        return (
            <DocumentPreview
                userDocument={currentUserDocument}
                plan={user?.plan ?? ''}
                template={template}
                onBack={() => setShowPreview(false)}
                onSave={() => handleDocumentComplete(currentUserDocument)}
            />
        );
    }

    if (!template) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <p className="text-gray-700">Carregando template...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Template sem questões</h2>
                    <button
                        onClick={onCancel}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    // MAIN UI
    return (
        <div className="h-full overflow-y-auto bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-gray-900">

            {/* HEADER COM PROGRESSO */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                {currentStep === 0 ? 'Cancelar' : 'Voltar'}
                            </button>

                            <div className="text-sm text-gray-600">
                                {currentStep + 1} de {questions.length}
                            </div>
                        </div>

                        {/* BARRA DE PROGRESSO */}
                        <div className="flex-1 max-w-xs">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* BOTÃO SALVAR RASCUNHO */}
                        <button
                            onClick={handleSaveDraft}
                            className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            Salvar Rascunho
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="py-10 flex justify-center px-4">
                <div className="max-w-2xl w-full">

                    {/* TITLE */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {template.title}
                        </h1>
                        <p className="text-gray-700 mt-2 text-sm">
                            {template.description}
                        </p>
                    </div>

                    {/* QUESTION CARD */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/70 backdrop-blur-xl border border-blue-100 shadow-xl rounded-3xl p-8"
                        >
                            <QuestionStep
                                question={currentQuestion}
                                onAnswer={handleAnswer}
                                currentAnswer={answers[currentQuestion.id]}
                                allAnswers={answers}
                            />
                        </motion.div>
                    </AnimatePresence>

                </div>
            </main>
        </div>
    );
}