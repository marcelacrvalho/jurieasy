"use client";

import {
    X,
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import { UserDocument } from "@/types/userDocument";
import { Document } from "@/types/document";
import { DocumentCard } from "../shared/DocumentCard";
import DocumentWizard from "./DocumentWizard";
import { User } from "@/types/user";
import { useDocuments } from "@/hooks/document";
// Certifique-se de ter este hook (código no final da resposta se não tiver)
import { useDebounce } from "@/utils/debounce";

interface DocumentManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDocumentSelect?: (document: Document) => void;
    onDraftSelect?: (document: UserDocument) => void;
    mode: 'create' | 'drafts';
    userDocuments?: UserDocument[];
    // documents removido pois virá da API localmente
    title?: string;
    description?: string;
    userId?: string;
    user?: User;
}

const categories = [
    "Todos",
    "Trabalhista",
    "Civil",
    "Imobiliário",
    "Jurídico",
    "Empresarial",
    "Família"
];

export default function DocumentManagerModal({
    isOpen,
    onClose,
    onDocumentSelect,
    onDraftSelect,
    mode,
    userDocuments = [],
    user,
    title,
    description
}: DocumentManagerModalProps) {
    const { getDocuments: fetchDocumentsApi } = useDocuments();

    // Estados para controlar a substituição de conteúdo
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [selectedDraft, setSelectedDraft] = useState<UserDocument | null>(null);
    const [showWizard, setShowWizard] = useState(false);

    // Estados de filtro
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce para evitar chamadas excessivas na API
    const debouncedSearch = useDebounce(searchTerm, 500);

    // Estados locais de dados
    const [localDocuments, setLocalDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Para paginação funcionar corretamente com server-side, 
    // idealmente a API retornaria o total. Aqui vamos estimar ou precisar adaptar o hook.
    // Por enquanto, vou assumir que se vier menos que o limit, acabou as páginas.
    const itemsPerPage = 6;

    let startIndex = 0;
    let endIndex = 0;

    // --- CORREÇÃO 1: FETCH DATA EFFECT ---
    useEffect(() => {
        const loadDocuments = async () => {
            if (!isOpen || mode !== 'create') return;

            setIsLoading(true);
            try {
                // Passamos skipStateUpdate: true (conforme sua alteração no hook)
                const data = await fetchDocumentsApi({
                    category: selectedCategory === "Todos" ? undefined : selectedCategory,
                    search: debouncedSearch,
                    page: currentPage,
                    limit: itemsPerPage,
                    isPopular: false // ou conforme necessidade
                }, { skipStateUpdate: true });

                setLocalDocuments(data || []);
            } catch (error) {
                console.error("Erro ao carregar documentos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDocuments();
    }, [isOpen, mode, selectedCategory, debouncedSearch, currentPage, fetchDocumentsApi]);

    // Resetar estados quando o modal abrir
    useEffect(() => {
        if (isOpen) {
            setCurrentPage(1);
            setSearchTerm("");
            setSelectedCategory("Todos");
            setShowWizard(false);
            setSelectedDocument(null);
            setSelectedDraft(null);
            // Se for modo create, limpamos a lista anterior para não mostrar dados velhos
            if (mode === 'create') setLocalDocuments([]);
        }
    }, [isOpen, mode]);

    // --- CORREÇÃO 2: LÓGICA DE FILTRAGEM E PAGINAÇÃO ---

    // Preparar os itens para renderização
    let currentItems: (Document | UserDocument)[] = [];
    let totalPages = 1;
    let totalItemsCount = 0;

    if (mode === 'create') {
        // No modo CREATE, a API já devolve paginado e filtrado.
        currentItems = localDocuments;

        // 🟢 CORREÇÃO: Calcular startIndex e endIndex para fins de exibição
        startIndex = (currentPage - 1) * itemsPerPage;
        endIndex = startIndex + localDocuments.length; // Usa o length real dos itens carregados

        const hasNextPage = localDocuments.length === itemsPerPage;
        totalPages = hasNextPage ? currentPage + 1 : currentPage;
        totalItemsCount = localDocuments.length; // Aqui, representa o total da PÁGINA, não o total geral.
    } else {
        // No modo DRAFTS, filtramos localmente o array estático userDocuments
        const filteredDrafts = userDocuments.filter(document => {
            const documentTitle = document.documentId?.title || 'Documento sem título';

            // 🟢 CORREÇÃO AQUI: Use debouncedSearch para a lógica de filtragem.
            // Isso garante que a filtragem pesada (e a re-renderização resultante do filtro)
            // só ocorra após o usuário parar de digitar.
            const matchesSearch = documentTitle.toLowerCase().includes(debouncedSearch.toLowerCase());

            const documentCategory = document.documentId?.category || 'Sem categoria';
            const matchesCategory = selectedCategory === "Todos" || documentCategory === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        totalItemsCount = filteredDrafts.length;
        totalPages = Math.ceil(totalItemsCount / itemsPerPage);

        // Atribuição correta no modo drafts:
        startIndex = (currentPage - 1) * itemsPerPage;
        endIndex = startIndex + itemsPerPage;
        currentItems = filteredDrafts.slice(startIndex, endIndex);
    }

    const handleItemSelect = async (item: Document | UserDocument) => {
        if (mode === 'create') {
            const document = item as Document;
            setSelectedDocument(document);
            setShowWizard(true);
        } else if (mode === 'drafts') {
            const draft = item as UserDocument;
            setSelectedDraft(draft);
            setShowWizard(true);
        }
    };

    const handleWizardComplete = (userDocument: UserDocument) => {
        setShowWizard(false);
        setSelectedDocument(null);
        setSelectedDraft(null);
        onClose();
        if (onDocumentSelect && selectedDocument) {
            onDocumentSelect(selectedDocument);
        }
    };

    const handleWizardCancel = () => {
        setShowWizard(false);
        setSelectedDocument(null);
        setSelectedDraft(null);
    };

    const handleCloseAll = () => {
        setShowWizard(false);
        setSelectedDocument(null);
        setSelectedDraft(null);
        onClose();
    };

    // Funções de paginação
    const goToNextPage = () => {
        // No modo create (API), permitimos ir se tivermos itens cheios na página atual
        if (mode === 'create') {
            if (localDocuments.length === itemsPerPage) setCurrentPage(p => p + 1);
        } else {
            if (currentPage < totalPages) setCurrentPage(p => p + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getDefaultTitles = () => {
        if (title && description) return { title, description };
        return mode === 'create'
            ? { title: "Escolher Modelo", description: "Selecione o tipo de documento que deseja criar" }
            : { title: "Meus Rascunhos", description: "Continue editando seus documentos em andamento" };
    };

    const { title: modalTitle, description: modalDescription } = getDefaultTitles();

    if (!isOpen) return null;

    const renderWizardContent = () => (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        {selectedDocument?.title || selectedDraft?.documentId?.title || 'Criando Documento'}
                    </h2>
                    {user != null ? (
                        <span className={`text-xs px-3 py-1.5 rounded-full ${user.usage.documentsRemaining > 0
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                            }`}>
                            {user.usage.documentsRemaining} {user.usage.documentsRemaining === 1 ? 'documento' : 'documentos'} restante{user.usage.documentsRemaining !== 1 ? 's' : ''}
                        </span>
                    ) : ''}
                </div>
                <button
                    onClick={handleCloseAll}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-6 h-6 text-gray-600" />
                </button>
            </div>
            <div className="flex-1 overflow-hidden">
                <DocumentWizard
                    documentTemplate={selectedDocument || undefined}
                    userDocument={selectedDraft || undefined}
                    onComplete={handleWizardComplete}
                    onCancel={handleWizardCancel}
                    onClose={handleCloseAll}
                />
            </div>
        </div>
    );

    const renderSelectionContent = () => (
        <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{modalTitle}</h2>
                    <p className="text-slate-600 mt-1">{modalDescription}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200">
                    <X className="w-6 h-6 text-slate-600" />
                </button>
            </div>

            {/* Search and Filter */}
            <div className="p-6 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={mode === 'create' ? "Buscar por nome ou descrição" : "Buscar seus documentos..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 text-gray-700 border border-slate-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <div className="relative flex-1 sm:flex-none">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-3 pr-10 text-gray-700 border border-slate-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white appearance-none cursor-pointer hover:border-slate-300"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
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
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500">Carregando...</div>
                ) : currentItems.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {mode === 'create' ? 'Nenhum documento encontrado' : 'Nenhum rascunho encontrado'}
                        </h3>
                        <p className="text-gray-600">
                            {mode === 'create' ? 'Tente ajustar sua busca ou filtro' : 'Comece criando um novo documento'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentItems.map((item) => (
                                <DocumentCard
                                    key={mode === 'create' ? (item as Document)._id : (item as UserDocument)._id}
                                    item={item}
                                    mode={mode}
                                    onSelect={handleItemSelect}
                                />
                            ))}
                        </div>

                        {/* PAGINAÇÃO SIMPLIFICADA */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200">
                            <div className="text-sm text-slate-600">
                                {mode === 'create'
                                    ? `Página ${currentPage}`
                                    : `Mostrando ${startIndex + 1}-${Math.min(endIndex, totalItemsCount)} de ${totalItemsCount}`}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={goToPrevPage}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                                </button>

                                <span className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 rounded-lg">
                                    {currentPage}
                                </span>

                                <button
                                    onClick={goToNextPage}
                                    // No create, desabilita se a pagina atual veio incompleta (significa que é a ultima)
                                    disabled={mode === 'create' ? localDocuments.length < itemsPerPage : currentPage === totalPages}
                                    className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>
                        {totalPages > 1 && ` Página ${currentPage} de ${totalPages}`}
                    </span>
                    {mode === 'create' && (
                        <span>Precisa de ajuda? <button className="text-blue-600 hover:text-blue-700 font-medium">Fale conosco</button></span>
                    )}
                </div>

            </div>
        </>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${showWizard
                ? 'w-full max-w-4xl h-[90vh]'
                : 'w-full max-w-4xl max-h-[90vh]'
                }`}>
                {showWizard ? renderWizardContent() : renderSelectionContent()}
            </div>
        </div>
    );
}