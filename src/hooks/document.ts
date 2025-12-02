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
import axios from 'axios';

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
    getDocuments: (
        filters?: DocumentFilters,
        options?: { skipStateUpdate?: boolean }
    ) => Promise<Document[]>;
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

    // Função auxiliar para tratamento de erros do Axios
    const handleAxiosError = useCallback((err: unknown): string => {
        let errorMessage = 'Erro de conexão ou servidor';

        if (axios.isAxiosError(err) && err.response) {
            // Tenta ler a mensagem de erro que o backend enviou (4xx, 5xx)
            errorMessage = (err.response.data as any)?.error
                || (err.response.data as any)?.message
                || `Erro do servidor: Status ${err.response.status}`;
        }
        console.error('💥 Erro na requisição:', err);
        return errorMessage;
    }, []);

    // GET /documents - Buscar documentos com filtros
    const getDocuments = useCallback(async (
        filters?: DocumentFilters,
        options?: { skipStateUpdate?: boolean } // Novo parâmetro
    ): Promise<Document[]> => {

        // Só ativa o loading global se não for pular a atualização de estado
        if (!options?.skipStateUpdate) setLoadingDocuments(true);

        // Se for uma busca local, talvez você queira limpar o erro localmente no componente, 
        // mas aqui vamos manter a lógica de erro global ou você pode adaptar.
        if (!options?.skipStateUpdate) setError(null);

        try {
            // ... (construção da queryParams mantém igual) ...
            const queryParams = new URLSearchParams();
            if (filters?.category) queryParams.append('category', filters.category);
            if (filters?.search) queryParams.append('search', filters.search);
            // ... outros filtros

            const queryString = queryParams.toString();
            const endpoint = queryString ? `/documents?${queryString}` : '/documents';

            const axiosResponse = await apiClient.get(endpoint);
            const response: DocumentsResponse = axiosResponse.data;

            if (response.success && response.data) {
                // A MÁGICA ACONTECE AQUI:
                if (!options?.skipStateUpdate) {
                    // Comportamento padrão: Atualiza o contexto global
                    setDocuments(response.data);
                    setPagination(response.pagination || null);
                }

                // Sempre retorna os dados para quem chamou
                return response.data;
            } else {
                if (!options?.skipStateUpdate) setError(response.error || 'Erro');
                return [];
            }
        } catch (err) {
            if (!options?.skipStateUpdate) setError(handleAxiosError(err));
            return [];
        } finally {
            if (!options?.skipStateUpdate) setLoadingDocuments(false);
        }
    }, [setDocuments, setPagination, setLoadingDocuments, setError, handleAxiosError]);

    // GET /documents/:id - Buscar documento por ID
    const getDocument = useCallback(async (documentId: string): Promise<Document | null> => {
        setLoadingDocument(true);
        setError(null);

        try {
            console.log('📄 Buscando documento...', documentId);

            // 🚨 CORREÇÃO: Captura a resposta completa do Axios
            const axiosResponse = await apiClient.get(`/documents/${documentId}`);
            const response: DocumentResponse = axiosResponse.data; // 🚨 Acessa o corpo de dados do backend

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
            setError(handleAxiosError(err)); // 🚨 Usa o novo tratador de erros
            return null;
        } finally {
            setLoadingDocument(false);
        }
    }, [setCurrentDocument, setLoadingDocument, setError, handleAxiosError]);

    // POST /documents - Criar documento
    const createDocument = useCallback(async (data: CreateDocumentData): Promise<Document | null> => {
        setCreating(true);
        setError(null);

        try {
            console.log('🆕 Criando documento...', data);

            // 🚨 CORREÇÃO: Captura a resposta completa do Axios
            const axiosResponse = await apiClient.post('/documents', data);
            const response: DocumentResponse = axiosResponse.data; // 🚨 Acessa o corpo de dados do backend

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
            setError(handleAxiosError(err)); // 🚨 Usa o novo tratador de erros
            return null;
        } finally {
            setCreating(false);
        }
    }, [setDocuments, setCreating, setError, handleAxiosError]);

    // PUT /documents/:id - Atualizar documento
    const updateDocument = useCallback(async (documentId: string, data: UpdateDocumentData): Promise<Document | null> => {
        setUpdating(true);
        setError(null);

        try {
            console.log('✏️ Atualizando documento...', { documentId, data });

            // 🚨 CORREÇÃO: Captura a resposta completa do Axios
            const axiosResponse = await apiClient.put(`/documents/${documentId}`, data);
            const response: DocumentResponse = axiosResponse.data; // 🚨 Acessa o corpo de dados do backend

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
            setError(handleAxiosError(err)); // 🚨 Usa o novo tratador de erros
            return null;
        } finally {
            setUpdating(false);
        }
    }, [setDocuments, setCurrentDocument, currentDocument, setUpdating, setError, handleAxiosError]);

    // DELETE /documents/:id - Excluir documento
    const deleteDocument = useCallback(async (documentId: string): Promise<boolean> => {
        setDeleting(true);
        setError(null);

        try {
            console.log('🗑️ Excluindo documento...', documentId);

            // 🚨 CORREÇÃO: Captura a resposta completa do Axios
            const axiosResponse = await apiClient.delete(`/documents/${documentId}`);
            const response: DocumentResponse = axiosResponse.data; // 🚨 Acessa o corpo de dados do backend

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
            setError(handleAxiosError(err)); // 🚨 Usa o novo tratador de erros
            return false;
        } finally {
            setDeleting(false);
        }
    }, [setDocuments, setCurrentDocument, currentDocument, setDeleting, setError, handleAxiosError]);

    // GET /documents/categories - Buscar categorias
    const getCategories = useCallback(async (): Promise<string[]> => {
        setFetchingCategories(true);
        setError(null);

        try {
            console.log('📂 Buscando categorias...');

            // 🚨 CORREÇÃO: Captura a resposta completa do Axios
            const axiosResponse = await apiClient.get('/documents/categories');
            const response: CategoriesResponse = axiosResponse.data; // 🚨 Acessa o corpo de dados do backend

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
            setError(handleAxiosError(err)); // 🚨 Usa o novo tratador de erros
            return [];
        } finally {
            setFetchingCategories(false);
        }
    }, [setCategories, setFetchingCategories, setError, handleAxiosError]);

    return {
        // ... (return object inalterado)
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
        getDocuments,
        getDocument,
        createDocument,
        updateDocument,
        deleteDocument,
        getCategories,
        clearError,
    };
};