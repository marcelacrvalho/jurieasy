// hooks/users.ts
import { useCallback, useState } from 'react';
import {
    User,
    RegisterResponse,
    LoginResponse,
    UserResponse,
    ProfileResponse
} from '@/types/user';
import { ApiResponse } from '@/types/api';
import { apiClient } from '@/lib/api-client';
import { useUserContext } from '@/contexts/UserContext';

interface TeamMember {
    id: string;
    email: string;
    name: string;
    role: string;
    joinedAt: string;
}

interface UserReturn {
    // Data states
    user: User | null;
    teamMembers: TeamMember[];

    // Loading states
    isLoading: boolean;
    isRegistering: boolean;
    isLoggingIn: boolean;
    isUpgradingPlan: boolean;
    isAddingTeamMember: boolean;
    isRemovingTeamMember: boolean;
    isSendingForgotPassword: boolean;

    // Error states
    error: string | null;

    // Auth operations - ✅ TODAS retornam Promise<boolean>
    registerEmail: (data: { name: string; email: string; password: string }) => Promise<boolean>;
    login: (data: { email: string; password: string }) => Promise<boolean>;
    registerGoogle: (accessToken: string) => Promise<boolean>;
    logout: () => void;

    // User operations
    getUserProfile: () => Promise<User | null>;
    upgradePlan: (plan: 'free' | 'pro' | 'escritorio') => Promise<boolean>;
    updateUser: (data: Partial<User>) => Promise<boolean>;

    // Team operations
    addTeamMember: (data: { email: string; name: string; password: string }) => Promise<boolean>;
    getTeamMembers: () => Promise<TeamMember[]>;
    removeTeamMember: (memberId: string) => Promise<boolean>;

    // Password operations
    forgotPassword: (email: string) => Promise<boolean>;

    // Utility
    clearError: () => void;
}

export const users = (): UserReturn => {
    const { user, setUser, setLoading, isLoading, logout: contextLogout } = useUserContext();

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isUpgradingPlan, setIsUpgradingPlan] = useState(false);
    const [isAddingTeamMember, setIsAddingTeamMember] = useState(false);
    const [isRemovingTeamMember, setIsRemovingTeamMember] = useState(false);
    const [isSendingForgotPassword, setIsSendingForgotPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => setError(null), []);

    // ✅ getUserProfile
    const getUserProfile = useCallback(async (): Promise<User | null> => {
        console.log(' CHAMOUUU - getUserProfile');
        setLoading(true);
        setError(null);

        try {
            console.log('🔄 Buscando perfil via API...');
            const response: ProfileResponse = await apiClient.get('/users/profile');

            console.log('📨 Resposta completa da API:', response);

            if (response.success && response.data) {
                console.log('✅ Perfil carregado com sucesso:', response.data.user.name);
                setUser(response.data.user);
                return response.data.user;
            } else {
                console.error('❌ Erro na resposta da API:', response.error);
                setError(response.error || 'Erro ao carregar perfil');
                return null;
            }
        } catch (err) {
            console.error('💥 Erro na requisição do perfil:', err);
            setError('Erro de conexão');
            return null;
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading]);

    // ✅ registerEmail - RETORNA boolean
    const registerEmail = useCallback(async (data: {
        name: string;
        email: string;
        password: string
    }): Promise<boolean> => {
        setIsRegistering(true);
        setError(null);

        try {
            console.log('📝 Registrando usuário...');
            const response: RegisterResponse = await apiClient.post('/users/register', data);

            if (response.success && response.data) {
                console.log('✅ Usuário registrado com sucesso:', response.data.user.name);
                setUser(response.data.user);
                return true; // ✅ Retorna boolean
            } else {
                setError(response.error || response.message || 'Erro ao criar conta');
                return false; // ✅ Retorna boolean
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            return false; // ✅ Retorna boolean
        } finally {
            setIsRegistering(false);
        }
    }, [setUser]);

    // ✅ login - RETORNA boolean
    const login = useCallback(async (data: {
        email: string;
        password: string
    }): Promise<boolean> => {
        setIsLoggingIn(true);
        setError(null);

        try {
            console.log('🔐 Fazendo login...');
            const response: LoginResponse = await apiClient.post('/users/login', data);

            if (response.success && response.data) {
                console.log('✅ Login realizado com sucesso:', response.data.user.name);
                setUser(response.data.user);
                return true; // ✅ Retorna boolean
            } else {
                setError(response.error || response.message || 'Erro ao fazer login');
                return false; // ✅ Retorna boolean
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            return false; // ✅ Retorna boolean
        } finally {
            setIsLoggingIn(false);
        }
    }, [setUser]);

    // ✅ registerGoogle - RETORNA boolean
    const registerGoogle = useCallback(async (accessToken: string): Promise<boolean> => {
        setIsRegistering(true);
        setError(null);

        try {
            console.log('🔐 Fazendo login com Google...');
            const response: RegisterResponse = await apiClient.post('/users/google', {
                accessToken: accessToken
            });

            if (response.success && response.data) {
                console.log('✅ Login Google realizado com sucesso:', response.data.user.name);
                setUser(response.data.user);
                return true; // ✅ Retorna boolean
            } else {
                setError(response.error || response.message || 'Erro ao fazer login com Google');
                return false; // ✅ Retorna boolean
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            return false; // ✅ Retorna boolean
        } finally {
            setIsRegistering(false);
        }
    }, [setUser]);

    // ✅ logout
    const logout = useCallback(() => {
        console.log('🚪 Fazendo logout...');
        contextLogout();
        setTeamMembers([]);
    }, [contextLogout]);

    // ✅ upgradePlan
    const upgradePlan = useCallback(async (plan: 'free' | 'pro' | 'escritorio'): Promise<boolean> => {
        setIsUpgradingPlan(true);
        setError(null);

        try {
            console.log('⬆️ Atualizando plano para:', plan);
            const response: UserResponse = await apiClient.post('/users/upgrade', { plan });

            if (response.success && response.data) {
                console.log('✅ Plano atualizado com sucesso');
                setUser(response.data);
                return true;
            } else {
                setError(response.error || response.message || 'Erro ao atualizar plano');
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            return false;
        } finally {
            setIsUpgradingPlan(false);
        }
    }, [setUser]);

    // ✅ updateUser
    const updateUser = useCallback(async (data: Partial<User>): Promise<boolean> => {
        setError(null);

        try {
            console.log('✏️ Atualizando perfil...');
            const response: UserResponse = await apiClient.put('/users', data);

            if (response.success && response.data) {
                console.log('✅ Perfil atualizado com sucesso');
                setUser(response.data);
                return true;
            } else {
                setError(response.error || response.message || 'Erro ao atualizar perfil');
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            return false;
        }
    }, [setUser]);

    // ... (outras funções team members)

    const addTeamMember = useCallback(async (data: {
        email: string;
        name: string;
        password: string
    }): Promise<boolean> => {
        setIsAddingTeamMember(true);
        setError(null);

        try {
            const response: ApiResponse<TeamMember> = await apiClient.post('/users/team-members', data);

            if (response.success && response.data) {
                setTeamMembers((prev: any) => [...prev, response.data!]);
                return true;
            } else {
                setError(response.error || response.message || 'Erro ao adicionar membro');
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            return false;
        } finally {
            setIsAddingTeamMember(false);
        }
    }, []);

    const getTeamMembers = useCallback(async (): Promise<TeamMember[]> => {
        setError(null);

        try {
            const response: ApiResponse<TeamMember[]> = await apiClient.get('/users/team-members');

            if (response.success && response.data) {
                setTeamMembers(response.data);
                return response.data;
            } else {
                setError(response.error || response.message || 'Erro ao buscar membros');
                return [];
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            return [];
        }
    }, []);

    const removeTeamMember = useCallback(async (memberId: string): Promise<boolean> => {
        setIsRemovingTeamMember(true);
        setError(null);

        try {
            const response: ApiResponse<{ message: string }> = await apiClient.delete(`/users/team-members/${memberId}`);

            if (response.success) {
                setTeamMembers((prev: any[]) => prev.filter((member: { id: string; }) => member.id !== memberId));
                return true;
            } else {
                setError(response.error || response.message || 'Erro ao remover membro');
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            return false;
        } finally {
            setIsRemovingTeamMember(false);
        }
    }, []);

    // ✅ forgotPassword
    const forgotPassword = useCallback(async (email: string): Promise<boolean> => {
        setIsSendingForgotPassword(true);
        setError(null);

        try {
            const response: ApiResponse<{ message: string }> = await apiClient.post('/users/forgot-password', { email });

            if (response.success) {
                return true;
            } else {
                setError(response.error || response.message || 'Erro ao enviar email de recuperação');
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            return false;
        } finally {
            setIsSendingForgotPassword(false);
        }
    }, []);

    console.log('🎯 Hook users - user:', user?.name || 'null');

    return {
        // Data
        user,
        teamMembers,

        // Loading states
        isLoading,
        isRegistering,
        isLoggingIn,
        isUpgradingPlan,
        isAddingTeamMember,
        isRemovingTeamMember,
        isSendingForgotPassword,

        // Error
        error,

        // Operations - ✅ TODAS consistentes
        getUserProfile,
        registerEmail,
        login,
        registerGoogle,
        logout,
        upgradePlan,
        updateUser,
        addTeamMember,
        getTeamMembers,
        removeTeamMember,
        forgotPassword,
        clearError,
    };
};