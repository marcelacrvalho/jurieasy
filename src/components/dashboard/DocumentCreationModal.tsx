"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Document } from "@/types/document";
import { UserDocument } from "@/types/userDocument";
import DocumentWizard from "@/components/dashboard/DocumentWizard";
import { useState, useEffect } from "react";
import { useUserDocuments } from "@/hooks/userDocuments";
import { useUserContext } from '@/contexts/UserContext';
import toast from "react-hot-toast";

interface DocumentCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    document?: Document | null;
    userDocument?: UserDocument | null;
    onDocumentCreated: (userDocument: UserDocument) => void;
}

interface ProgressInfo {
    currentStep: number;
    totalSteps: number;
    progress: number;
}

export default function DocumentCreationModal({
    isOpen,
    onClose,
    document,
    userDocument,
    onDocumentCreated
}: DocumentCreationModalProps) {
    const { user } = useUserContext();
    const [progressInfo, setProgressInfo] = useState<ProgressInfo | null>(null);
    const [canCreateDocument, setCanCreateDocument] = useState(true);
    const { createDocument, updateDocument, refreshDocuments } = useUserDocuments();

    const isValidDocument = document && document._id;

    useEffect(() => {
        if (isOpen && !userDocument && user) {
            const remaining = user.usage.documentsRemaining;
            setCanCreateDocument(remaining > 0);

            if (remaining <= 0) {
                setTimeout(() => {
                    toast.error(`Limite de documentos atingido! Seu plano ${user.plan} permite ${user.usage.documentsCreated} documentos por mês.`, {
                        duration: 6000,
                        position: 'top-center'
                    });
                }, 300);
            }
        }
    }, [isOpen, userDocument, user]);

    const handleWizardComplete = (userDocument: UserDocument) => {
        onDocumentCreated(userDocument);
        refreshDocuments();

        onClose();
    };

    const handleWizardCancel = () => {
        onClose();
    };

    const handleProgressUpdate = (progress: ProgressInfo) => {
        setProgressInfo(progress);
    };

    const handleCloseWithSave = async () => {
        if (!canCreateDocument && !userDocument) {
            toast.error('Não é possível salvar rascunho. Limite de documentos atingido.');
            onClose();
            return;
        }

        onClose();
    };

    const getModalTitle = () => {
        if (userDocument) {
            return `Editando: ${userDocument.documentId?.title || 'Rascunho'}`;
        }
        if (document) {
            return `Criando: ${document.title}`;
        }
        return 'Documento';
    };

    const renderWizard = () => {
        // ✅ CORREÇÃO: Verificar se pode criar E se o documento é válido
        if (!userDocument && !canCreateDocument) {
            return (
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Limite Atingido
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Você atingiu o limite de {user?.usage.documentsCreated} documentos do seu plano {user?.plan}.
                            Faça upgrade para criar mais documentos.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Entendi
                        </button>
                    </div>
                </div>
            );
        }

        // ✅ CORREÇÃO: Não renderizar wizard se documento não for válido
        if (!userDocument && !isValidDocument) {
            return (
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Documento Inválido
                        </h3>
                        <p className="text-slate-600 mb-4">
                            O documento selecionado não pôde ser carregado. Tente novamente.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <DocumentWizard
                documentTemplate={isValidDocument ? document : undefined} // ✅ Só passa se for válido
                userDocument={userDocument || undefined}
                onComplete={handleWizardComplete}
                onCancel={handleWizardCancel}
                onProgressUpdate={handleProgressUpdate}
            />
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999] overflow-hidden"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-2xl w-full max-w-4xl h-[95vh] flex flex-col overflow-hidden"
                    >
                        {/* Header com ProgressBar */}
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {getModalTitle()}
                                    </h3>
                                    {/* INDICADOR DE USAGE */}
                                    {!userDocument && user && user.plan !== 'escritorio' && (
                                        <span className={`text-xs px-2 py-1 rounded-full ${user.usage.documentsRemaining > 0
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-red-100 text-red-600'
                                            }`}>
                                            {user.usage.documentsRemaining} documentos restantes
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleCloseWithSave}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>
                        </div>

                        {/* Conteúdo - DocumentWizard ou Mensagem de Limite */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {renderWizard()}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}