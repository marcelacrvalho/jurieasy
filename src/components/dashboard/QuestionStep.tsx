"use client";

import { useState } from "react";

interface Question {
    id: string;
    text?: string;
    question?: string;
    type: 'text' | 'select' | 'radio' | 'checkbox' | 'date' | 'number' | 'textarea';
    options?: string[];
    required?: boolean;
    placeholder?: string;
    validation?: {
        pattern?: string;
        min?: number;
        max?: number;
    };
    variableId?: string;
    order?: number;
}

interface QuestionStepProps {
    question: Question;
    onAnswer: (answer: any) => void;
    allAnswers: Record<string, any>;
    currentAnswer: any;
}

export default function QuestionStep({ question, onAnswer, allAnswers, currentAnswer }: QuestionStepProps) {
    const [inputValue, setInputValue] = useState(currentAnswer || '');

    // Use text se disponível, caso contrário use question (fallback)
    const questionText = question.text || question.question || 'Pergunta';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (question.required && !inputValue) {
            return;
        }

        onAnswer(inputValue);
        setInputValue('');
    };

    const renderInput = () => {
        switch (question.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={question.placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={question.required}
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={question.placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={4}
                        required={question.required}
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={question.placeholder}
                        min={question.validation?.min}
                        max={question.validation?.max}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={question.required}
                    />
                );

            case 'date':
                return (
                    <input
                        type="date"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={question.required}
                    />
                );

            case 'select':
                return (
                    <select
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={question.required}
                    >
                        <option value="">Selecione uma opção</option>
                        {question.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            case 'radio':
                return (
                    <div className="space-y-3">
                        {question.options?.map((option) => (
                            <label key={option} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option}
                                    checked={inputValue === option}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    required={question.required}
                                />
                                <span className="text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            default:
                return (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={question.placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={question.required}
                    />
                );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {questionText}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                </h2>

                {renderInput()}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={question.required && !inputValue}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                    {currentAnswer ? 'Continuar' : 'Próximo'}
                </button>
            </div>
        </form>
    );
}