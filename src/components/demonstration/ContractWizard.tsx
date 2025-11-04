"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { contractQuestions } from "@/lib/contract-questions";
import { ContractData } from "@/lib/contract-template";
import ProgressBar from "./ProgressBar";
import QuestionStep from "./QuestionStep";
import ContractDocument from "./ContractPreview";

export default function ContractWizard() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const currentQuestion = contractQuestions[currentStep];
    const progress = ((currentStep + 1) / contractQuestions.length) * 100;

    useEffect(() => {
        console.log("📊 Respostas atualizadas:", answers);
    }, [answers]);

    const convertToContractData = (answers: Record<string, any>): ContractData => {
        return {
            contractor_name: answers.contractor_name || "",
            contractor_type: answers.contractor_type || "",
            contractor_document: answers.contractor_document || "",
            service_provider_name: answers.service_provider_name || "",
            service_description: answers.service_description || "",
            service_value: answers.service_value || "",
            payment_method: answers.payment_method || "",
            deadline: answers.deadline || "",
            confidentiality: answers.confidentiality || "",
            jurisdiction: answers.jurisdiction || "",
            anything_else: answers.anything_else || "",
        };
    };

    const handleAnswer = (answer: any) => {
        // salva a resposta atual
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: answer,
        }));

        // avança pro próximo passo com pequeno delay (garante atualização de state)
        setTimeout(() => {
            if (currentStep < contractQuestions.length - 1) {
                setCurrentStep((prev) => prev + 1);
            } else {
                generateContract();
            }
        }, 100);
    };

    // Tipagem intencionalmente simples para evitar erros de import de 'React' em alguns setups
    const handleBack = (e: any) => {
        e?.preventDefault?.();
        e?.stopPropagation?.();

        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            window.location.href = "/";
        }
    };

    const generateContract = async () => {
        setIsGenerating(true);

        setTimeout(() => {
            setIsGenerating(false);
            setShowPreview(true);

            toast.success("Contrato gerado com sucesso! 🎉", {
                icon: "✅",
                style: {
                    borderRadius: "10px",
                    background: "#2563EB",
                    color: "#fff",
                },
            });
        }, 2000);
    };

    // tela de loading enquanto gera
    if (isGenerating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50 text-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Gerando seu contrato...</h2>
                    <p className="text-gray-500">Estamos preparando tudo para você</p>
                </div>
            </div>
        );
    }

    // preview / documento final
    if (showPreview) {
        const contractData = convertToContractData(answers);
        return (
            <ContractDocument
                contractData={contractData}
                onBack={() => setShowPreview(false)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-blue-50 relative text-gray-900">

            <div className="bg-blue-100">
                <div className=" inset-0 z-0 bg-blue-100">
                    <Image
                        src="/bg-question-1.svg"
                        alt="Background"
                        fill
                        className="object-cover object-center mix-blend-overlay"
                        priority
                    />
                </div>
            </div>


            <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            aria-label="Voltar"
                            className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full hover:bg-blue-200 transition-all font-medium"
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

                        <div className="text-sm text-gray-600 font-medium">
                            {currentStep + 1} de {contractQuestions.length}
                        </div>
                    </div>

                    {/* barra de progresso */}
                    <div className="mt-3">
                        <ProgressBar progress={progress} />
                    </div>
                </div>
            </header>

            {/* Conteúdo principal */}
            <main className="relative z-10 min-h-screen flex items-center justify-center pt-24 pb-12">
                <div className="max-w-2xl mx-auto px-4 w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 sm:p-8 transition-all">
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
