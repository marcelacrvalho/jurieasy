"use client";

import { useState } from "react";
import { Question } from "@/lib/contract-questions";

interface QuestionStepProps {
    question: Question;
    onAnswer: (answer: any) => void;
    currentAnswer: any;
}

export default function QuestionStep({ question, onAnswer, currentAnswer }: QuestionStepProps) {
    const [localAnswer, setLocalAnswer] = useState(currentAnswer || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (localAnswer !== "") {
            onAnswer(localAnswer);
        }
    };

    const renderInput = () => {
        switch (question.type) {
            case "text":
                return (
                    <input
                        type="text"
                        value={localAnswer}
                        onChange={(e) => setLocalAnswer(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black sm:text-lg"
                        placeholder={question.placeholder}
                        autoFocus
                    />
                );

            case "textarea":
                return (
                    <textarea
                        value={localAnswer}
                        onChange={(e) => setLocalAnswer(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black sm:text-lg resize-none"
                        placeholder={question.placeholder}
                        autoFocus
                    />
                );

            case "select":
            case "radio":
                return (
                    <div className="space-y-3">
                        {question.options?.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => onAnswer(option.value)}
                                className={`w-full text-left px-4 sm:px-6 py-3 sm:py-4 border-2 rounded-xl transition-all duration-200 ${currentAnswer === option.value
                                    ? 'border-blue-500 bg-blue-500 text-white'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="font-medium text-black">{option.label}</div>
                                {option.description && (
                                    <div
                                        className={`text-xs sm:text-sm mt-1 ${currentAnswer === option.value ? "text-gray" : "text-gray-600"
                                            }`}
                                    >
                                        {option.description}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
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

            <div className="max-w-md mx-auto w-full px-2 sm:px-0">{renderInput()}</div>

            {question.type === "text" || question.type === "textarea" ? (
                <div className="text-center">
                    <button
                        type="submit"
                        className="w-full px-3 py-3 bg-blue-600 rounded-full focus:border-white text-white text-3x1 resize-none"
                    >
                        Continuar
                    </button>
                </div>
            ) : null}

            {question.helpText && (
                <div className="max-w-md mx-auto px-2 sm:px-0">
                    <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                            {question.helpText}
                        </p>
                    </div>
                </div>
            )}
        </form>
    );
}
