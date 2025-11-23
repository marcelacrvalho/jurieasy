import { useCallback } from 'react';
import {
    UserDocument,
    DocumentStats,
    CreateDocumentData,
    UpdateDocumentData,
    DocumentFilters,
    UserDocumentResponse,
    UserDocumentsArrayResponse
} from '@/types/userDocument';
import { ApiResponse } from '@/types/api';
import { apiClient } from '@/lib/api-client';
import { useUserDocumentContext } from '@/contexts/UserDocumentContext';
import { useUserContext } from '@/contexts/UserContext';

interface UserDocumentsReturn {
    // Data states
    userDocuments: UserDocument[];
    currentDocument: UserDocument | null;
    stats: DocumentStats | null;

    // Loading states
    isLoadingUserDocument: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    isFetchingStats: boolean;

    // Error state
    error: string | null;

    // Document operations
    getUserDocuments: (filters?: DocumentFilters) => Promise<UserDocument[]>;
    getUserDocumentDraft: (userId: string, page?: number, limit?: number) => Promise<UserDocument[]>;
    getUserDocument: (documentId: string) => Promise<UserDocument | null>;
    createDocument: (data: CreateDocumentData) => Promise<UserDocument | null>;
    updateDocument: (documentId: string, data: UpdateDocumentData) => Promise<UserDocument | null>;
    deleteDocument: (documentId: string) => Promise<boolean>;

    // Stats operations
    getUserDocumentStats: (userId: string) => Promise<DocumentStats | null>;

    // Utility
    clearError: () => void;
}

export const useUserDocuments = (): UserDocumentsReturn => {
    const { user } = useUserContext();
    const {
        userDocuments,
        currentDocument,
        stats,
        isLoadingUserDocument,
        isCreating,
        isUpdating,
        isDeleting,
        isFetchingStats,
        error,
        setDocuments,
        setCurrentDocument,
        setStats,
        setLoading,
        setCreating,
        setUpdating,
        setDeleting,
        setFetchingStats,
        setError,
        clearError: contextClearError
    } = useUserDocumentContext();

    const clearError = useCallback(() => {
        contextClearError();
    }, [contextClearError]);

    const getUserDocumentStats = useCallback(async (userId: string): Promise<DocumentStats | null> => {
        setFetchingStats(true);
        setError(null);

        try {
            console.log('📊 Buscando estatísticas do usuário...', userId);

            const response: ApiResponse<DocumentStats> = await apiClient.get(`/user-documents/stats/${userId}`);

            console.log('📨 Resposta das estatísticas:', response);

            if (response.success && response.data) {
                console.log('✅ Estatísticas carregadas com sucesso');
                setStats(response.data);
                return response.data;
            } else {
                console.error('❌ Erro ao buscar estatísticas:', response.error);
                setError(response.error || 'Erro ao carregar estatísticas');
                return null;
            }
        } catch (err) {
            console.error('💥 Erro na requisição das estatísticas:', err);
            setError('Erro de conexão');
            return null;
        } finally {
            setFetchingStats(false);
        }
    }, [setStats, setFetchingStats, setError]);

    const getUserDocumentDraft = useCallback(async (userId: string, page: number = 1, limit: number = 10): Promise<UserDocument[]> => {
        setLoading(true);
        setError(null);

        try {
            console.log('📄 Buscando documentos em rascunho...', { userId, page, limit });

            const response: UserDocumentsArrayResponse = await apiClient.get(
                `/user-documents/${userId}/draft?page=${page}&limit=${limit}`
            );

            console.log('📨 Resposta dos documentos em rascunho:', response);

            if (response.success && response.data) {
                console.log('✅ Documentos em rascunho carregados com sucesso:', response.data.length);

                const documentsData = Array.isArray(response.data) ? response.data : [];

                // Se for página 1, substitui a lista. Se for paginação, adiciona aos existentes
                if (page === 1) {
                    setDocuments(documentsData);
                } else {
                    setDocuments((prev: UserDocument[]) => [...prev, ...documentsData]);
                }

                return documentsData;
            } else {
                console.error('❌ Erro ao buscar documentos em rascunho:', response.error);
                setError(response.error || 'Erro ao carregar documentos em rascunho');
                return [];
            }
        } catch (err) {
            console.error('💥 Erro na requisição dos documentos em rascunho:', err);
            setError('Erro de conexão');
            return [];
        } finally {
            setLoading(false);
        }
    }, [setDocuments, setLoading, setError]);

    const getUserDocuments = useCallback(async (filters?: DocumentFilters): Promise<UserDocument[]> => {
        setLoading(true);
        setError(null);

        try {
            console.log('📄 Buscando documentos do usuário...', { filters });

            // Construir query string com filtros
            const queryParams = new URLSearchParams();
            if (filters?.status) queryParams.append('status', filters.status);
            if (filters?.category) queryParams.append('category', filters.category);
            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.isPublic !== undefined) queryParams.append('isPublic', filters.isPublic.toString());
            if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
            if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

            const queryString = queryParams.toString();
            const endpoint = queryString ? `/user-documents?${queryString}` : '/user-documents';

            const response: UserDocumentsArrayResponse = await apiClient.get(endpoint);

            console.log('📨 Resposta dos documentos:', response);

            if (response.success && response.data) {
                console.log('✅ Documentos carregados com sucesso:', response.data.length);
                setDocuments(response.data);
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
            setLoading(false);
        }
    }, [setDocuments, setLoading, setError]);

    const getUserDocument = useCallback(async (documentId: string): Promise<UserDocument | null> => {
        setLoading(true);
        setError(null);

        try {
            console.log('📄 Buscando documento...', documentId);

            const response: UserDocumentResponse = await apiClient.get(`/user-documents/${documentId}`);

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
            setLoading(false);
        }
    }, [setCurrentDocument, setLoading, setError]);

    const createDocument = useCallback(async (data: CreateDocumentData): Promise<UserDocument | null> => {
        setCreating(true);
        setError(null);

        try {
            console.log('🆕 Criando documento...', data);

            // ✅ CORREÇÃO: Inclui userId automaticamente do contexto
            const requestData = {
                ...data,
                userId: data.userId || user?.id // ✅ Usa o userId do contexto se não foi fornecido
            };

            if (!requestData.userId) {
                setError('Usuário não autenticado');
                return null;
            }

            const response: UserDocumentResponse = await apiClient.post('/user-documents', requestData);

            console.log('📨 Resposta da criação:', response);

            if (response.success && response.data) {
                const newDocument = response.data;
                setDocuments((prev: UserDocument[]) => [newDocument, ...prev]);
                return newDocument;

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
    }, [setDocuments, setCreating, setError, user?.id]); // ✅ Adicione user?.id nas dependências

    const updateDocument = useCallback(async (documentId: string, data: UpdateDocumentData): Promise<UserDocument | null> => {
        setUpdating(true);
        setError(null);

        try {
            console.log('✏️ Atualizando documento...', { documentId, data });

            const response: UserDocumentResponse = await apiClient.put(`/user-documents/${documentId}`, data);

            console.log('📨 Resposta da atualização:', response);

            if (response.success && response.data) {
                const updatedDocument = response.data;

                setDocuments((prev: UserDocument[]) => prev.map(doc =>
                    doc._id === documentId ? updatedDocument : doc
                ));

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

    const deleteDocument = useCallback(async (documentId: string): Promise<boolean> => {
        setDeleting(true);
        setError(null);

        try {
            console.log('🗑️ Deletando documento...', documentId);

            const response: ApiResponse<{ message: string }> = await apiClient.delete(`/user-documents/${documentId}`);

            console.log('📨 Resposta da deleção:', response);

            if (response.success) {
                console.log('✅ Documento deletado com sucesso');

                setDocuments((prev: any[]) => prev.filter((doc: { _id: string; }) => doc._id !== documentId));

                if (currentDocument?._id === documentId) {
                    setCurrentDocument(null);
                }

                return true;
            } else {
                console.error('❌ Erro ao deletar documento:', response.error);
                setError(response.error || 'Erro ao deletar documento');
                return false;
            }
        } catch (err) {
            console.error('💥 Erro na deleção do documento:', err);
            setError('Erro de conexão');
            return false;
        } finally {
            setDeleting(false);
        }
    }, [setDocuments, setCurrentDocument, currentDocument, setDeleting, setError]);

    return {
        // Data states
        userDocuments,
        currentDocument,
        stats,

        // Loading states
        isLoadingUserDocument,
        isCreating,
        isUpdating,
        isDeleting,
        isFetchingStats,

        // Error state
        error,

        // Document operations
        getUserDocuments,
        getUserDocumentDraft,
        getUserDocument,
        createDocument,
        updateDocument,
        deleteDocument,

        // Stats operations
        getUserDocumentStats,

        // Utility
        clearError,
    };
};