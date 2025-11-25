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
import { tokenManager } from '@/lib/token-manager'; // ✅ Import do tokenManager

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

    // Auth operations
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

export const useUsers = (): UserReturn => {
    const {
        user,
        token,
        setUser,
        setToken,
        clearToken,
        setLoading,
        isLoading,
        logout: contextLogout
    } = useUserContext();

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isUpgradingPlan, setIsUpgradingPlan] = useState(false);
    const [isAddingTeamMember, setIsAddingTeamMember] = useState(false);
    const [isRemovingTeamMember, setIsRemovingTeamMember] = useState(false);
    const [isSendingForgotPassword, setIsSendingForgotPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => setError(null), []);

    const registerEmail = useCallback(async (data: {
        name: string;
        email: string;
        password: string
    }): Promise<boolean> => {
        setIsRegistering(true);
        setError(null);

        try {
            console.log('🔄 Fazendo registro...');

            const response: RegisterResponse = await apiClient.post('/users/register', data);

            console.log('🎯 RESPOSTA COMPLETA DO BACKEND:', JSON.stringify(response, null, 2));

            if (response.success && response.data) {
                console.log('✅ Registro bem-sucedido!');

                // ✅ SALVAR NO TOKEN MANAGER E NO CONTEXTO
                if (response.data.token) {
                    console.log('💾 Salvando token no tokenManager e contexto...');
                    tokenManager.setToken(response.data.token); // ✅ Singleton
                    setToken(response.data.token); // ✅ Contexto
                } else {
                    console.log('❌ TOKEN NÃO VEIO NA RESPOSTA!');
                }

                // SALVAR USER
                if (response.data.user) {
                    setUser(response.data.user);
                }

                return true;
            } else {
                setError(response.error || 'Erro ao criar conta');
                return false;
            }
        } catch (err) {
            setError('Erro de conexão');
            return false;
        } finally {
            setIsRegistering(false);
        }
    }, [setUser, setToken]);

    const login = useCallback(async (data: {
        email: string;
        password: string
    }): Promise<boolean> => {
        setIsLoggingIn(true);
        setError(null);

        try {
            const response: LoginResponse = await apiClient.post('/users/login', data);

            if (response.success && response.data) {
                if (response.data.token) {
                    tokenManager.setToken(response.data.token); // ✅ Singleton
                    setToken(response.data.token); // ✅ Contexto
                }

                setUser(response.data.user);
                return true;
            } else {
                setError(response.error || 'Credenciais inválidas');
                return false;
            }
        } catch (err) {
            setError('Erro de conexão');
            return false;
        } finally {
            setIsLoggingIn(false);
        }
    }, [setUser, setToken]);

    const registerGoogle = useCallback(async (accessToken: string): Promise<boolean> => {
        setIsRegistering(true);
        setError(null);

        try {
            const response: RegisterResponse = await apiClient.post('/users/google', {
                accessToken: accessToken
            });

            if (response.success && response.data) {
                if (response.data.token) {
                    tokenManager.setToken(response.data.token); // ✅ Singleton
                    setToken(response.data.token); // ✅ Contexto
                }

                setUser(response.data.user);
                return true;
            } else {
                setError(response.error || 'Erro ao autenticar com Google');
                return false;
            }
        } catch (err) {
            setError('Erro de conexão');
            return false;
        } finally {
            setIsRegistering(false);
        }
    }, [setUser, setToken]);

    const getUserProfile = useCallback(async (): Promise<User | null> => {
        setLoading(true);
        setError(null);

        try {
            const currentToken = tokenManager.getToken();
            if (!currentToken) {
                setError('Usuário não autenticado');
                return null;
            }

            const response: ProfileResponse = await apiClient.get('/users/profile');

            if (response.success && response.data) {
                setUser(response.data.user);
                return response.data.user;
            } else {
                setError(response.error || 'Erro ao carregar perfil');
                return null;
            }
        } catch (err) {
            setError('Erro de conexão');
            return null;
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading]);

    const logout = useCallback(() => {
        tokenManager.clearToken();
        contextLogout();

        setTeamMembers([]);
        setError(null);
    }, [contextLogout]);

    const upgradePlan = useCallback(async (plan: 'free' | 'pro' | 'escritorio'): Promise<boolean> => {
        setIsUpgradingPlan(true);
        setError(null);

        try {
            if (!tokenManager.hasToken()) {
                setError('Usuário não autenticado');
                return false;
            }

            const response: UserResponse = await apiClient.post('/users/upgrade', { plan });

            if (response.success && response.data) {
                setUser(response.data);
                return true;
            } else {
                setError(response.error || 'Erro ao atualizar plano');
                return false;
            }
        } catch (err) {
            setError('Erro de conexão');
            return false;
        } finally {
            setIsUpgradingPlan(false);
        }
    }, [setUser]);

    const updateUser = useCallback(async (data: Partial<User>): Promise<boolean> => {
        setError(null);

        try {
            if (!tokenManager.hasToken()) {
                setError('Usuário não autenticado');
                return false;
            }

            const response: UserResponse = await apiClient.put('/users', data);

            if (response.success && response.data) {
                setUser(response.data);
                return true;
            } else {
                setError(response.error || 'Erro ao atualizar perfil');
                return false;
            }
        } catch (err) {
            setError('Erro de conexão');
            return false;
        }
    }, [setUser]);

    const addTeamMember = useCallback(async (data: {
        email: string;
        name: string;
        password: string
    }): Promise<boolean> => {
        setIsAddingTeamMember(true);
        setError(null);

        try {
            if (!tokenManager.hasToken()) {
                setError('Usuário não autenticado');
                return false;
            }

            const response: ApiResponse<TeamMember> = await apiClient.post('/users/team-members', data);

            if (response.success && response.data) {
                setTeamMembers(prev => [...prev, response.data!]);
                return true;
            } else {
                console.error('❌ Erro ao adicionar membro:', response.error);
                setError(response.error || 'Erro ao adicionar membro');
                return false;
            }
        } catch (err) {
            setError('Erro de conexão');
            return false;
        } finally {
            setIsAddingTeamMember(false);
        }
    }, []);

    const getTeamMembers = useCallback(async (): Promise<TeamMember[]> => {
        setError(null);

        try {
            if (!tokenManager.hasToken()) {
                setError('Usuário não autenticado');
                return [];
            }

            const response: ApiResponse<TeamMember[]> = await apiClient.get('/users/team-members');

            if (response.success && response.data) {
                setTeamMembers(response.data);
                return response.data;
            } else {
                setError(response.error || 'Erro ao buscar membros');
                return [];
            }
        } catch (err) {
            setError('Erro de conexão');
            return [];
        }
    }, []);

    const removeTeamMember = useCallback(async (memberId: string): Promise<boolean> => {
        setIsRemovingTeamMember(true);
        setError(null);

        try {
            if (!tokenManager.hasToken()) {
                setError('Usuário não autenticado');
                return false;
            }

            const response: ApiResponse<{ message: string }> = await apiClient.delete(`/users/team-members/${memberId}`);

            if (response.success) {
                setTeamMembers(prev => prev.filter(member => member.id !== memberId));
                return true;
            } else {
                setError(response.error || 'Erro ao remover membro');
                return false;
            }
        } catch (err) {
            setError('Erro de conexão');
            return false;
        } finally {
            setIsRemovingTeamMember(false);
        }
    }, []);

    const forgotPassword = useCallback(async (email: string): Promise<boolean> => {
        setIsSendingForgotPassword(true);
        setError(null);

        try {
            const response: ApiResponse<{ message: string }> = await apiClient.post('/users/forgot-password', { email });

            if (response.success) {
                return true;
            } else {
                setError(response.error || 'Erro ao enviar email de recuperação');
                return false;
            }
        } catch (err) {
            setError('Erro de conexão');
            return false;
        } finally {
            setIsSendingForgotPassword(false);
        }
    }, []);

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

        // Auth operations
        registerEmail,
        login,
        registerGoogle,
        logout,

        // User operations
        getUserProfile,
        upgradePlan,
        updateUser,

        // Team operations
        addTeamMember,
        getTeamMembers,
        removeTeamMember,

        // Password operations
        forgotPassword,

        // Utility
        clearError,
    };
};