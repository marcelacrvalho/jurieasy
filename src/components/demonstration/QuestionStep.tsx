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
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black sm:text-lg"
                        placeholder={question.placeholder}
                        autoFocus
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        value={currentAnswer || ''}
                        onChange={(e) => onAnswer(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black sm:text-lg resize-none"
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
                                className={`w-full text-left px-4 sm:px-6 py-3 sm:py-4 border-2 rounded-xl transition-all duration-200 ${currentAnswer === option.value
                                    ? 'border-blue-500 bg-blue-500 text-white'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="font-medium text-sm sm:text-black">{option.label}</div>
                                {option.description && (
                                    <div className={`text-xs sm:text-sm mt-1 ${currentAnswer === option.value ? 'text-blue-100' : 'text-gray-600'}`}>
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
                                    type="radio"
                                    name={question.id}
                                    value={option.value}
                                    checked={currentAnswer === option.value}
                                    onChange={() => onAnswer(option.value)}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="flex-1">
                                    <div className="font-medium text-gray-900 text-sm sm:text-base">{option.label}</div>
                                    {option.description && (
                                        <div className="text-xs sm:text-sm text-gray-600 mt-1">{option.description}</div>
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
            {/* Cabeçalho da Pergunta */}
            <div className="text-center">
                <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                    {question.title}
                </h1>
                {question.description && (
                    <p className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        {question.description}
                    </p>
                )}
            </div>

            {/* Input da Pergunta */}
            <div className="max-w-md mx-auto w-full px-2 sm:px-0">
                {renderInput()}
            </div>

            {/* Ajuda/Observação */}
            {question.helpText && (
                <div className="max-w-md mx-auto px-2 sm:px-0">
                    <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                            {question.helpText}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}