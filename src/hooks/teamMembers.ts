import { useState } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { apiClient } from '@/lib/api-client';
import axios from 'axios';

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    permissions: {
        createDocuments: boolean;
        editDocuments: boolean;
        deleteDocuments: boolean;
        manageTemplates: boolean;
        inviteMembers: boolean;
    };
    usage?: {
        documentsCreated: number;
    };
}

export interface AddTeamMemberData {
    email: string;
    name: string;
    password: string;
    role?: 'viewer' | 'editor' | 'manager';
    permissions?: {
        createDocuments?: boolean;
        editDocuments?: boolean;
        deleteDocuments?: boolean;
        manageTemplates?: boolean;
        inviteMembers?: boolean;
    };
}

interface GenericApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export const useTeamMembers = () => {
    const { user } = useUserContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🚨 FUNÇÃO DE TRATAMENTO DE ERROS DO AXIOS
    const handleAxiosError = (err: unknown): string => {
        let errorMessage = 'Erro de conexão ou servidor';

        if (axios.isAxiosError(err) && err.response) {
            // Tenta ler a mensagem de erro que o backend enviou (4xx, 5xx)
            const backendError = (err.response.data as any)?.error
                || (err.response.data as any)?.message;

            errorMessage = backendError || `Erro do servidor: Status ${err.response.status}`;
        } else if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.error('💥 Erro na requisição:', err);
        return errorMessage;
    };


    // 🚨 CORREÇÃO: Atualizado para lidar com erros lançados pelo Axios
    const handleApiCall = async <T>(apiCall: () => Promise<T>): Promise<T> => {
        setIsLoading(true);
        setError(null);

        try {
            return await apiCall();
        } catch (err) {
            // Lança o erro, mas antes o exibe no estado de erro
            const message = handleAxiosError(err);
            setError(message);

            // O erro é relançado para quem chamou a função poder lidar com o insucesso da promessa
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const addTeamMember = (memberData: AddTeamMemberData) =>
        handleApiCall<TeamMember>(async () => {
            if (!user?.id) throw new Error('Usuário não autenticado');

            // 🚨 CORREÇÃO 1: Adiciona o generic type para a resposta esperada
            const axiosResponse = await apiClient.post<GenericApiResponse<{ teamMember: TeamMember }>>(
                '/users/team-members',
                {
                    ...memberData,
                    ownerId: user.id
                }
            );

            // 🚨 CORREÇÃO 2: Desaninha a resposta do backend
            const response = axiosResponse.data;

            if (!response.success || !response.data?.teamMember) {
                throw new Error(response.error || response.message || 'Erro ao adicionar membro');
            }

            return response.data.teamMember;
        });

    const getTeamMembers = () =>
        handleApiCall<TeamMember[]>(async () => {
            if (!user?.id) throw new Error('Usuário não autenticado');

            // 🚨 CORREÇÃO 1: Adiciona o generic type para a resposta esperada
            const axiosResponse = await apiClient.get<GenericApiResponse<TeamMember[] | { teamMembers: TeamMember[] }>>(
                '/users/team-members'
            );

            // 🚨 CORREÇÃO 2: Desaninha a resposta do backend
            const response = axiosResponse.data;

            if (!response.success) {
                throw new Error(response.error || response.message || 'Erro ao buscar membros da equipe');
            }

            // Garante que o retorno é uma lista, tratando dois formatos possíveis de backend:
            // response.data diretamente (array) ou response.data.teamMembers
            if (Array.isArray(response.data)) {
                return response.data as TeamMember[];
            }
            return (response.data as { teamMembers: TeamMember[] })?.teamMembers || [];
        });

    const removeTeamMember = (memberId: string) =>
        handleApiCall<void>(async () => {
            // 🚨 CORREÇÃO 1: Adiciona o generic type para a resposta esperada
            const axiosResponse = await apiClient.delete<GenericApiResponse<any>>(`/users/team-members/${memberId}`);

            // 🚨 CORREÇÃO 2: Desaninha a resposta do backend
            const response = axiosResponse.data;

            if (!response.success) {
                throw new Error(response.error || response.message || 'Erro ao remover membro');
            }
            // O retorno é void, então não precisa retornar nada.
        });

    return {
        addTeamMember,
        getTeamMembers,
        removeTeamMember,
        isLoading,
        error,
        clearError: () => setError(null)
    };
};