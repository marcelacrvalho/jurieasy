"use client";

import { useState } from 'react';
import { contractQuestions } from '@/lib/contract-questions';
import ProgressBar from './ProgressBar';
import QuestionStep from './QuestionStep';


export default function ContractWizard() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isGenerating, setIsGenerating] = useState(false);

    const currentQuestion = contractQuestions[currentStep];
    const progress = ((currentStep + 1) / contractQuestions.length) * 100;

    const handleAnswer = (answer: any) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: answer
        }));

        if (currentStep < contractQuestions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Última pergunta - gerar contrato
            generateContract();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const generateContract = async () => {
        setIsGenerating(true);
        // Simulação de geração do contrato
        setTimeout(() => {
            setIsGenerating(false);
            alert('Contrato gerado com sucesso! Em breve redirecionaremos para a visualização.');
            // Aqui você integraria com sua API real
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

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white border-b border-gray-200 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Voltar
                        </button>
                        <div className="text-sm text-gray-500">
                            {currentStep + 1} de {contractQuestions.length}
                        </div>
                    </div>
                    <ProgressBar progress={progress} />
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="pt-24 pb-8">
                <div className="max-w-2xl mx-auto px-4">
                    <QuestionStep
                        question={currentQuestion}
                        onAnswer={handleAnswer}
                        currentAnswer={answers[currentQuestion.id]}
                    />
                </div>
            </main>
        </div>
    );
}