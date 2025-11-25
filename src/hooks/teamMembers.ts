import { useState } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { apiClient } from '@/lib/api-client';

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

// CORREÇÃO: Mudar para useTeamMembers (com "use" no início)
export const useTeamMembers = () => { // ← Mudei de teamMembers para useTeamMembers
    const { user } = useUserContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleApiCall = async <T>(apiCall: () => Promise<T>): Promise<T> => {
        setIsLoading(true);
        setError(null);

        try {
            return await apiCall();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro na operação';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const addTeamMember = (memberData: AddTeamMemberData) =>
        handleApiCall<TeamMember>(async () => {
            if (!user?.id) throw new Error('Usuário não autenticado');

            const response = await apiClient.post('/users/team-members', {
                ...memberData,
                ownerId: user.id
            });

            if (!response.success) {
                throw new Error(response.message || 'Erro ao adicionar membro');
            }

            return response.data.teamMember;
        });

    const getTeamMembers = () =>
        handleApiCall<TeamMember[]>(async () => {
            if (!user?.id) throw new Error('Usuário não autenticado');

            const response = await apiClient.get('/users/team-members');

            if (!response.success) {
                throw new Error(response.message || 'Erro ao buscar membros da equipe');
            }

            // Ajuste conforme a estrutura real de retorno da listagem
            return response.data?.teamMembers || response.data || [];
        });

    const removeTeamMember = (memberId: string) =>
        handleApiCall<void>(async () => {
            const response = await apiClient.delete(`/users/team-members/${memberId}`);

            if (!response.success) {
                throw new Error(response.message || 'Erro ao remover membro');
            }
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