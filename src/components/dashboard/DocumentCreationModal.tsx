// components/dashboard/DocumentCreationModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Document } from "@/types/document";
import { UserDocument } from "@/types/userDocument";
import DocumentWizard from "@/components/dashboard/DocumentWizard";
import { useState } from "react";
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

interface DraftData {
    answers: Record<string, any>;
    currentStep: number;
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
    const [currentDraftData, setCurrentDraftData] = useState<DraftData | null>(null);
    const { createDocument, updateDocument } = useUserDocuments();

    const handleWizardComplete = (userDocument: UserDocument) => {
        console.log('✅ Documento criado/atualizado:', userDocument);
        onDocumentCreated(userDocument);
        onClose();
    };

    const handleWizardCancel = () => {
        console.log('❌ Wizard cancelado');
        onClose();
    };

    const handleProgressUpdate = (progress: ProgressInfo) => {
        setProgressInfo(progress);
    };

    const handleSaveDraft = (draftData: DraftData) => {
        setCurrentDraftData(draftData);
    };

    const handleCloseWithSave = async () => {
        if (currentDraftData && !userDocument && document && user) {
            console.log('💾 Salvando rascunho antes de fechar...', currentDraftData);

            try {
                const documentData = {
                    documentId: document._id,
                    answers: currentDraftData.answers,
                    status: 'draft' as const,
                    currentStep: currentDraftData.currentStep,
                    totalSteps: progressInfo?.totalSteps || 0,
                    shouldSave: true,
                    isPublic: false
                };

                const result = await createDocument(documentData);

                if (result) {
                    console.log('✅ Rascunho salvo com sucesso:', result._id);
                    toast.success('Rascunho salvo!');
                    onDocumentCreated(result);
                }
            } catch (error) {
                console.error('❌ Erro ao salvar rascunho:', error);
                toast.error('Erro ao salvar rascunho');
            }
        }

        if (currentDraftData && userDocument) {
            console.log('📝 Atualizando rascunho existente...', currentDraftData);

            try {
                const result = await updateDocument(userDocument._id, {
                    answers: currentDraftData.answers,
                    currentStep: currentDraftData.currentStep,
                    status: 'draft'
                });

                if (result) {
                    console.log('✅ Rascunho atualizado com sucesso');
                    toast.success('Progresso salvo!');
                    onDocumentCreated(result);
                }
            } catch (error) {
                console.error('❌ Erro ao atualizar rascunho:', error);
                toast.error('Erro ao salvar progresso');
            }
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

    // ✅ CORREÇÃO: Retorne JSX, não void
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
                                </div>
                                <button
                                    onClick={handleCloseWithSave}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>


                        </div>

                        {/* Conteúdo - DocumentWizard */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <DocumentWizard
                                documentTemplate={document || undefined}
                                userDocument={userDocument || undefined}
                                onComplete={handleWizardComplete}
                                onCancel={handleWizardCancel}
                                onProgressUpdate={handleProgressUpdate}
                                onSaveDraft={handleSaveDraft}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}