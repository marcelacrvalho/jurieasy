import { useCallback } from 'react';
import {
    Document,
    DocumentFilters,
    CreateDocumentData,
    UpdateDocumentData,
    DocumentsResponse,
    DocumentResponse,
    CategoriesResponse,
    PaginationInfo
} from '@/types/document';
import { apiClient } from '@/lib/api-client';
import { useDocumentContext } from '@/contexts/DocumentContext';

interface DocumentsReturn {
    // Data states
    documents: Document[];
    currentDocument: Document | null;
    categories: string[];
    pagination: PaginationInfo | null;

    // Loading states
    isLoadingDocuments: boolean;
    isLoadingDocument: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    isFetchingCategories: boolean;

    // Error state
    error: string | null;

    // Document operations
    getDocuments: (filters?: DocumentFilters) => Promise<Document[]>;
    getDocument: (documentId: string) => Promise<Document | null>;
    createDocument: (data: CreateDocumentData) => Promise<Document | null>;
    updateDocument: (documentId: string, data: UpdateDocumentData) => Promise<Document | null>;
    deleteDocument: (documentId: string) => Promise<boolean>;

    // Categories operations
    getCategories: () => Promise<string[]>;

    // Utility
    clearError: () => void;
}

export const useDocuments = (): DocumentsReturn => {
    const {
        documents,
        currentDocument,
        categories,
        pagination,
        isLoadingDocuments,
        isLoadingDocument,
        isCreating,
        isUpdating,
        isDeleting,
        isFetchingCategories,
        error,
        setDocuments,
        setCurrentDocument,
        setCategories,
        setPagination,
        setLoadingDocuments,
        setLoadingDocument,
        setCreating,
        setUpdating,
        setDeleting,
        setFetchingCategories,
        setError,
        clearError: contextClearError
    } = useDocumentContext();

    const clearError = useCallback(() => {
        contextClearError();
    }, [contextClearError]);

    // GET /documents - Buscar documentos com filtros
    const getDocuments = useCallback(async (filters?: DocumentFilters): Promise<Document[]> => {
        setLoadingDocuments(true);
        setError(null);

        try {
            console.log('📄 Buscando documentos...', { filters });

            // Construir query string com filtros
            const queryParams = new URLSearchParams();
            if (filters?.category) queryParams.append('category', filters.category);
            if (filters?.isPopular !== undefined) queryParams.append('isPopular', filters.isPopular.toString());
            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.page) queryParams.append('page', filters.page.toString());
            if (filters?.limit) queryParams.append('limit', filters.limit.toString());
            if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
            if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

            const queryString = queryParams.toString();
            const endpoint = queryString ? `/documents?${queryString}` : '/documents';

            const response: DocumentsResponse = await apiClient.get(endpoint);

            console.log('📨 Resposta dos documentos:', response);

            if (response.success && response.data) {
                console.log('✅ Documentos carregados com sucesso:', response.data.length);
                setDocuments(response.data);
                setPagination(response.pagination || null);
                return response.data;
            } else {
                console.error('❌ Erro ao buscar documentos:', response.error);
                setError(response.error || 'Erro ao carregar documentos');
                return [];
            }
        } catch (err) {
            console.error('💥 Erro na requisição dos documentos:', err);
            setError('Erro de conexão');
            return [];
        } finally {
            setLoadingDocuments(false);
        }
    }, [setDocuments, setPagination, setLoadingDocuments, setError]);

    // GET /documents/:id - Buscar documento por ID
    const getDocument = useCallback(async (documentId: string): Promise<Document | null> => {
        setLoadingDocument(true);
        setError(null);

        try {
            console.log('📄 Buscando documento...', documentId);

            const response: DocumentResponse = await apiClient.get(`/documents/${documentId}`);

            console.log('📨 Resposta do documento:', response);

            if (response.success && response.data) {
                console.log('✅ Documento carregado com sucesso:', response.data._id);
                setCurrentDocument(response.data);
                return response.data;
            } else {
                console.error('❌ Erro ao buscar documento:', response.error);
                setError(response.error || 'Erro ao carregar documento');
                return null;
            }
        } catch (err) {
            console.error('💥 Erro na requisição do documento:', err);
            setError('Erro de conexão');
            return null;
        } finally {
            setLoadingDocument(false);
        }
    }, [setCurrentDocument, setLoadingDocument, setError]);

    // POST /documents - Criar documento
    const createDocument = useCallback(async (data: CreateDocumentData): Promise<Document | null> => {
        setCreating(true);
        setError(null);

        try {
            console.log('🆕 Criando documento...', data);

            const response: DocumentResponse = await apiClient.post('/documents', data);

            console.log('📨 Resposta da criação:', response);

            if (response.success && response.data) {
                console.log('✅ Documento criado com sucesso:', response.data._id);
                // Atualizar a lista de documentos
                setDocuments(prev => [response.data!, ...prev]);
                return response.data;
            } else {
                console.error('❌ Erro ao criar documento:', response.error);
                setError(response.error || 'Erro ao criar documento');
                return null;
            }
        } catch (err) {
            console.error('💥 Erro na criação do documento:', err);
            setError('Erro de conexão');
            return null;
        } finally {
            setCreating(false);
        }
    }, [setDocuments, setCreating, setError]);

    // PUT /documents/:id - Atualizar documento
    const updateDocument = useCallback(async (documentId: string, data: UpdateDocumentData): Promise<Document | null> => {
        setUpdating(true);
        setError(null);

        try {
            console.log('✏️ Atualizando documento...', { documentId, data });

            const response: DocumentResponse = await apiClient.put(`/documents/${documentId}`, data);

            console.log('📨 Resposta da atualização:', response);

            if (response.success && response.data) {
                console.log('✅ Documento atualizado com sucesso:', response.data._id);
                const updatedDocument = response.data;

                // Atualizar na lista de documentos
                setDocuments(prev => prev.map(doc =>
                    doc._id === documentId ? updatedDocument : doc
                ));

                // Atualizar documento atual se for o mesmo
                if (currentDocument?._id === documentId) {
                    setCurrentDocument(updatedDocument);
                }

                return updatedDocument;
            } else {
                console.error('❌ Erro ao atualizar documento:', response.error);
                setError(response.error || 'Erro ao atualizar documento');
                return null;
            }
        } catch (err) {
            console.error('💥 Erro na atualização do documento:', err);
            setError('Erro de conexão');
            return null;
        } finally {
            setUpdating(false);
        }
    }, [setDocuments, setCurrentDocument, currentDocument, setUpdating, setError]);

    // DELETE /documents/:id - Excluir documento
    const deleteDocument = useCallback(async (documentId: string): Promise<boolean> => {
        setDeleting(true);
        setError(null);

        try {
            console.log('🗑️ Excluindo documento...', documentId);

            const response: DocumentResponse = await apiClient.delete(`/documents/${documentId}`);

            console.log('📨 Resposta da exclusão:', response);

            if (response.success) {
                console.log('✅ Documento excluído com sucesso');

                // Remover da lista de documentos
                setDocuments(prev => prev.filter(doc => doc._id !== documentId));

                // Limpar documento atual se for o mesmo
                if (currentDocument?._id === documentId) {
                    setCurrentDocument(null);
                }

                return true;
            } else {
                console.error('❌ Erro ao excluir documento:', response.error);
                setError(response.error || 'Erro ao excluir documento');
                return false;
            }
        } catch (err) {
            console.error('💥 Erro na exclusão do documento:', err);
            setError('Erro de conexão');
            return false;
        } finally {
            setDeleting(false);
        }
    }, [setDocuments, setCurrentDocument, currentDocument, setDeleting, setError]);

    // GET /documents/categories - Buscar categorias
    const getCategories = useCallback(async (): Promise<string[]> => {
        setFetchingCategories(true);
        setError(null);

        try {
            console.log('📂 Buscando categorias...');

            const response: CategoriesResponse = await apiClient.get('/documents/categories');

            console.log('📨 Resposta das categorias:', response);

            if (response.success && response.data) {
                console.log('✅ Categorias carregadas com sucesso:', response.data.length);
                setCategories(response.data);
                return response.data;
            } else {
                console.error('❌ Erro ao buscar categorias:', response.error);
                setError(response.error || 'Erro ao carregar categorias');
                return [];
            }
        } catch (err) {
            console.error('💥 Erro na requisição das categorias:', err);
            setError('Erro de conexão');
            return [];
        } finally {
            setFetchingCategories(false);
        }
    }, [setCategories, setFetchingCategories, setError]);

    return {
        // Data states
        documents,
        currentDocument,
        categories,
        pagination,

        // Loading states
        isLoadingDocuments,
        isLoadingDocument,
        isCreating,
        isUpdating,
        isDeleting,
        isFetchingCategories,

        // Error state
        error,

        // Document operations
        getDocuments,
        getDocument,
        createDocument,
        updateDocument,
        deleteDocument,

        // Categories operations
        getCategories,

        // Utility
        clearError,
    };
};