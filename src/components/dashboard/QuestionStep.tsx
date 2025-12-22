"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getSugestoesBiblioteca } from "@/utils/libraryUtils";
import React from "react";

interface QuestionStepProps {
    question: {
        id: string;
        question: string;
        type: "text" | "textarea" | "select" | "date" | "checkbox" | "radio";
        options?: string[];
        required?: boolean;
        placeholder?: string;
        description?: string;
    };
    onAnswer: (answer: any) => void;
    currentAnswer?: any;
    allAnswers?: Record<string, any>;
}

export default function QuestionStep({
    question,
    onAnswer,
    currentAnswer = "",
}: QuestionStepProps) {
    const [value, setValue] = useState(currentAnswer || "");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const hasShownSuggestionsRef = useRef(false);

    // Atualiza o valor quando o currentAnswer muda
    useEffect(() => {
        setValue(currentAnswer || "");
    }, [currentAnswer]);

    // Fecha sugestões ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
                hasShownSuggestionsRef.current = false;
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // CAPTURAR A TECLA ENTER
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter" && !showSuggestions) {
                e.preventDefault();

                if (!(question.required && !value.trim())) {
                    onAnswer(value);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [value, showSuggestions, question.required, onAnswer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        // Verifica se tem {{ para mostrar sugestões
        if (newValue.includes("{{")) {
            const lastOpenBracket = newValue.lastIndexOf("{{");
            const textAfterBracket = newValue.substring(lastOpenBracket + 2);

            // Não mostra sugestões se já fechou com }}
            if (!textAfterBracket.includes("}}")) {
                // MOSTRA SUGESTÕES IMEDIATAMENTE QUANDO DIGITA {{
                if (!hasShownSuggestionsRef.current) {
                    // Carrega TODAS as sugestões da biblioteca
                    const todasSugestoes = getSugestoesBiblioteca("", 5); // "" busca todas
                    setSuggestions(todasSugestoes);
                    setShowSuggestions(true);
                    hasShownSuggestionsRef.current = true;
                }

                // Se o usuário continuou digitando após {{, filtra as sugestões
                if (textAfterBracket.trim()) {
                    const termoBusca = textAfterBracket.toLowerCase();
                    const sugestoesFiltradas = suggestions.filter(item =>
                        item.nome.toLowerCase().includes(termoBusca) ||
                        item.valor.toLowerCase().includes(termoBusca)
                    );
                    setSuggestions(sugestoesFiltradas);
                }
            } else {
                setShowSuggestions(false);
                hasShownSuggestionsRef.current = false;
            }
        } else {
            setShowSuggestions(false);
            hasShownSuggestionsRef.current = false;
        }
    };

    const handleSuggestionClick = (suggestion: any) => {
        const currentValue = value;
        const lastOpenBracket = currentValue.lastIndexOf("{{");

        if (lastOpenBracket !== -1) {
            let closingBracket = currentValue.indexOf("}}", lastOpenBracket);
            if (closingBracket === -1) {
                closingBracket = currentValue.length;
            }

            const before = currentValue.substring(0, lastOpenBracket);
            const after = currentValue.substring(closingBracket + 2);
            const newValue = before + suggestion.valor + after;
            setValue(newValue);

            if (inputRef.current) {
                inputRef.current.focus();
                const cursorPos = before.length + suggestion.valor.length;
                setTimeout(() => {
                    if (inputRef.current) {
                        inputRef.current.setSelectionRange(cursorPos, cursorPos);
                    }
                }, 10);
            }

            setShowSuggestions(false);
            hasShownSuggestionsRef.current = false;
        }
    };

    const handleSubmit = () => {
        if (question.required && !value.trim()) {
            return;
        }
        onAnswer(value);
    };

    const renderInput = () => {
        const commonProps = {
            value,
            onChange: handleChange,
            onFocus: () => {
                // Mostra sugestões imediatamente ao focar se tiver {{
                if (value.includes("{{") && !value.includes("}}", value.lastIndexOf("{{"))) {
                    const todasSugestoes = getSugestoesBiblioteca("", 50);
                    setSuggestions(todasSugestoes);
                    setShowSuggestions(true);
                    hasShownSuggestionsRef.current = true;
                }
            },
            className: "w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            placeholder: question.placeholder
        };

        switch (question.type) {
            case "textarea":
                return (
                    <div className="relative">
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            {...commonProps}
                            rows={4}
                            className={`${commonProps.className} resize-none`}
                        />
                        {showSuggestions && (
                            <SuggestionsDropdown
                                suggestions={suggestions}
                                onSelect={handleSuggestionClick}
                                ref={suggestionsRef}
                            />
                        )}
                    </div>
                );

            case "select":
                return (
                    <select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione uma opção</option>
                        {question.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            case "date":
                return (
                    <input
                        type="date"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                );

            case "checkbox":
                return (
                    <div className="space-y-2">
                        {question.options?.map((option) => (
                            <label key={option} className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={Array.isArray(value) ? value.includes(option) : false}
                                    onChange={(e) => {
                                        const newValue = Array.isArray(value) ? [...value] : [];
                                        if (e.target.checked) {
                                            newValue.push(option);
                                        } else {
                                            const index = newValue.indexOf(option);
                                            if (index > -1) newValue.splice(index, 1);
                                        }
                                        setValue(newValue);
                                    }}
                                    className="h-5 w-5 text-blue-600 rounded"
                                />
                                <span className="text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case "radio":
                return (
                    <div className="space-y-2">
                        {question.options?.map((option) => (
                            <label key={option} className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option}
                                    checked={value === option}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="h-5 w-5 text-blue-600"
                                />
                                <span className="text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            default: // text
                return (
                    <div className="relative">
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type="text"
                            {...commonProps}
                            placeholder={question.placeholder}
                        />
                        {showSuggestions && (
                            <SuggestionsDropdown
                                suggestions={suggestions}
                                onSelect={handleSuggestionClick}
                                ref={suggestionsRef}
                            />
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                {question.description && (
                    <p className="text-gray-600 text-sm mb-4">{question.description}</p>
                )}
            </div>

            {renderInput()}

            <div className="pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={question.required && !value.trim()}
                    className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${question.required && !value.trim()
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                        }`}
                >
                    {question.type === "textarea" ? "Salvar Resposta" : "Próxima Pergunta"}
                </button>
            </div>
        </div>
    );
}

interface SuggestionsDropdownProps {
    suggestions: any[];
    onSelect: (suggestion: any) => void;
}

const SuggestionsDropdown = React.forwardRef<HTMLDivElement, SuggestionsDropdownProps>(
    ({ suggestions, onSelect }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
                <div className="py-1">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                        Sugestões da sua biblioteca
                    </div>
                    {suggestions.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">
                            Digite para filtrar sugestões
                        </div>
                    ) : (
                        suggestions.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onSelect(item)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors flex items-center justify-between border-b border-gray-100 last:border-b-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-left">
                                        <div className="font-medium text-gray-900">{item.nome}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{item.valor}</div>
                                    </div>
                                </div>
                                {item.usoFrequente && (
                                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                        Frequente
                                    </span>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </motion.div>
        );
    }
);

SuggestionsDropdown.displayName = "SuggestionsDropdown";