"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Search, Calendar, Eye, ArrowLeft } from "lucide-react";
import { UserDocument } from "@/types/userDocument";
import { Document } from "@/types/document";
import { useState, useEffect } from "react";
import { useUserDocuments } from "@/hooks/userDocuments";
import { useUserContext } from "@/contexts/UserContext";
import LoadingAnimation from "@/components/shared/LoadingAnimation";
import { getIconByCategory } from "@/utils/documentCategoriesIcons";
import DocumentPreview from "./DocumentPreview";

interface CompletedDocumentsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CompletedDocumentsModal({
    isOpen,
    onClose
}: CompletedDocumentsModalProps) {
    const { user } = useUserContext();
    const { getUserCompletedDocuments, isLoadingUserDocument } = useUserDocuments();

    const [documents, setDocuments] = useState<UserDocument[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDocument, setSelectedDocument] = useState<UserDocument | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Carregar documentos completados quando o modal abrir
    useEffect(() => {
        if (isOpen && user?.id) {
            loadCompletedDocuments();
        }
    }, [isOpen, user?.id]);

    const loadCompletedDocuments = async () => {
        if (!user?.id) return;

        const completedDocs = await getUserCompletedDocuments(user.id);
        setDocuments(completedDocs);
    };

    // Filtrar documentos baseado na busca
    const filteredDocuments = documents.filter(doc =>
        doc.documentId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.documentId?.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewDocument = (document: UserDocument) => {
        setIsTransitioning(true);

        setTimeout(() => {
            setSelectedDocument(document);
            setShowPreview(true);
            setIsTransitioning(false);
        }, 300);
    };

    const handleClosePreview = () => {
        setIsTransitioning(true);

        setTimeout(() => {
            setShowPreview(false);
            setSelectedDocument(null);
            setIsTransitioning(false);
        }, 300);
    };

    const handleDownloadFromPreview = () => {
        // O download é feito no DocumentPreview, apenas fecha após
        handleClosePreview();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleClose = () => {
        setSearchTerm("");
        setDocuments([]);
        setSelectedDocument(null);
        setShowPreview(false);
        onClose();
    };

    // CONTEÚDO DO PREVIEW (substitui o conteúdo do modal)
    const renderPreviewContent = () => (
        <div className="h-full flex flex-col">
            {/* Header do Preview */}
            <div className="flex-shrink-0 bg-white border-b border-slate-200">
                <div className="flex items-center justify-between p-4 md:p-6">
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={handleClosePreview}
                            className="flex items-center gap-1 md:gap-2 text-blue-600 hover:text-blue-800 transition-colors p-1 md:p-2 rounded-full hover:bg-blue-50 text-sm md:text-base"
                        >
                            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="hidden sm:inline">Voltar para lista</span>
                            <span className="sm:hidden">Voltar</span>
                        </button>
                    </div>

                    <button
                        onClick={handleClose}
                        className="p-1 md:p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Conteúdo do Preview - AGORA COM SCROLL */}
            <div className="flex-1 overflow-y-auto">
                {selectedDocument && selectedDocument.documentId && (
                    <DocumentPreview
                        userDocument={selectedDocument}
                        plan={user?.plan ?? ''}
                        template={selectedDocument.documentId as Document}
                        onBack={handleClosePreview}
                        onSave={handleDownloadFromPreview}
                    />
                )}
            </div>
        </div>
    );

    // CONTEÚDO DA LISTA (conteúdo original)
    const renderListContent = () => (
        <div className="flex flex-col h-full">
            {/* Header - FIXO */}
            <div className="flex-shrink-0 bg-white border-b border-slate-200">
                <div className="flex items-center justify-between p-4 md:p-6">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-semibold text-slate-900 truncate">
                            Meus Documentos
                        </h3>
                        <p className="text-slate-600 text-xs md:text-sm mt-0.5 truncate">
                            Visualize e baixe seus documentos concluídos
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 md:p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                    >
                        <X className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
                    </button>
                </div>

                {/* Barra de Pesquisa */}
                <div className="px-4 md:px-6 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar documentos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border text-gray-600 border-slate-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-300 hover:border-slate-400"
                        />
                    </div>
                </div>
            </div>

            {/* Conteúdo - COM SCROLL */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-6">
                    {isLoadingUserDocument ? (
                        <div className="flex flex-col items-center justify-center py-8 md:py-12">
                            <LoadingAnimation />
                            <p className="text-slate-600 mt-4 text-sm md:text-base">Carregando seus documentos...</p>
                        </div>
                    ) : filteredDocuments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
                            <FileText className="w-12 h-12 md:w-16 md:h-16 text-slate-300 mb-3 md:mb-4" />
                            <h4 className="text-base md:text-lg font-semibold text-slate-900 mb-2">
                                {searchTerm ? 'Nenhum documento encontrado' : 'Nenhum documento concluído'}
                            </h4>
                            <p className="text-slate-600 max-w-sm text-sm md:text-base">
                                {searchTerm
                                    ? 'Tente ajustar os termos da busca.'
                                    : 'Os documentos que você concluir aparecerão aqui.'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredDocuments.map((document) => {
                                const documentCategory = document.documentId?.category || 'Sem categoria';
                                const IconComponent = getIconByCategory(documentCategory);

                                return (
                                    <motion.div
                                        key={document._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-white group gap-3"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {/* Ícone */}
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                            </div>

                                            {/* Informações */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-slate-900 text-sm md:text-base leading-tight truncate">
                                                    {document.documentId?.title || 'Documento sem título'}
                                                </h3>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                                                    <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full w-fit">
                                                        {documentCategory.charAt(0).toUpperCase() + documentCategory.slice(1)}
                                                    </span>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(document.updatedAt || document.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Botão Visualizar */}
                                        <button
                                            onClick={() => handleViewDocument(document)}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 flex-shrink-0 w-full sm:w-auto text-sm md:text-base"
                                        >
                                            <Eye className="w-3 h-3 md:w-4 md:h-4" />
                                            <span>Visualizar</span>
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer - FIXO */}
            <div className="flex-shrink-0 border-t border-slate-200 p-3 md:p-4 bg-slate-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <p className="text-xs md:text-sm text-slate-600 text-center sm:text-left">
                        {filteredDocuments.length} documento{filteredDocuments.length !== 1 ? 's' : ''} encontrado{filteredDocuments.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-slate-500 text-center sm:text-right">
                        Clique em "Visualizar" para ver e baixar
                    </p>
                </div>
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999] p-2 sm:p-4">
            <div className={`bg-white rounded-xl md:rounded-2xl shadow-2xl overflow-hidden ${showPreview
                ? 'w-full max-w-6xl h-[95vh] md:h-[95vh]'
                : 'w-full max-w-4xl h-[80vh] md:h-[65vh]'
                } transition-all duration-300`}>
                <div className={`h-full transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    }`}>
                    {showPreview ? renderPreviewContent() : renderListContent()}
                </div>
            </div>
        </div>
    );
}