"use client";

import { X, Search, Star, FileText, Briefcase, Home, User, Building, Scale, Zap, ChevronDown } from "lucide-react";
import { DocumentOption, DocumentModalProps } from "../dashboard/Types";
import { useState } from "react";

// Dados dos documentos disponíveis
const documentOptions: DocumentOption[] = [
    {
        id: "1",
        title: "Contrato de Prestação de Serviços",
        description: "Ideal para freelancers e empresas que prestam serviços",
        category: "Trabalhista",
        icon: <FileText className="w-6 h-6" />,
        isPopular: true
    },
    {
        id: "2",
        title: "Compra e Venda",
        description: "Para transações comerciais de produtos e mercadorias",
        category: "Civil",
        icon: <Briefcase className="w-6 h-6" />
    },
    {
        id: "3",
        title: "Locação Residencial",
        description: "Contrato completo para aluguel de imóveis residenciais",
        category: "Imobiliário",
        icon: <Home className="w-6 h-6" />
    },
    {
        id: "4",
        title: "Procuração Geral",
        description: "Delegue poderes específicos para outra pessoa",
        category: "Jurídico",
        icon: <User className="w-6 h-6" />
    },
    {
        id: "5",
        title: "Contrato Societário",
        description: "Para constituição e organização de sociedades",
        category: "Empresarial",
        icon: <Building className="w-6 h-6" />
    },
    {
        id: "6",
        title: "Pensão Socioafetiva",
        description: "Regulamentação de pensão alimentícia",
        category: "Familiar",
        icon: <Scale className="w-6 h-6" />
    },
    {
        id: "7",
        title: "Termo de Confidencialidade",
        description: "Proteja informações sensíveis da sua empresa",
        category: "Empresarial",
        icon: <Zap className="w-6 h-6" />
    },
    {
        id: "8",
        title: "Contrato de Trabalho",
        description: "Modelo completo para contratação de funcionários",
        category: "Trabalhista",
        icon: <FileText className="w-6 h-6" />
    }
];

const categories = [
    "Todos",
    "Trabalhista",
    "Civil",
    "Imobiliário",
    "Jurídico",
    "Empresarial",
    "Familiar"
];

export default function DocumentModal({ isOpen, onClose, onDocumentSelect }: DocumentModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const filteredDocuments = documentOptions.filter(document => {
        const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            document.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "Todos" || document.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDocumentSelect = (document: DocumentOption) => {
        onDocumentSelect(document);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Escolher Modelo de Documento</h2>
                        <p className="text-slate-600 mt-1">Selecione o tipo de documento que deseja criar</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
                    >
                        <X className="w-6 h-6 text-slate-600" />
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou descrição"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 text-gray-700 border border-slate-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative flex-1 sm:flex-none">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 pr-10 text-gray-700 border border-slate-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white appearance-none cursor-pointer hover:border-slate-300"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200 group-hover:text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {filteredDocuments.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum documento encontrado</h3>
                            <p className="text-gray-600">Tente ajustar sua busca ou filtro</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredDocuments.map((document) => (
                                <div
                                    key={document.id}
                                    className="group relative p-6 border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
                                    onClick={() => handleDocumentSelect(document)}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            {document.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-slate-900 text-lg leading-tight">
                                                    {document.title}
                                                </h3>
                                                {document.isPopular && (
                                                    <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                                                        <Star className="w-3 h-3 fill-amber-500" />
                                                        Popular
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                                                {document.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                                                    {document.category}
                                                </span>
                                                <div className="text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform duration-300">
                                                    Selecionar →
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 -z-10" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>{filteredDocuments.length} documentos encontrados</span>
                        <span>Precisa de ajuda? <button className="text-blue-600 hover:text-blue-700 font-medium">Fale conosco</button></span>
                    </div>
                </div>
            </div>
        </div>
    );
}