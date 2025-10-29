"use client";

import { Question } from '@/lib/contract-questions';

interface QuestionStepProps {
    question: Question;
    onAnswer: (answer: any) => void;
    currentAnswer: any;
}

export default function QuestionStep({ question, onAnswer, currentAnswer }: QuestionStepProps) {
    const renderInput = () => {
        switch (question.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={currentAnswer || ''}
                        onChange={(e) => onAnswer(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        placeholder={question.placeholder}
                        autoFocus
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        value={currentAnswer || ''}
                        onChange={(e) => onAnswer(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg resize-none"
                        placeholder={question.placeholder}
                        autoFocus
                    />
                );

            case 'select':
                return (
                    <div className="space-y-3">
                        {question.options?.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => onAnswer(option.value)}
                                className={`w-full text-left px-6 py-4 border-2 rounded-xl transition-all duration-200 ${currentAnswer === option.value
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="font-medium">{option.label}</div>
                                {option.description && (
                                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                                )}
                            </button>
                        ))}
                    </div>
                );

            case 'radio':
                return (
                    <div className="space-y-3">
                        {question.options?.map((option) => (
                            <label key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option.value}
                                    checked={currentAnswer === option.value}
                                    onChange={() => onAnswer(option.value)}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="flex-1">
                                    <div className="font-medium">{option.label}</div>
                                    {option.description && (
                                        <div className="text-sm text-gray-600 mt-1">{option.description}</div>
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
        <div className="space-y-8">
            {/* Cabeçalho da Pergunta */}
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    {question.title}
                </h1>
                {question.description && (
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {question.description}
                    </p>
                )}
            </div>

            {/* Input da Pergunta */}
            <div className="max-w-md mx-auto w-full">
                {renderInput()}
            </div>

            {/* Ajuda/Observação */}
            {question.helpText && (
                <div className="max-w-md mx-auto">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-700">{question.helpText}</p>
                    </div>
                </div>
            )}
        </div>
    );
}