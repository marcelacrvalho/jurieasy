"use client";

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { UserDocument, DocumentStats } from '@/types/userDocument';

interface UserDocumentContextType {
    // Documentos
    userDocuments: UserDocument[];
    currentDocument: UserDocument | null;

    // Estatísticas
    stats: DocumentStats | null;
    refreshDocuments: () => void; // ✅ APENAS ADICIONE ESTA LINHA
    refreshStats: () => void;

    // Loading states
    isLoadingUserDocument: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    isFetchingStats: boolean;

    // Error
    error: string | null;

    // Setters
    setDocuments: (documents: UserDocument[] | ((prev: UserDocument[]) => UserDocument[])) => void;
    setCurrentDocument: (document: UserDocument | null) => void;
    setStats: (stats: DocumentStats | null) => void;
    setLoading: (loading: boolean) => void;
    setCreating: (creating: boolean) => void;
    setUpdating: (updating: boolean) => void;
    setDeleting: (deleting: boolean) => void;
    setFetchingStats: (fetching: boolean) => void;
    setError: (error: string | null) => void;

    // Utility
    clearError: () => void;
}

const UserDocumentContext = createContext<UserDocumentContextType | undefined>(undefined);

export function UserDocumentProvider({ children }: { children: ReactNode }) {
    // Documentos
    const [userDocuments, setDocuments] = useState<UserDocument[]>([]);
    const [currentDocument, setCurrentDocument] = useState<UserDocument | null>(null);

    // Estatísticas
    const [stats, setStats] = useState<DocumentStats | null>(null);

    // Loading states
    const [isLoadingUserDocument, setIsLoadingUserDocument] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFetchingStats, setIsFetchingStats] = useState(false);

    // Error
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);


    const refreshDocuments = useCallback(() => {
        // Função vazia por enquanto - vamos implementar depois
        console.log('Refresh documents chamado');
    }, []);

    const refreshStats = useCallback(() => {
        // Função vazia por enquanto - vamos implementar depois
        console.log('Refresh stats chamado');
    }, []);

    const value: UserDocumentContextType = {
        // Documentos
        userDocuments,
        currentDocument,
        refreshDocuments, // ✅ ADICIONE ESTA LINHA
        refreshStats,     // ✅ E ESTA LINHA

        // Estatísticas
        stats,

        // Loading states
        isLoadingUserDocument,
        isCreating,
        isUpdating,
        isDeleting,
        isFetchingStats,

        // Error
        error,

        // Setters
        setDocuments,
        setCurrentDocument,
        setStats,
        setLoading: setIsLoadingUserDocument,
        setCreating: setIsCreating,
        setUpdating: setIsUpdating,
        setDeleting: setIsDeleting,
        setFetchingStats: setIsFetchingStats,
        setError,

        // Utility
        clearError,
    };


    return React.createElement(
        UserDocumentContext.Provider,
        { value },
        children
    );
}

export const useUserDocumentContext = () => {
    const context = useContext(UserDocumentContext);
    if (context === undefined) {
        throw new Error('useUserDocumentContext deve ser usado dentro de um UserDocumentProvider');
    }
    return context;
};