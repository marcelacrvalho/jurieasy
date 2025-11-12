// components/dashboard/DocumentManagerModal.tsx
"use client";

import {
    X,
    Search,
    Star,
    FileText,
    Briefcase,
    Home,
    User,
    Building,
    Scale,
    Zap,
    ChevronDown,
    Clock,
    Edit,
    ChevronLeft,
    ChevronRight,
    Plus
} from "lucide-react";
import { DocumentOption } from "../dashboard/Types";
import { useState, useEffect } from "react";
import { UserDocument } from "@/types/userDocument";
import { getIconByCategory } from "@/utils/documentCategoriesIcons";


interface DocumentManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDocumentSelect?: (document: DocumentOption) => void;
    onDraftSelect?: (document: UserDocument) => void;
    mode: 'create' | 'drafts';
    userDocuments?: UserDocument[];
    title?: string;
    description?: string;
    userId?: string;
}

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
    },
    {
        id: "9",
        title: "Contrato de Parceria",
        description: "Para estabelecimento de parcerias comerciais",
        category: "Empresarial",
        icon: <Building className="w-6 h-6" />
    },
    {
        id: "10",
        title: "Termo de Uso",
        description: "Para sites, aplicativos e serviços digitais",
        category: "Jurídico",
        icon: <FileText className="w-6 h-6" />
    },
    {
        id: "11",
        title: "Contrato de Prestação de Serviços TI",
        description: "Especializado para serviços de tecnologia",
        category: "Trabalhista",
        icon: <Zap className="w-6 h-6" />
    },
    {
        id: "12",
        title: "Contrato de Confidencialidade",
        description: "Proteja informações confidenciais da sua empresa",
        category: "Empresarial",
        icon: <Scale className="w-6 h-6" />
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

export default function DocumentManagerModal({
    isOpen,
    onClose,
    onDocumentSelect,
    onDraftSelect,
    mode,
    userDocuments = [],
    title,
    description
}: DocumentManagerModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    // Estados para paginação
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Resetar estados quando o modal abrir
    useEffect(() => {
        if (isOpen) {
            setCurrentPage(1);
            setSearchTerm("");
            setSelectedCategory("Todos");
        }
    }, [isOpen]);

    // Filtrar documentos baseado no modo
    const getFilteredItems = () => {
        if (mode === 'create') {
            return documentOptions.filter(document => {
                const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    document.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = selectedCategory === "Todos" || document.category === selectedCategory;
                return matchesSearch && matchesCategory;
            });
        } else {
            // Para drafts, filtrar userDocuments
            return userDocuments.filter(document => {
                const documentTitle = document.documentId?.title || 'Documento sem título';
                const matchesSearch = documentTitle.toLowerCase().includes(searchTerm.toLowerCase());
                const documentCategory = document.documentId?.category || 'Sem categoria';
                const matchesCategory = selectedCategory === "Todos" || documentCategory === selectedCategory;
                return matchesSearch && matchesCategory;
            });
        }
    };

    const allFilteredItems = getFilteredItems();

    // Calcular itens para a página atual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = allFilteredItems.slice(startIndex, endIndex);

    // Calcular total de páginas
    const totalPages = Math.ceil(allFilteredItems.length / itemsPerPage);

    const handleItemSelect = (item: DocumentOption | UserDocument) => {
        if (mode === 'create' && onDocumentSelect) {
            onDocumentSelect(item as DocumentOption);
        } else if (mode === 'drafts' && onDraftSelect) {
            onDraftSelect(item as UserDocument);
        }
        onClose();
    };

    // Funções de paginação
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const getDefaultTitles = () => {
        if (title && description) return { title, description };

        return mode === 'create'
            ? {
                title: "Escolher Modelo de Documento",
                description: "Selecione o tipo de documento que deseja criar"
            }
            : {
                title: "Meus Rascunhos",
                description: "Continue editando seus documentos em andamento"
            };
    };

    const { title: modalTitle, description: modalDescription } = getDefaultTitles();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{modalTitle}</h2>
                        <p className="text-slate-600 mt-1">{modalDescription}</p>
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
                                placeholder={mode === 'create'
                                    ? "Buscar por nome ou descrição"
                                    : "Buscar seus documentos..."}
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

                {/* Content Grid */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {currentItems.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {mode === 'create' ? 'Nenhum documento encontrado' : 'Nenhum rascunho encontrado'}
                            </h3>
                            <p className="text-gray-600">
                                {mode === 'create'
                                    ? 'Tente ajustar sua busca ou filtro'
                                    : 'Comece criando um novo documento'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentItems.map((item) => (
                                    <DocumentCard
                                        key={mode === 'create' ? (item as DocumentOption).id : (item as UserDocument)._id}
                                        item={item}
                                        mode={mode}
                                        onSelect={handleItemSelect}
                                    />
                                ))}
                            </div>

                            {/* PAGINAÇÃO - Para ambos os modos */}
                            {totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200">
                                    {/* Informação da página */}
                                    <div className="text-sm text-slate-600">
                                        Mostrando {startIndex + 1}-{Math.min(endIndex, allFilteredItems.length)} de {allFilteredItems.length} {mode === 'create' ? 'documentos' : 'rascunhos'}
                                    </div>

                                    {/* Controles de paginação */}
                                    <div className="flex items-center gap-2">
                                        {/* Botão Anterior */}
                                        <button
                                            onClick={goToPrevPage}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>

                                        {/* Números das páginas */}
                                        <div className="flex items-center gap-1">
                                            {[...Array(totalPages)].map((_, index) => {
                                                const pageNumber = index + 1;
                                                // Mostrar apenas algumas páginas ao redor da atual
                                                if (
                                                    pageNumber === 1 ||
                                                    pageNumber === totalPages ||
                                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => goToPage(pageNumber)}
                                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNumber
                                                                ? 'bg-blue-600 text-white'
                                                                : 'text-slate-700 hover:bg-slate-100'
                                                                }`}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                } else if (
                                                    pageNumber === currentPage - 2 ||
                                                    pageNumber === currentPage + 2
                                                ) {
                                                    return (
                                                        <span key={pageNumber} className="text-slate-400">
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>

                                        {/* Botão Próximo */}
                                        <button
                                            onClick={goToNextPage}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>
                            {allFilteredItems.length} {mode === 'create' ? 'documentos' : 'rascunhos'} encontrados
                            {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
                        </span>
                        {mode === 'create' && (
                            <span>Precisa de ajuda? <button className="text-blue-600 hover:text-blue-700 font-medium">Fale conosco</button></span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente interno para o card
interface DocumentCardProps {
    item: DocumentOption | UserDocument;
    mode: 'create' | 'drafts';
    onSelect: (item: DocumentOption | UserDocument) => void;
}

// Componente interno para o card - VERSÃO COM UTILS
interface DocumentCardProps {
    item: DocumentOption | UserDocument;
    mode: 'create' | 'drafts';
    onSelect: (item: DocumentOption | UserDocument) => void;
}

function DocumentCard({ item, mode, onSelect }: DocumentCardProps) {
    // ✅ Agora usando a função importada do utils
    // Remove a função local getIconByCategory daqui

    if (mode === 'create') {
        const document = item as DocumentOption;
        const IconComponent = getIconByCategory(document.category); // ✅ Usando a função importada

        return (
            <div
                className="group relative p-6 border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
                onClick={() => onSelect(document)}
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-5 h-5 text-white" />
                    </div>
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
                            <div className="text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                                Criar <Plus className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 -z-10" />
            </div>
        );
    } else {
        const document = item as UserDocument;
        const documentTitle = document.documentId?.title || 'Documento sem título';
        const documentCategory = document.documentId?.category || 'Sem categoria';
        const IconComponent = getIconByCategory(documentCategory);

        return (
            <div
                className="group relative p-6 border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
                onClick={() => onSelect(document)}
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-2">
                            {documentTitle}
                        </h3>
                        <p className="text-slate-600 text-sm mb-3">
                            {documentCategory.charAt(0).toUpperCase() + documentCategory.slice(1)}
                        </p>

                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {document.updatedAt ? `Editado ${new Date(document.updatedAt).toLocaleDateString()}` : 'Sem data'}
                            </span>
                            <div className="text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                                Continuar <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-slate-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 -z-10" />
            </div>
        );
    }
}