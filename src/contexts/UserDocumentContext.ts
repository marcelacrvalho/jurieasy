// contexts/UserDocumentContext.tsx
"use client";

import React, { createContext, useContext, ReactNode, useState, useCallback, useRef } from 'react';
import { UserDocument, DocumentStats, CreateDocumentData, UpdateDocumentData, DocumentFilters } from '@/types/userDocument';
import { ApiResponse } from '@/types/api';
import { apiClient } from '@/lib/api-client';
import { useUserContext } from '@/contexts/UserContext';

interface UserDocumentContextType {
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

    // Document operations (MESMA ASSINATURA DO HOOK)
    getUserDocuments: (filters?: DocumentFilters) => Promise<UserDocument[]>;
    getUserDocumentDraft: (userId: string, page?: number, limit?: number) => Promise<UserDocument[]>;
    getUserCompletedDocuments: (userId: string, page?: number, limit?: number, search?: string) => Promise<{ documents: UserDocument[], total: number, totalPages: number }>;
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

    // Setters (opcional, para uso interno)
    setCurrentDocument: (document: UserDocument | null) => void;
}

const UserDocumentContext = createContext<UserDocumentContextType | undefined>(undefined);

export function UserDocumentProvider({ children }: { children: ReactNode }) {
    const listeners = useRef<Map<string, Array<() => void>>>(new Map());

    const subscribe = useCallback((documentId: string, callback: () => void) => {
        if (!listeners.current.has(documentId)) {
            listeners.current.set(documentId, []);
        }
        listeners.current.get(documentId)!.push(callback);

        // Retorna função de unsubscribe
        return () => {
            const callbacks = listeners.current.get(documentId);
            if (callbacks) {
                listeners.current.set(documentId, callbacks.filter(cb => cb !== callback));
            }
        };
    }, []);

    const notifyListeners = useCallback((documentId: string) => {
        const callbacks = listeners.current.get(documentId);
        if (callbacks) {
            callbacks.forEach(callback => callback());
        }
    }, []);

    const { user } = useUserContext();
    const updateInProgress = useRef<Set<string>>(new Set());


    // Data states
    const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
    const [currentDocument, setCurrentDocument] = useState<UserDocument | null>(null);
    const [stats, setStats] = useState<DocumentStats | null>(null);

    // Loading states
    const [isLoadingUserDocument, setIsLoadingUserDocument] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFetchingStats, setIsFetchingStats] = useState(false);

    // Error state
    const [error, setError] = useState<string | null>(null);

    // --- Error Utility ---
    const clearError = useCallback(() => setError(null), []);

    // --- Stats Operations ---
    const getUserDocumentStats = useCallback(async (userId: string): Promise<DocumentStats | null> => {
        setIsFetchingStats(true);
        setError(null);

        try {
            console.log('📊 Buscando estatísticas do usuário...', userId);
            const axiosResponse = await apiClient.get<ApiResponse<DocumentStats>>(`/user-documents/stats/${userId}`);
            const responseData = axiosResponse.data;

            console.log('📨 Resposta das estatísticas:', responseData);

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
            setIsFetchingStats(false);
        }
    }, []);

    // --- Document Fetching Operations ---
    const getUserDocumentDraft = useCallback(async (userId: string, page: number = 1, limit: number = 10): Promise<UserDocument[]> => {
        setIsLoadingUserDocument(true);
        setError(null);

        try {
            console.log('📄 Buscando documentos em rascunho...', { userId, page, limit });
            const axiosResponse = await apiClient.get<any>(
                `/user-documents/${userId}/draft?page=${page}&limit=${limit}`
            );
            const responseData = axiosResponse.data;

            console.log('📨 Resposta dos documentos em rascunho:', responseData);

            if (responseData.success && responseData.data) {
                console.log('✅ Documentos em rascunho carregados com sucesso:', responseData.data.length);
                const documentsData = Array.isArray(responseData.data) ? responseData.data : [];

                if (page === 1) {
                    setUserDocuments(documentsData);
                } else {
                    setUserDocuments(prev => [...prev, ...documentsData]);
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
            setIsLoadingUserDocument(false);
        }
    }, []);

    // No seu UserDocumentContext, ajuste a função getUserCompletedDocuments:
    const getUserCompletedDocuments = useCallback(async (
        userId: string,
        page: number = 1,
        limit: number = 10,
        search: string = ""  // Adicione este parâmetro
    ): Promise<{ documents: UserDocument[], total: number, totalPages: number }> => {
        setIsLoadingUserDocument(true);
        setError(null);

        try {
            // Construir URL com parâmetros
            let url = `/user-documents/${userId}/completed?page=${page}&limit=${limit}`;

            // Adicionar search se não estiver vazio
            if (search && search.trim() !== "") {
                url += `&search=${encodeURIComponent(search.trim())}`;
            }

            console.log('🔍 Buscando documentos completados:', { userId, page, limit, search, url });

            const axiosResponse = await apiClient.get<any>(url);
            const responseData = axiosResponse.data;

            console.log('📨 Resposta dos documentos completados:', {
                success: responseData.success,
                count: responseData.data?.length || 0,
                total: responseData.pagination?.total || 0,
                pages: responseData.pagination?.pages || 1,
                search
            });

            if (responseData.success && responseData.data) {
                return {
                    documents: Array.isArray(responseData.data) ? responseData.data : [],
                    total: responseData.pagination?.total || 0,
                    totalPages: responseData.pagination?.pages || 1
                };
            } else {
                setError(responseData.error || 'Erro ao carregar documentos completados');
                return { documents: [], total: 0, totalPages: 1 };
            }
        } catch (err: any) {
            console.error('💥 Erro na requisição dos documentos completados:', err);
            setError(err.message || 'Erro de conexão');
            return { documents: [], total: 0, totalPages: 1 };
        } finally {
            setIsLoadingUserDocument(false);
        }
    }, []);

    const getUserDocuments = useCallback(async (filters?: DocumentFilters): Promise<UserDocument[]> => {
        setIsLoadingUserDocument(true);
        setError(null);

        try {
            const endpoint = `/user-documents/${user?.id}`;
            console.log('📄 Buscando documentos do usuário...', { filters, endpoint });

            const axiosResponse = await apiClient.get<any>(endpoint);
            const responseData = axiosResponse.data;

            if (responseData.success && responseData.data) {
                setUserDocuments(responseData.data);
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
            setIsLoadingUserDocument(false);
        }
    }, [user?.id]);

    const getUserDocument = useCallback(async (documentId: string): Promise<UserDocument | null> => {
        setIsLoadingUserDocument(true);
        setError(null);

        try {
            console.log('📄 Buscando documento...', documentId);
            const axiosResponse = await apiClient.get<any>(`/user-documents/${documentId}`);
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
            setIsLoadingUserDocument(false);
        }
    }, []);

    const createDocument = useCallback(async (data: CreateDocumentData): Promise<UserDocument | null> => {
        setIsCreating(true);
        setError(null);

        // Verifica limite de documentos
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

            const axiosResponse = await apiClient.post<any>('/user-documents', requestData);
            const responseData = axiosResponse.data;

            console.log('📨 Resposta da criação:', responseData);

            if (responseData.success && responseData.data) {
                const newDocument = responseData.data;
                setUserDocuments(prev => [newDocument, ...prev]);
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
            setIsCreating(false);
        }
    }, [user]);

    const updateDocument = useCallback(async (
        documentId: string,
        data: UpdateDocumentData
    ): Promise<UserDocument | null> => {
        // ✅ Verifica se já está atualizando este documento
        if (updateInProgress.current.has(documentId)) {
            console.log('⏭️ Atualização já em andamento para documento', documentId);
            return null;
        }

        // ✅ Marca como em andamento
        updateInProgress.current.add(documentId);

        setIsUpdating(true);
        setError(null);

        try {
            console.log('✏️ Atualizando documento...', { documentId, data });

            const axiosResponse = await apiClient.put<any>(`/user-documents/${documentId}`, data);
            const responseData = axiosResponse.data;

            console.log('📨 Resposta da atualização:', responseData);

            if (responseData.success && responseData.data) {
                const updatedDocument = responseData.data;
                console.log('🔍 Status do documento após atualização:', updatedDocument.status);

                // ✅ Atualiza estado
                setUserDocuments(prev => prev.map(doc =>
                    doc._id === documentId ? updatedDocument : doc
                ));

                // ✅ Notifica listeners
                notifyListeners(updatedDocument);

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
            setIsUpdating(false);
            // ✅ Remove do conjunto de documentos em atualização
            updateInProgress.current.delete(documentId);
        }
    }, [notifyListeners]);

    const deleteDocument = useCallback(async (documentId: string): Promise<boolean> => {
        setIsDeleting(true);
        setError(null);

        try {
            console.log('🗑️ Deletando documento...', documentId);
            const axiosResponse = await apiClient.delete<ApiResponse<{ message: string }>>(`/user-documents/${documentId}`);
            const responseData = axiosResponse.data;

            console.log('📨 Resposta da deleção:', responseData);

            if (responseData.success) {
                console.log('✅ Documento deletado com sucesso');
                setUserDocuments(prev => prev.filter((doc) => doc._id !== documentId));

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
            setIsDeleting(false);
        }
    }, [currentDocument]);

    const refreshDocuments = useCallback(() => {
        if (user?.id) {
            getUserDocumentDraft(user.id);
        }
    }, [user?.id, getUserDocumentDraft]);

    const refreshStats = useCallback(() => {
        if (user?.id) {
            console.log('🔄 Executando refreshStats...');
            getUserDocumentStats(user.id).catch(console.error);
        }
    }, [user?.id, getUserDocumentStats]);

    const value: UserDocumentContextType = {
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

        // Document operations (MESMA ASSINATURA DO HOOK)
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

        // Setters
        setCurrentDocument,
    };

    return React.createElement(
        UserDocumentContext.Provider,
        { value },
        children
    );
}

export const useUserDocuments = () => {
    const context = useContext(UserDocumentContext);
    if (context === undefined) {
        throw new Error('useUserDocuments deve ser usado dentro de um UserDocumentProvider');
    }
    return context;
};