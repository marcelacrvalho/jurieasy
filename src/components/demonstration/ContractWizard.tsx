"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { contractQuestions } from "@/lib/contract-questions";
import { ContractData } from "@/lib/contract-template";
import ProgressBar from "./ProgressBar";
import QuestionStep from "./QuestionStep";
import ContractPreview from "./ContractPreview";
import ContractDocument from "./ContractPreview";

export default function ContractWizard() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const currentQuestion = contractQuestions[currentStep];
    const progress = ((currentStep + 1) / contractQuestions.length) * 100;

    // DEBUG: Monitorar as respostas
    useEffect(() => {
        console.log('📊 Respostas atualizadas:', answers);
    }, [answers]);

    const convertToContractData = (answers: Record<string, any>): ContractData => {
        console.log('🔄 Convertendo para ContractData:', answers);
        return {
            contractor_name: answers.contractor_name || '',
            contractor_type: answers.contractor_type || '',
            contractor_document: answers.contractor_document || '',
            service_provider_name: answers.service_provider_name || '',
            service_description: answers.service_description || '',
            service_value: answers.service_value || '',
            payment_method: answers.payment_method || '',
            deadline: answers.deadline || '',
            confidentiality: answers.confidentiality || '',
            jurisdiction: answers.jurisdiction || '',
            anything_else: answers.anything_else || ''
        };
    };

    const handleAnswer = (answer: any) => {
        console.log('💾 Salvando resposta:', {
            pergunta: currentQuestion.id,
            resposta: answer
        });

        // Primeiro salva a resposta
        setAnswers(prev => {
            const newAnswers = {
                ...prev,
                [currentQuestion.id]: answer
            };
            console.log('✅ Novas respostas:', newAnswers);
            return newAnswers;
        });

        // Depois avança para a próxima pergunta (com pequeno delay para garantir o state update)
        setTimeout(() => {
            if (currentStep < contractQuestions.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                generateContract();
            }
        }, 100);
    };

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            window.location.href = "/";
        }
    };

    const generateContract = async () => {
        console.log('📄 Iniciando geração do contrato com respostas:', answers);
        setIsGenerating(true);

        setTimeout(() => {
            setIsGenerating(false);
            console.log('🎉 Mostrando preview com dados:', answers);
            setShowPreview(true);

            toast.success("Contrato gerado com sucesso! 🎉", {
                icon: "✅",
                style: {
                    borderRadius: "10px",
                    background: "#26425aff",
                    color: "#fff",
                },
            });
        }, 2000);
    };

    if (isGenerating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold mb-2">Gerando seu contrato...</h2>
                    <p className="text-gray-400">Estamos preparando tudo para você</p>
                </div>
            </div>
        );
    }

    // No ContractWizard.tsx, substitua esta parte:
    if (showPreview) {
        const contractData = convertToContractData(answers);
        console.log('👀 Dados enviados para o documento:', contractData);

        return (
            <ContractDocument
                contractData={contractData}
                onBack={() => setShowPreview(false)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-white relative text-gray-100">
            {/* Background com gradiente e textura sutil */}
            <div className="fixed inset-0 z-0 bg-gray-900">
                <Image
                    src="/bg-question-1.svg"
                    alt="Background"
                    fill
                    className="object-cover object-center opacity-30 mix-blend-overlay"
                    priority
                />
            </div>

            {/* Header fixo com transparência */}
            <header className="fixed top-0 w-full bg-gray-900 backdrop-blur-md border-b border-[#134E4A]/40 z-50">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-gray-100 px-4 py-2 rounded-full hover:bg-blue-700 transition-all font-medium"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            {currentStep === 0 ? "Início" : "Voltar"}
                        </button>

                        <div className="text-sm text-gray-300">
                            {currentStep + 1} de {contractQuestions.length}
                        </div>
                    </div>
                    <ProgressBar progress={progress} />
                </div>
            </header>

            {/* Conteúdo principal */}
            <main className="relative z-10 min-h-screen flex items-center justify-center pt-20">
                <div className="max-w-2xl mx-auto px-4 w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <div className="bg-gray-800/80 border border-[#134E4A]/40 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 transition-all">
                                <QuestionStep
                                    question={currentQuestion}
                                    onAnswer={handleAnswer}
                                    allAnswers={answers}
                                    currentAnswer={answers[currentQuestion.id]}
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}