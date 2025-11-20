"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Clock, Search, ChevronRight } from "lucide-react";
import { UserDocument } from "@/types/userDocument";
import { useState, useEffect } from "react";
import { useUserDocuments } from "@/hooks/userDocuments";
import { useUserContext } from "@/contexts/UserContext";
import LoadingAnimation from "@/components/shared/LoadingAnimation";
import { getIconByCategory } from "@/utils/documentCategoriesIcons";

interface ContinueDraftsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDraftSelect: (draft: UserDocument) => void;
}

export default function ContinueDraftsModal({
    isOpen,
    onClose,
    onDraftSelect
}: ContinueDraftsModalProps) {
    const { user } = useUserContext();
    const { userDocuments, getUserDocumentDraft, isLoadingUserDocument } = useUserDocuments();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredDrafts, setFilteredDrafts] = useState<UserDocument[]>([]);

    // Carregar rascunhos quando o modal abrir
    useEffect(() => {
        if (isOpen && user?.id) {
            getUserDocumentDraft(user.id, 1, 50).catch(console.error);
        }
    }, [isOpen, user?.id, getUserDocumentDraft]);

    // Filtrar rascunhos baseado na busca
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredDrafts(userDocuments);
        } else {
            const filtered = userDocuments.filter(draft =>
                draft.documentId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                draft.status?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDrafts(filtered);
        }
    }, [searchTerm, userDocuments]);

    const handleDraftSelect = (draft: UserDocument) => {
        onDraftSelect(draft);
        onClose();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
        });
    };


    const getProgressPercentage = (draft: UserDocument) => {
        if (!draft.currentStep || !draft.totalSteps) return 0;
        return Math.round((draft.currentStep / draft.totalSteps) * 100);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'draft':
                return 'Rascunho';
            case 'in_progress':
                return 'Em Andamento';
            case 'completed':
                return 'Concluído';
            default:
                return status;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm z-[9999] overflow-hidden p-0 sm:p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white w-full h-full sm:h-[95vh] sm:max-w-4xl sm:rounded-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex-shrink-0 bg-white border-b border-slate-200">
                            <div className="flex items-center justify-between p-4 sm:p-6">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">
                                            Continuar de onde parou
                                        </h3>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-0.5 truncate">
                                            {userDocuments.length} documento{userDocuments.length !== 1 ? 's' : ''} em andamento
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0 ml-2 group"
                                >
                                    <X className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform duration-200" />
                                </button>
                            </div>

                            {/* Barra de Pesquisa */}
                            <div className="px-4 sm:px-6 pb-4">
                                <div className="relative max-w-full">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Buscar documentos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 sm:py-2 border text-gray-600 border-slate-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm transition-all duration-300 hover:border-slate-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
                            {isLoadingUserDocument ? (
                                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                                    <LoadingAnimation />
                                    <p className="text-slate-600 mt-4 text-sm sm:text-base">Carregando seus documentos...</p>
                                </div>
                            ) : filteredDrafts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
                                    <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mb-3 sm:mb-4" />
                                    <h4 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                                        {searchTerm ? 'Nenhum documento encontrado' : 'Nenhum documento em andamento'}
                                    </h4>
                                    <p className="text-slate-600 text-sm sm:text-base max-w-xs sm:max-w-sm">
                                        {searchTerm
                                            ? 'Tente ajustar os termos da busca.'
                                            : 'Comece criando um novo documento.'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4 sm:space-y-6 max-w-full">
                                    {filteredDrafts.map((draft) => {
                                        const documentCategory = draft.documentId?.category || 'Sem categoria';
                                        const IconComponent = getIconByCategory(documentCategory);

                                        return (
                                            <motion.div
                                                key={draft._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="group relative p-4 sm:p-6 border border-slate-200 rounded-xl sm:rounded-2xl hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white active:scale-[0.98] max-w-full"
                                                onClick={() => handleDraftSelect(draft)}
                                            >
                                                <div className="flex items-start gap-3 sm:gap-4 max-w-full">
                                                    {/* Ícone com gradiente igual ao DocumentCard */}
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                                    </div>

                                                    <div className="flex-1 min-w-0 max-w-full">
                                                        {/* Header com título e badges */}
                                                        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-2">
                                                            <h3 className="font-semibold text-slate-900 text-base sm:text-lg leading-tight line-clamp-2 xs:line-clamp-1 transition-colors duration-300">
                                                                {draft.documentId?.title || 'Documento sem título'}
                                                            </h3>

                                                            {/* Badges */}
                                                            <div className="flex items-center gap-2 flex-wrap">

                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(draft.status)} whitespace-nowrap`}>
                                                                    {getStatusText(draft.status)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Categoria e Informações */}
                                                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-0 mb-3">
                                                            <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-full w-fit">
                                                                {documentCategory.charAt(0).toUpperCase() + documentCategory.slice(1)}
                                                            </span>
                                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {draft.updatedAt ?
                                                                    `Editado ${formatDate(draft.updatedAt)}` :
                                                                    'Sem data'
                                                                }
                                                            </span>
                                                        </div>

                                                        {/* Barra de Progresso */}
                                                        {(draft.currentStep && draft.totalSteps) && (
                                                            <div className="mt-3 max-w-full">
                                                                <div className="flex items-center justify-between text-xs text-slate-600 mb-1 max-w-full">
                                                                    <span className="flex-shrink-0">Progresso</span>
                                                                    <span className="flex-shrink-0">{getProgressPercentage(draft)}%</span>
                                                                </div>
                                                                <div className="w-full bg-slate-200 rounded-full h-1.5 sm:h-2 max-w-full">
                                                                    <div
                                                                        className="bg-green-600 h-1.5 sm:h-2 rounded-full transition-all duration-300 max-w-full group-hover:bg-green-700"
                                                                        style={{ width: `${getProgressPercentage(draft)}%` }}
                                                                    />
                                                                </div>
                                                                <div className="text-xs text-slate-500 mt-1 max-w-full">
                                                                    {draft.currentStep} de {draft.totalSteps} passos
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Rodapé com ação */}
                                                        <div className="flex items-center justify-end mt-3">
                                                            <div className="text-blue-600 text-xs sm:text-sm font-semibold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                                                                Continuar <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Background gradient no hover - igual ao DocumentCard */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-slate-50 opacity-0 group-hover:opacity-100 rounded-xl sm:rounded-2xl transition-opacity duration-300 -z-10" />
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex-shrink-0 border-t border-slate-200 p-3 sm:p-4 bg-slate-50">
                            <div className="flex justify-between items-center max-w-full">
                                <p className="text-xs sm:text-sm text-slate-600 truncate flex-1 mr-2">
                                    {filteredDrafts.length} de {userDocuments.length} documento{userDocuments.length !== 1 ? 's' : ''} mostrado{filteredDrafts.length !== 1 ? 's' : ''}
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}