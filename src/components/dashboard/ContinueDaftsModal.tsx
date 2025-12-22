"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Clock, Search } from "lucide-react";
import { UserDocument } from "@/types/userDocument";
import { Document } from "@/types/document";
import { useState, useEffect } from "react";
import { useUserDocuments } from "@/contexts/UserDocumentContext";
import { useUserContext } from "@/contexts/UserContext";
import LoadingAnimation from "@/components/shared/LoadingAnimation";
import { DocumentCard } from "@/components/dashboard/DocumentCard";

interface ContinueDraftsModalProps {
    isOpen: boolean;
    onDraftSelect: (draft: UserDocument) => void;
    onClose: () => void;
}

export default function ContinueDraftsModal({
    isOpen,
    onDraftSelect,
    onClose
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

    const handleCardSelect = (item: UserDocument | Document) => {
        // Como estamos no modal de drafts, sabemos que só teremos UserDocuments
        if ('documentId' in item) {
            onDraftSelect(item as UserDocument);
        }
    };

    const handleClose = () => {
        setSearchTerm("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm z-[9999] overflow-hidden p-0 sm:p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white w-full h-full sm:h-[95vh] sm:max-w-4xl sm:rounded-2xl flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
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
                                    onClick={handleClose}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0 ml-2 group"
                                    aria-label="Fechar modal"
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
                                    {filteredDrafts.map((draft) => (
                                        <DocumentCard
                                            key={draft._id}
                                            item={draft}
                                            mode="drafts"
                                            onSelect={handleCardSelect}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex-shrink-0 border-t border-slate-200 p-3 sm:p-4 bg-slate-50">
                            <div className="flex justify-between items-center max-w-full">
                                <p className="text-xs sm:text-sm text-slate-600 truncate flex-1 mr-2">
                                    {filteredDrafts.length} de {userDocuments.length} documento{userDocuments.length !== 1 ? 's' : ''} mostrado{filteredDrafts.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}