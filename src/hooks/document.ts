// hooks/documents.ts
import useSWR from 'swr';
import { useState, useCallback } from 'react';
import {
    Document,
    DocumentsListResponse,
    DocumentResponse,
    DocumentFilters,
    DocumentListParams
} from '@/types/document';
import { PaginationInfo } from '@/types/api';
import { apiClient } from '@/lib/api-client';
import { swrFetcher } from '@/lib/fetcher';

interface DocumentsReturn {
    // Data states
    documents: Document[];
    currentDocument: Document | null;
    pagination: PaginationInfo | null;

    // Loading states
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    isFetchingSingle: boolean;
    isFetchingList: boolean;

    // Error states
    error: string | null;

    // CRUD operations
    createDocument: (data: Partial<Document>) => Promise<boolean>;
    updateDocument: (id: string, data: Partial<Document>) => Promise<boolean>;
    deleteDocument: (id: string) => Promise<boolean>;
    getDocument: (id: string) => Promise<Document | null>;
    getDocuments: (params?: DocumentListParams) => Promise<Document[]>;
    setCurrentDocument: (document: Document | null) => void;

    // List operations
    loadDocuments: (params?: DocumentListParams) => void;
    refetchDocuments: () => void;
    clearError: () => void;

    // Pagination
    currentPage: number;
    goToPage: (page: number) => void;

    // Filters
    currentFilters: DocumentFilters;
    setFilters: (filters: DocumentFilters) => void;
    clearFilters: () => void;
}

export const documents = (): DocumentsReturn => {
    const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFetchingSingle, setIsFetchingSingle] = useState(false);
    const [isFetchingList, setIsFetchingList] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(20);
    const [currentFilters, setCurrentFilters] = useState<DocumentFilters>({});

    // Build query string from params
    const buildQueryString = useCallback((params: DocumentListParams) => {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.category) searchParams.append('category', params.category);
        if (params.search) searchParams.append('search', params.search);
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        // Add filters
        Object.entries(currentFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => searchParams.append(key, v.toString()));
                } else {
                    searchParams.append(key, value.toString());
                }
            }
        });

        return searchParams.toString();
    }, [currentFilters]);

    // SWR para listagem paginada de documents
    const {
        data,
        error: swrError,
        isLoading,
        mutate
    } = useSWR<DocumentsListResponse>(
        `/documents?${buildQueryString({ page: currentPage, limit: currentLimit })}`,
        swrFetcher
    );

    // Clear error
    const clearError = useCallback(() => setError(null), []);

    const getDocuments = useCallback(async (params: DocumentListParams = {}): Promise<Document[]> => {
        setIsFetchingList(true);
        setError(null);

        try {
            const { page = 1, limit = 100, ...filters } = params;

            const response = await apiClient.getPaginated<Document>(
                '/documents',
                page,
                limit
            );

            if (response.success && response.data) {
                return response.data;
            } else {
                setError(response.error || response.message || 'Erro ao buscar documents');
                return [];
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            return [];
        } finally {
            setIsFetchingList(false);
        }
    }, []);


    // Carregar documents com parâmetros (atualiza o SWR)
    const loadDocuments = useCallback((params: DocumentListParams = {}) => {
        if (params.page) setCurrentPage(params.page);
        if (params.limit) setCurrentLimit(params.limit);
        if (params.category) setCurrentFilters(prev => ({ ...prev, category: params.category }));
        if (params.search) setCurrentFilters(prev => ({ ...prev, search: params.search }));
    }, []);

    // Navegação de páginas
    const goToPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // Aplicar filtros
    const setFilters = useCallback((filters: DocumentFilters) => {
        setCurrentFilters(filters);
        setCurrentPage(1);
    }, []);

    // Limpar filtros
    const clearFilters = useCallback(() => {
        setCurrentFilters({});
        setCurrentPage(1);
    }, []);

    // CREATE - Criar novo document
    const createDocument = useCallback(async (documentData: Partial<Document>): Promise<boolean> => {
        setIsCreating(true);
        setError(null);

        try {
            const response: DocumentResponse = await apiClient.post<Document>('/documents', documentData);

            if (response.success && response.data) {
                await mutate();
                setCurrentDocument(response.data);
                return true;
            } else {
                setError(response.error || response.message || 'Erro ao criar document');
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            return false;
        } finally {
            setIsCreating(false);
        }
    }, [mutate]);

    const getDocument = useCallback(async (id: string): Promise<Document | null> => {
        setIsFetchingSingle(true);
        setError(null);

        try {
            const response: DocumentResponse = await apiClient.get<Document>(`/documents/${id}`);

            if (response.success && response.data) {
                setCurrentDocument(response.data);
                return response.data;
            } else {
                setError(response.error || response.message || 'Document não encontrado');
                return null;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            return null;
        } finally {
            setIsFetchingSingle(false);
        }
    }, []);

    const updateDocument = useCallback(async (id: string, updateData: Partial<Document>): Promise<boolean> => {
        setIsUpdating(true);
        setError(null);

        try {
            const response: DocumentResponse = await apiClient.put<Document>(`/documents/${id}`, updateData);

            if (response.success && response.data) {
                await mutate();
                setCurrentDocument(response.data);
                return true;
            } else {
                setError(response.error || response.message || 'Erro ao atualizar document');
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            return false;
        } finally {
            setIsUpdating(false);
        }
    }, [mutate]);

    const deleteDocument = useCallback(async (id: string): Promise<boolean> => {
        setIsDeleting(true);
        setError(null);

        try {
            const response = await apiClient.delete<{ message: string }>(`/documents/${id}`);

            if (response.success) {
                await mutate();

                if (currentDocument?._id === id) {
                    setCurrentDocument(null);
                }

                return true;
            } else {
                setError(response.error || response.message || 'Erro ao deletar document');
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            return false;
        } finally {
            setIsDeleting(false);
        }
    }, [mutate, currentDocument]);

    // Refetch documents
    const refetchDocuments = useCallback(() => {
        mutate();
    }, [mutate]);

    return {
        documents: data?.data || [],
        currentDocument,
        pagination: data?.pagination || null,

        // Loading states
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        isFetchingSingle,
        isFetchingList, // ✅ Novo estado

        // Error
        error: error || (swrError?.message || null),

        // Pagination
        currentPage,

        // Filters
        currentFilters,
        setFilters,
        clearFilters,

        // Operations
        createDocument,
        updateDocument,
        deleteDocument,
        getDocument,
        getDocuments,
        setCurrentDocument,
        loadDocuments,
        refetchDocuments,
        goToPage,
        clearError,
    };
};