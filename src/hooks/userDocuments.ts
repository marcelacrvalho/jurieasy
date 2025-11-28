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
    getUserCompletedDocuments: (userId: string, page?: number, limit?: number) => Promise<UserDocument[]>;
    getUserDocument: (documentId: string) => Promise<UserDocument | null>;
    createDocument: (data: CreateDocumentData) => Promise<UserDocument | null>;
    updateDocument: (documentId: string, data: UpdateDocumentData) => Promise<UserDocument | null>;
    deleteDocument: (documentId: string) => Promise<boolean>;

    // Stats operations
    getUserDocumentStats: (userId: string) => Promise<DocumentStats | null>;

    // Utility
    clearError: () => void;
    refreshDocuments: () => void;
    refreshStats: () => void;
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

    // --- Stats Operations ---

    const getUserDocumentStats = useCallback(async (userId: string): Promise<DocumentStats | null> => {
        setFetchingStats(true);
        setError(null);

        try {
            console.log('📊 Buscando estatísticas do usuário...', userId);

            // 1. O Axios retorna um objeto de resposta. A tipagem garante que a propriedade 'data'
            //    contém o seu ApiResponse<DocumentStats>
            const axiosResponse = await apiClient.get<ApiResponse<DocumentStats>>(`/user-documents/stats/${userId}`);

            // 2. Acessamos o corpo da sua API através de .data
            const responseData = axiosResponse.data;

            console.log('📨 Resposta das estatísticas:', responseData);

            // 3. Verificamos as propriedades success/data/error em responseData
            if (responseData.success && responseData.data) {
                console.log('✅ Estatísticas carregadas com sucesso');
                setStats(responseData.data);
                return responseData.data;
            } else {
                console.error('❌ Erro ao buscar estatísticas:', responseData.error);
                setError(responseData.error || 'Erro ao carregar estatísticas');
                return null;
            }
        } catch (err: any) {
            console.error('💥 Erro na requisição das estatísticas:', err);
            setError(err.message || 'Erro de conexão');
            return null;
        } finally {
            setFetchingStats(false);
        }
    }, [setStats, setFetchingStats, setError]);

    // --- Document Fetching Operations ---

    const getUserDocumentDraft = useCallback(async (userId: string, page: number = 1, limit: number = 10): Promise<UserDocument[]> => {
        setLoading(true);
        setError(null);

        try {
            console.log('📄 Buscando documentos em rascunho...', { userId, page, limit });

            // 1. Objeto de resposta do Axios
            const axiosResponse = await apiClient.get<UserDocumentsArrayResponse>(
                `/user-documents/${userId}/draft?page=${page}&limit=${limit}`
            );

            // 2. Acessamos o corpo da sua API através de .data
            const responseData = axiosResponse.data;

            console.log('📨 Resposta dos documentos em rascunho:', responseData);

            if (responseData.success && responseData.data) {
                console.log('✅ Documentos em rascunho carregados com sucesso:', responseData.data.length);

                const documentsData = Array.isArray(responseData.data) ? responseData.data : [];

                // Se for página 1, substitui a lista. Se for paginação, adiciona aos existentes
                if (page === 1) {
                    setDocuments(documentsData);
                } else {
                    setDocuments((prev: UserDocument[]) => [...prev, ...documentsData]);
                }

                return documentsData;
            } else {
                console.error('❌ Erro ao buscar documentos em rascunho:', responseData.error);
                setError(responseData.error || 'Erro ao carregar documentos em rascunho');
                return [];
            }
        } catch (err: any) {
            console.error('💥 Erro na requisição dos documentos em rascunho:', err);
            setError(err.message || 'Erro de conexão');
            return [];
        } finally {
            setLoading(false);
        }
    }, [setDocuments, setLoading, setError]);

    const getUserCompletedDocuments = useCallback(async (userId: string, page: number = 1, limit: number = 20): Promise<UserDocument[]> => {
        setLoading(true);
        setError(null);

        try {
            // 1. Objeto de resposta do Axios
            const axiosResponse = await apiClient.get<UserDocumentsArrayResponse>(
                `/user-documents/${userId}/completed?page=${page}&limit=${limit}`
            );

            // 2. Acessamos o corpo da sua API através de .data
            const responseData = axiosResponse.data;

            if (responseData.success && responseData.data) {
                return Array.isArray(responseData.data) ? responseData.data : [];
            } else {
                setError(responseData.error || 'Erro ao carregar documentos completados');
                return [];
            }
        } catch (err: any) {
            setError(err.message || 'Erro de conexão');
            return [];
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError]);

    const getUserDocuments = useCallback(async (filters?: DocumentFilters): Promise<UserDocument[]> => {
        setLoading(true);
        setError(null);

        try {
            const endpoint = `/user-documents/${user?.id}`;

            console.log('📄 Buscando documentos do usuário...', { filters, endpoint });

            // 1. Objeto de resposta do Axios
            const axiosResponse = await apiClient.get<UserDocumentsArrayResponse>(endpoint);

            // 2. Acessamos o corpo da sua API através de .data
            const responseData = axiosResponse.data;

            console.log('📨 Resposta dos documentos:', responseData);

            if (responseData.success && responseData.data) {
                console.log('✅ Documentos carregados com sucesso:', responseData.data.length);
                setDocuments(responseData.data);
                return responseData.data;
            } else {
                console.error('❌ Erro ao buscar documentos:', responseData.error);
                setError(responseData.error || 'Erro ao carregar documentos');
                return [];
            }
        } catch (err: any) {
            console.error('💥 Erro na requisição dos documentos:', err);
            setError(err.message || 'Erro de conexão');
            return [];
        } finally {
            setLoading(false);
        }
    }, [setDocuments, setLoading, setError, user?.id]);

    const getUserDocument = useCallback(async (documentId: string): Promise<UserDocument | null> => {
        setLoading(true);
        setError(null);

        try {
            console.log('📄 Buscando documento...', documentId);

            // 1. Objeto de resposta do Axios
            const axiosResponse = await apiClient.get<UserDocumentResponse>(`/user-documents/${documentId}`);

            // 2. Acessamos o corpo da sua API através de .data
            const responseData = axiosResponse.data;

            console.log('📨 Resposta do documento:', responseData);

            if (responseData.success && responseData.data) {
                console.log('✅ Documento carregado com sucesso:', responseData.data._id);
                setCurrentDocument(responseData.data);
                return responseData.data;
            } else {
                console.error('❌ Erro ao buscar documento:', responseData.error);
                setError(responseData.error || 'Erro ao carregar documento');
                return null;
            }
        } catch (err: any) {
            console.error('💥 Erro na requisição do documento:', err);
            setError(err.message || 'Erro de conexão');
            return null;
        } finally {
            setLoading(false);
        }
    }, [setCurrentDocument, setLoading, setError]);

    // --- Document CRUD Operations ---

    const createDocument = useCallback(async (data: CreateDocumentData): Promise<UserDocument | null> => {
        setCreating(true);
        setError(null);

        if (user && user.usage && user.usage.documentsRemaining === 0) {
            throw new Error('LIMITE_ATINGIDO');
        }

        try {
            console.log('🆕 Criando documento...', data);

            const requestData = {
                ...data,
                userId: data.userId || user?.id
            };

            if (!requestData.userId) {
                setError('Usuário não autenticado');
                return null;
            }

            // 1. Objeto de resposta do Axios
            const axiosResponse = await apiClient.post<UserDocumentResponse>('/user-documents', requestData);

            // 2. Acessamos o corpo da sua API através de .data
            const responseData = axiosResponse.data;

            console.log('📨 Resposta da criação:', responseData);

            if (responseData.success && responseData.data) {
                const newDocument = responseData.data;
                setDocuments((prev: UserDocument[]) => [newDocument, ...prev]);
                return newDocument;

            } else {
                console.error('❌ Erro ao criar documento:', responseData.error);
                setError(responseData.error || 'Erro ao criar documento');
                return null;
            }
        } catch (err: any) {
            console.error('💥 Erro na criação do documento:', err);
            setError(err.message || 'Erro de conexão');
            return null;
        } finally {
            setCreating(false);
        }
    }, [setDocuments, setCreating, setError, user]);

    const updateDocument = useCallback(async (documentId: string, data: UpdateDocumentData): Promise<UserDocument | null> => {
        setUpdating(true);
        setError(null);

        try {
            console.log('✏️ Atualizando documento...', { documentId, data });

            // 1. Objeto de resposta do Axios
            const axiosResponse = await apiClient.put<UserDocumentResponse>(`/user-documents/${documentId}`, data);

            // 2. Acessamos o corpo da sua API através de .data
            const responseData = axiosResponse.data;

            console.log('📨 Resposta da atualização:', responseData);

            if (responseData.success && responseData.data) {
                const updatedDocument = responseData.data;

                console.log('🔍 Status do documento após atualização:', updatedDocument.status);

                setDocuments((prev: UserDocument[]) => prev.map(doc =>
                    doc._id === documentId ? updatedDocument : doc
                ));

                if (currentDocument?._id === documentId) {
                    setCurrentDocument(updatedDocument);
                }

                return updatedDocument;
            } else {
                console.error('❌ Erro ao atualizar documento:', responseData.error);
                setError(responseData.error || 'Erro ao atualizar documento');
                return null;
            }
        } catch (err: any) {
            console.error('💥 Erro na atualização do documento:', err);
            setError(err.message || 'Erro de conexão');
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

            // 1. Objeto de resposta do Axios
            const axiosResponse = await apiClient.delete<ApiResponse<{ message: string }>>(`/user-documents/${documentId}`);

            // 2. Acessamos o corpo da sua API através de .data
            const responseData = axiosResponse.data;

            console.log('📨 Resposta da deleção:', responseData);

            if (responseData.success) {
                console.log('✅ Documento deletado com sucesso');

                setDocuments((prev: UserDocument[]) => prev.filter((doc) => doc._id !== documentId));

                if (currentDocument?._id === documentId) {
                    setCurrentDocument(null);
                }

                return true;
            } else {
                console.error('❌ Erro ao deletar documento:', responseData.error);
                setError(responseData.error || 'Erro ao deletar documento');
                return false;
            }
        } catch (err: any) {
            console.error('💥 Erro na deleção do documento:', err);
            setError(err.message || 'Erro de conexão');
            return false;
        } finally {
            setDeleting(false);
        }
    }, [setDocuments, setCurrentDocument, currentDocument, setDeleting, setError]);

    // --- Utility ---

    // Mantido como estava, apenas renomeado para maior clareza de propósito
    const refreshDocuments = useCallback(() => {
        if (user?.id) {
            getUserDocumentDraft(user.id);
        }
    }, [user?.id, getUserDocumentDraft]);

    const refreshStats = useCallback(() => {
        if (user?.id) {
            getUserDocumentStats(user.id);
        }
    }, [user?.id, getUserDocumentStats]);

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
        getUserCompletedDocuments,
        getUserDocument,
        createDocument,
        updateDocument,
        deleteDocument,

        // Stats operations
        getUserDocumentStats,

        // Utility
        clearError,
        refreshDocuments,
        refreshStats,
    };
};