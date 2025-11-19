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

export const useUsers = (): UserReturn => { // ✅ Corrigido: useUsers em vez de users
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

    // ✅ registerEmail - Registro com email/senha
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

    // ✅ login - Login com email/senha
    const login = useCallback(async (data: {
        email: string;
        password: string
    }): Promise<boolean> => {
        setIsLoggingIn(true);
        setError(null);

        try {
            console.log('🔐 Iniciando login...', { email: data.email });

            const response: LoginResponse = await apiClient.post('/users/login', data);

            console.log('📨 Resposta do login:', {
                success: response.success,
                hasUser: !!response.data?.user,
                hasToken: !!response.data?.token
            });

            if (response.success && response.data) {
                console.log('✅ Login realizado com sucesso');

                // ✅ SALVAR NO TOKEN MANAGER E NO CONTEXTO
                if (response.data.token) {
                    tokenManager.setToken(response.data.token); // ✅ Singleton
                    setToken(response.data.token); // ✅ Contexto
                    console.log('🔑 Token salvo no tokenManager e contexto');
                }

                setUser(response.data.user);
                return true;
            } else {
                console.error('❌ Erro no login:', response.error);
                setError(response.error || 'Credenciais inválidas');
                return false;
            }
        } catch (err) {
            console.error('💥 Erro na requisição de login:', err);
            setError('Erro de conexão');
            return false;
        } finally {
            setIsLoggingIn(false);
        }
    }, [setUser, setToken]);

    // ✅ registerGoogle - Login/Registro com Google
    const registerGoogle = useCallback(async (accessToken: string): Promise<boolean> => {
        setIsRegistering(true);
        setError(null);

        try {
            console.log('🔐 Iniciando autenticação Google...');

            const response: RegisterResponse = await apiClient.post('/users/google', {
                accessToken: accessToken
            });

            console.log('📨 Resposta do Google Auth:', {
                success: response.success,
                hasUser: !!response.data?.user,
                hasToken: !!response.data?.token
            });

            if (response.success && response.data) {
                console.log('✅ Autenticação Google realizada com sucesso');

                // ✅ SALVAR NO TOKEN MANAGER E NO CONTEXTO
                if (response.data.token) {
                    tokenManager.setToken(response.data.token); // ✅ Singleton
                    setToken(response.data.token); // ✅ Contexto
                    console.log('🔑 Token salvo no tokenManager e contexto');
                }

                setUser(response.data.user);
                return true;
            } else {
                console.error('❌ Erro na autenticação Google:', response.error);
                setError(response.error || 'Erro ao autenticar com Google');
                return false;
            }
        } catch (err) {
            console.error('💥 Erro na requisição do Google:', err);
            setError('Erro de conexão');
            return false;
        } finally {
            setIsRegistering(false);
        }
    }, [setUser, setToken]);

    // ✅ getUserProfile - Buscar perfil do usuário
    const getUserProfile = useCallback(async (): Promise<User | null> => {
        console.log('🔍 Buscando perfil do usuário...');
        setLoading(true);
        setError(null);

        try {
            // ✅ VERIFICA NO TOKEN MANAGER (fonte da verdade)
            const currentToken = tokenManager.getToken();
            if (!currentToken) {
                console.log('❌ Token não disponível para buscar perfil');
                setError('Usuário não autenticado');
                return null;
            }

            const response: ProfileResponse = await apiClient.get('/users/profile');

            console.log('📨 Resposta do perfil:', {
                success: response.success,
                hasUser: !!response.data?.user
            });

            if (response.success && response.data) {
                console.log('✅ Perfil carregado com sucesso');
                setUser(response.data.user);
                return response.data.user;
            } else {
                console.error('❌ Erro ao carregar perfil:', response.error);
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

    // ✅ logout - Logout do usuário
    const logout = useCallback(() => {
        console.log('🚪 Realizando logout...');

        // ✅ LIMPAR NO TOKEN MANAGER E NO CONTEXTO
        tokenManager.clearToken(); // ✅ Singleton
        contextLogout(); // ✅ Contexto (que também deve chamar clearToken)

        setTeamMembers([]);
        setError(null);
    }, [contextLogout]);

    // ✅ upgradePlan - Atualizar plano do usuário
    const upgradePlan = useCallback(async (plan: 'free' | 'pro' | 'escritorio'): Promise<boolean> => {
        setIsUpgradingPlan(true);
        setError(null);

        try {
            console.log('⬆️ Atualizando plano para:', plan);

            // ✅ VERIFICA NO TOKEN MANAGER
            if (!tokenManager.hasToken()) {
                setError('Usuário não autenticado');
                return false;
            }

            const response: UserResponse = await apiClient.post('/users/upgrade', { plan });

            if (response.success && response.data) {
                console.log('✅ Plano atualizado com sucesso');
                setUser(response.data);
                return true;
            } else {
                console.error('❌ Erro ao atualizar plano:', response.error);
                setError(response.error || 'Erro ao atualizar plano');
                return false;
            }
        } catch (err) {
            console.error('💥 Erro na atualização do plano:', err);
            setError('Erro de conexão');
            return false;
        } finally {
            setIsUpgradingPlan(false);
        }
    }, [setUser]);

    // ✅ updateUser - Atualizar dados do usuário
    const updateUser = useCallback(async (data: Partial<User>): Promise<boolean> => {
        setError(null);

        try {
            console.log('✏️ Atualizando perfil do usuário...');

            // ✅ VERIFICA NO TOKEN MANAGER
            if (!tokenManager.hasToken()) {
                setError('Usuário não autenticado');
                return false;
            }

            const response: UserResponse = await apiClient.put('/users', data);

            if (response.success && response.data) {
                console.log('✅ Perfil atualizado com sucesso');
                setUser(response.data);
                return true;
            } else {
                console.error('❌ Erro ao atualizar perfil:', response.error);
                setError(response.error || 'Erro ao atualizar perfil');
                return false;
            }
        } catch (err) {
            console.error('💥 Erro na atualização do perfil:', err);
            setError('Erro de conexão');
            return false;
        }
    }, [setUser]);

    // ✅ addTeamMember - Adicionar membro à equipe
    const addTeamMember = useCallback(async (data: {
        email: string;
        name: string;
        password: string
    }): Promise<boolean> => {
        setIsAddingTeamMember(true);
        setError(null);

        try {
            console.log('👥 Adicionando membro à equipe...', { email: data.email });

            // ✅ VERIFICA NO TOKEN MANAGER
            if (!tokenManager.hasToken()) {
                setError('Usuário não autenticado');
                return false;
            }

            const response: ApiResponse<TeamMember> = await apiClient.post('/users/team-members', data);

            if (response.success && response.data) {
                console.log('✅ Membro adicionado com sucesso');
                setTeamMembers(prev => [...prev, response.data!]);
                return true;
            } else {
                console.error('❌ Erro ao adicionar membro:', response.error);
                setError(response.error || 'Erro ao adicionar membro');
                return false;
            }
        } catch (err) {
            console.error('💥 Erro ao adicionar membro:', err);
            setError('Erro de conexão');
            return false;
        } finally {
            setIsAddingTeamMember(false);
        }
    }, []);

    // ✅ getTeamMembers - Buscar membros da equipe
    const getTeamMembers = useCallback(async (): Promise<TeamMember[]> => {
        setError(null);

        try {
            console.log('👥 Buscando membros da equipe...');

            // ✅ VERIFICA NO TOKEN MANAGER
            if (!tokenManager.hasToken()) {
                setError('Usuário não autenticado');
                return [];
            }

            const response: ApiResponse<TeamMember[]> = await apiClient.get('/users/team-members');

            if (response.success && response.data) {
                console.log('✅ Membros da equipe carregados:', response.data.length);
                setTeamMembers(response.data);
                return response.data;
            } else {
                console.error('❌ Erro ao buscar membros:', response.error);
                setError(response.error || 'Erro ao buscar membros');
                return [];
            }
        } catch (err) {
            console.error('💥 Erro ao buscar membros:', err);
            setError('Erro de conexão');
            return [];
        }
    }, []);

    // ✅ removeTeamMember - Remover membro da equipe
    const removeTeamMember = useCallback(async (memberId: string): Promise<boolean> => {
        setIsRemovingTeamMember(true);
        setError(null);

        try {
            console.log('👥 Removendo membro da equipe...', memberId);

            // ✅ VERIFICA NO TOKEN MANAGER
            if (!tokenManager.hasToken()) {
                setError('Usuário não autenticado');
                return false;
            }

            const response: ApiResponse<{ message: string }> = await apiClient.delete(`/users/team-members/${memberId}`);

            if (response.success) {
                console.log('✅ Membro removido com sucesso');
                setTeamMembers(prev => prev.filter(member => member.id !== memberId));
                return true;
            } else {
                console.error('❌ Erro ao remover membro:', response.error);
                setError(response.error || 'Erro ao remover membro');
                return false;
            }
        } catch (err) {
            console.error('💥 Erro ao remover membro:', err);
            setError('Erro de conexão');
            return false;
        } finally {
            setIsRemovingTeamMember(false);
        }
    }, []);

    // ✅ forgotPassword - Solicitar reset de senha
    const forgotPassword = useCallback(async (email: string): Promise<boolean> => {
        setIsSendingForgotPassword(true);
        setError(null);

        try {
            console.log('🔑 Solicitando reset de senha...', { email });

            const response: ApiResponse<{ message: string }> = await apiClient.post('/users/forgot-password', { email });

            if (response.success) {
                console.log('✅ Email de recuperação enviado');
                return true;
            } else {
                console.error('❌ Erro ao enviar email:', response.error);
                setError(response.error || 'Erro ao enviar email de recuperação');
                return false;
            }
        } catch (err) {
            console.error('💥 Erro na solicitação de reset:', err);
            setError('Erro de conexão');
            return false;
        } finally {
            setIsSendingForgotPassword(false);
        }
    }, []);

    console.log('🎯 Hook useUsers - Status:', {
        user: user?.name || 'null',
        token: tokenManager.hasToken() ? 'presente' : 'ausente',
        isLoading
    });

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