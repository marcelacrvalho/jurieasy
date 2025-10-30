"use client";

import { Question, getPersonalizedText } from '@/lib/contract-questions';
import { useState, useEffect, useRef } from 'react';

interface QuestionStepProps {
    question: Question;
    onAnswer: (answer: any) => void;
    currentAnswer: any;
    allAnswers: Record<string, any>;
}

export default function QuestionStep({ question, onAnswer, currentAnswer, allAnswers }: QuestionStepProps) {
    const [inputValue, setInputValue] = useState(currentAnswer || '');
    const [hasInteracted, setHasInteracted] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    // Aplica personalização
    const personalizedText = getPersonalizedText(question.id, allAnswers);

    const finalTitle = personalizedText.title || question.title;
    const finalDescription = personalizedText.description || question.description;
    const finalPlaceholder = personalizedText.placeholder || question.placeholder;

    // Sincroniza o inputValue e foca no input quando a pergunta muda
    useEffect(() => {
        setInputValue(currentAnswer || '');
        setHasInteracted(false);

        // Foca no input após um pequeno delay para garantir que está renderizado
        const timer = setTimeout(() => {
            if (inputRef.current && (question.type === 'text' || question.type === 'textarea')) {
                inputRef.current.focus();
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [question.id, currentAnswer, question.type]);

    const handleInputChange = (value: string) => {
        setInputValue(value);
        setHasInteracted(true);
    };

    const handleInputBlur = () => {
        // Só salva se o usuário realmente interagiu com o campo
        if (hasInteracted && inputValue !== currentAnswer) {
            onAnswer(inputValue);
        }
    };

    const handleSelectAnswer = (value: any) => {
        // Para selects/radios, salva imediatamente
        onAnswer(value);
    };

    // Função para avançar manualmente (apenas para text/textarea)
    const handleManualAdvance = () => {
        if ((question.type === 'text' || question.type === 'textarea') && inputValue.trim() !== '') {
            onAnswer(inputValue);
        }
    };

    const renderInput = () => {
        switch (question.type) {
            case 'text':
                return (
                    <div className="space-y-4">
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            id={question.id}
                            name={question.id}
                            type="text"
                            value={inputValue}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onBlur={handleInputBlur}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleManualAdvance();
                                }
                            }}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base text-gray-900 placeholder-gray-500"
                            placeholder={finalPlaceholder}
                            autoComplete="off"
                        />
                        {inputValue.trim() && (
                            <button
                                onClick={handleManualAdvance}
                                className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold text-base hover:bg-blue-700 transition-colors"
                            >
                                Continuar
                            </button>
                        )}
                    </div>
                );

            case 'textarea':
                return (
                    <div className="space-y-4">
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            id={question.id}
                            name={question.id}
                            value={inputValue}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onBlur={handleInputBlur}
                            rows={4}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base text-gray-900 placeholder-gray-500 resize-none"
                            placeholder={finalPlaceholder}
                            autoComplete="off"
                        />
                        {inputValue.trim() && (
                            <button
                                onClick={handleManualAdvance}
                                className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold text-base hover:bg-blue-700 transition-colors"
                            >
                                Continuar
                            </button>
                        )}
                    </div>
                );

            case 'select':
                return (
                    <div className="space-y-3">
                        {question.options?.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelectAnswer(option.value)}
                                className={`w-full text-left px-4 py-3 border-2 rounded-xl transition-all duration-200 sm:px-6 sm:py-4 ${currentAnswer === option.value
                                    ? 'border-blue-500 bg-blue-500 text-white'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="font-medium text-sm text-gray-900 sm:text-base">{option.label}</div>
                                {option.description && (
                                    <div className={`text-xs mt-1 sm:text-sm ${currentAnswer === option.value ? 'text-blue-100' : 'text-gray-600'}`}>
                                        {option.description}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                );

            case 'radio':
                return (
                    <div className="space-y-3">
                        {question.options?.map((option) => (
                            <label key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    id={`${question.id}-${option.value}`}
                                    name={question.id}
                                    type="radio"
                                    value={option.value}
                                    checked={currentAnswer === option.value}
                                    onChange={() => handleSelectAnswer(option.value)}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="flex-1">
                                    <div className="font-medium text-sm text-gray-900 sm:text-base">{option.label}</div>
                                    {option.description && (
                                        <div className="text-xs text-gray-600 mt-1 sm:text-sm">{option.description}</div>
                                    )}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
                <h1 className="text-xl font-bold text-white mb-3 leading-tight sm:text-2xl md:text-3xl sm:mb-4">
                    {finalTitle}
                </h1>
                {finalDescription && (
                    <p className="text-sm text-gray-300 max-w-3xl mx-auto leading-relaxed sm:text-base md:text-lg">
                        {finalDescription}
                    </p>
                )}
            </div>

            <div className="max-w-md mx-auto w-full px-2 sm:px-0">
                {renderInput()}
            </div>

            {question.helpText && (
                <div className="max-w-md mx-auto px-2 sm:px-0">
                    <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-3 sm:p-4">
                        <p className="text-xs text-blue-100 leading-relaxed sm:text-sm">
                            {question.helpText}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}