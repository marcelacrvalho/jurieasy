"use client";

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Document, DocumentFilters } from '@/types/document';

interface DocumentContextType {
    // Documents data
    documents: Document[];
    currentDocument: Document | null;
    categories: string[];

    // Loading states
    isLoadingDocuments: boolean;
    isLoadingDocument: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    isFetchingCategories: boolean;

    // Error state
    error: string | null;

    // Pagination
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    } | null;

    // Setters
    setDocuments: (documents: Document[] | ((prev: Document[]) => Document[])) => void;
    setCurrentDocument: (document: Document | null) => void;
    setCategories: (categories: string[]) => void;
    setPagination: (pagination: DocumentContextType['pagination']) => void;
    setLoadingDocuments: (loading: boolean) => void;
    setLoadingDocument: (loading: boolean) => void;
    setCreating: (creating: boolean) => void;
    setUpdating: (updating: boolean) => void;
    setDeleting: (deleting: boolean) => void;
    setFetchingCategories: (fetching: boolean) => void;
    setError: (error: string | null) => void;

    // Utility
    clearError: () => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: ReactNode }) {
    // Documents data
    const [documents, setDocuments] = useState<Document[]>([]);
    const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
    const [categories, setCategories] = useState<string[]>([]);

    // Loading states
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
    const [isLoadingDocument, setIsLoadingDocument] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFetchingCategories, setIsFetchingCategories] = useState(false);

    // Error state
    const [error, setError] = useState<string | null>(null);

    // Pagination
    const [pagination, setPagination] = useState<DocumentContextType['pagination']>(null);

    const clearError = () => setError(null);

    const value: DocumentContextType = {
        // Documents data
        documents,
        currentDocument,
        categories,

        // Loading states
        isLoadingDocuments,
        isLoadingDocument,
        isCreating,
        isUpdating,
        isDeleting,
        isFetchingCategories,

        // Error state
        error,

        // Pagination
        pagination,

        // Setters
        setDocuments,
        setCurrentDocument,
        setCategories,
        setPagination,
        setLoadingDocuments: setIsLoadingDocuments,
        setLoadingDocument: setIsLoadingDocument,
        setCreating: setIsCreating,
        setUpdating: setIsUpdating,
        setDeleting: setIsDeleting,
        setFetchingCategories: setIsFetchingCategories,
        setError,

        // Utility
        clearError,
    };

    return React.createElement(
        DocumentContext.Provider,
        { value },
        children
    );
}

export const useDocumentContext = () => {
    const context = useContext(DocumentContext);
    if (context === undefined) {
        throw new Error('useDocumentContext deve ser usado dentro de um DocumentProvider');
    }
    return context;
};