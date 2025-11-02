"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useState } from 'react';
import { contractQuestions } from '@/lib/contract-questions';
import { ContractData } from '@/lib/contract-template';
import ProgressBar from './ProgressBar';
import QuestionStep from './QuestionStep';
import ContractPreview from './ContractPreview';

export default function ContractWizard() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const currentQuestion = contractQuestions[currentStep];
    const progress = ((currentStep + 1) / contractQuestions.length) * 100;

    // Função para converter as respostas para ContractData
    const convertToContractData = (answers: Record<string, any>): ContractData => {
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
        console.log('Salvando resposta:', answer, 'para pergunta:', currentQuestion.id);
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: answer
        }));

        if (currentStep < contractQuestions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            generateContract();
        }
    };

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🎯 BOTÃO VOLTAR CLICADO!', currentStep);

        if (currentStep > 0) {
            console.log('🔄 Indo para passo:', currentStep - 1);
            setCurrentStep(currentStep - 1);
        } else {
            console.log('🏠 Voltando para home');
            window.location.href = '/';
        }
    };

    const generateContract = async () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            toast.success('Contrato gerado com sucesso! 🎉. Em breve, redirecionaremos para a visualização.', {
                icon: '✅',
                style: {
                    borderRadius: '10px',
                    background: '#1f2937',
                    color: '#fff',
                },
            });
            setShowPreview(true);
        }, 2000);
    };

    if (isGenerating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Gerando seu contrato...</h2>
                    <p className="text-gray-600">Estamos preparando tudo para você</p>
                </div>
            </div>
        );
    }

    if (showPreview) {
        const contractData = convertToContractData(answers);
        return (
            <ContractPreview
                contractData={contractData}
                onBack={() => setShowPreview(false)}
                onGeneratePDF={() => {
                    // Aqui você implementará a geração real do PDF
                    alert('PDF gerado com sucesso!');
                    // window.open('/api/generate-pdf', '_blank');
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 relative">
            <div className="fixed inset-0 z-0">
                <Image
                    src='/bg-question-1.svg'
                    alt="Ilustração de um globo"
                    fill
                    className="object-cover object-right opacity-50"
                    priority
                />
            </div>

            <header className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 z-50">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            {currentStep === 0 ? 'Início' : 'Voltar'}
                        </button>
                        <div className="text-sm text-white">
                            {currentStep + 1} de {contractQuestions.length}
                        </div>
                    </div>
                    <ProgressBar progress={progress} />
                </div>
            </header>

            <main className="relative z-10 min-h-screen flex items-center justify-center">
                <div className="max-w-2xl mx-auto px-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <QuestionStep
                                question={currentQuestion}
                                onAnswer={handleAnswer}
                                allAnswers={answers}
                                currentAnswer={answers[currentQuestion.id]}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}