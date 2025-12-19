"use client";

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { User } from '@/types/user';
import { apiClient } from '@/lib/api-client';
import { tokenManager } from '@/lib/token-manager';
import axios from 'axios';

interface TeamMember {
    id: string;
    email: string;
    name: string;
    role: string;
    joinedAt: string;
}

interface UserContextType {
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

    // Auth state
    token: string | null;
    isAuthenticated: boolean;

    // Auth operations
    registerEmail: (data: { name: string; email: string; password: string }) => Promise<boolean>;
    login: (data: { email: string; password: string }) => Promise<boolean>;
    registerGoogle: (accessToken: string) => Promise<boolean>;
    logout: () => void;

    // User operations
    getUserProfile: () => Promise<User | null>;
    upgradePlan: (plan: 'free' | 'pro' | 'escritorio') => Promise<boolean>;
    updateUser: (data: Partial<User>) => Promise<boolean>;
    refreshUser: () => Promise<void>;

    // Team operations
    addTeamMember: (data: { email: string; name: string; password: string }) => Promise<boolean>;
    getTeamMembers: () => Promise<TeamMember[]>;
    removeTeamMember: (memberId: string) => Promise<boolean>;

    // Password operations
    forgotPassword: (email: string) => Promise<boolean>;

    // Usage operations
    refreshUsage: () => Promise<void>;

    // Utility
    clearError: () => void;
    setToken: (token: string) => void;
    clearToken: () => void;

    // Usage helpers
    getUsageInfo: () => {
        documentsRemaining: number;
        documentsCreatedThisMonth: number;
        canCreateDocument: boolean;
        plan: string;
        documentsLimit: number;
    };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    // Data states
    const [user, setUser] = useState<User | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [token, setTokenState] = useState<string | null>(null);

    // Loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isUpgradingPlan, setIsUpgradingPlan] = useState(false);
    const [isAddingTeamMember, setIsAddingTeamMember] = useState(false);
    const [isRemovingTeamMember, setIsRemovingTeamMember] = useState(false);
    const [isSendingForgotPassword, setIsSendingForgotPassword] = useState(false);

    // Error state
    const [error, setError] = useState<string | null>(null);

    // Utility functions
    const setToken = useCallback((newToken: string) => {
        tokenManager.setToken(newToken);
        setTokenState(newToken);
    }, []);

    const clearToken = useCallback(() => {
        tokenManager.clearToken();
        setTokenState(null);
    }, []);

    const clearError = useCallback(() => setError(null), []);

    const refreshUser = useCallback(async () => {
        if (!user?.id) return;

        try {
            console.log('🔄 Atualizando dados do usuário...');
            const response = await apiClient.get(`/users/${user.id}`);

            if (response.data.success) {
                setUser(response.data.data);
                console.log('✅ Dados do usuário atualizados:', {
                    remaining: response.data.data.usage?.documentsRemaining
                });
            }
        } catch (error) {
            console.error('❌ Erro ao atualizar usuário:', error);
        }
    }, [user?.id]);

    // Helper para informações de uso
    const getUsageInfo = useCallback(() => {
        if (!user) {
            return {
                documentsRemaining: 0,
                documentsCreatedThisMonth: 0,
                canCreateDocument: false,
                plan: 'free',
                documentsLimit: 0
            };
        }

        const usage = user.usage || {
            documentsCreatedThisMonth: 0,
            documentsRemaining: 0,
            canSaveDocuments: false,
            canHaveTeamMembers: false
        };

        // Calcula limite baseado no plano
        const getDocumentsLimit = () => {
            switch (user.plan) {
                case 'free': return 3;
                case 'pro': return 50;
                case 'escritorio': return 999; // Praticamente ilimitado
                default: return 0;
            }
        };

        const documentsLimit = getDocumentsLimit();

        return {
            documentsRemaining: usage.documentsRemaining,
            documentsCreatedThisMonth: usage.documentsCreatedThisMonth,
            canCreateDocument: usage.documentsRemaining > 0,
            plan: user.plan,
            documentsLimit
        };
    }, [user]);

    // Auth operations
    const registerEmail = useCallback(async (data: {
        name: string;
        email: string;
        password: string
    }): Promise<boolean> => {
        setIsRegistering(true);
        setError(null);

        try {
            const axiosResponse = await apiClient.post('/users/register', data);
            const responseData = axiosResponse.data;

            console.log('🎯 [CONTEXT] Register response:', responseData);

            // Extrai user e token da resposta
            let userData: User | null = null;
            let authToken: string | null = null;

            // Tenta diferentes estruturas de resposta
            if (responseData.data?.user) {
                userData = responseData.data.user;
                authToken = responseData.data.token;
            } else if (responseData.data?.data?.user) {
                userData = responseData.data.data.user;
                authToken = responseData.data.data.token;
            } else if (responseData.user) {
                userData = responseData.user;
                authToken = responseData.token;
            } else if (responseData.data) {
                userData = responseData.data.user || responseData.data;
                authToken = responseData.data.token || responseData.token;
            }

            if (userData) {
                setUser(userData);

                if (authToken) {
                    tokenManager.setToken(authToken);
                    setToken(authToken);
                }

                console.log('✅ [CONTEXT] Register successful:', {
                    email: userData.email,
                    usage: userData.usage,
                    documentsRemaining: userData.usage?.documentsRemaining
                });

                return true;
            } else {
                setError('Usuário não retornado na resposta');
                return false;
            }
        } catch (err) {
            console.error('❌ [CONTEXT] Erro no registro:', err);
            setError('Erro de conexão');
            return false;
        } finally {
            setIsRegistering(false);
        }
    }, [setToken]);

    const login = useCallback(async (data: {
        email: string;
        password: string
    }): Promise<boolean> => {
        setIsLoggingIn(true);
        setError(null);

        try {
            const axiosResponse = await apiClient.post('/users/login', data);
            const responseData = axiosResponse.data;

            console.log('🎯 [CONTEXT] Login response:', responseData);

            // Extrai user e token da resposta
            let userData: User | null = null;
            let authToken: string | null = null;

            // Tenta diferentes estruturas de resposta
            if (responseData.data?.user) {
                userData = responseData.data.user;
                authToken = responseData.data.token;
            } else if (responseData.data?.data?.user) {
                userData = responseData.data.data.user;
                authToken = responseData.data.data.token;
            } else if (responseData.user) {
                userData = responseData.user;
                authToken = responseData.token;
            } else if (responseData.data) {
                userData = responseData.data.user || responseData.data;
                authToken = responseData.data.token || responseData.token;
            }

            if (userData) {
                setUser(userData);

                if (authToken) {
                    tokenManager.setToken(authToken);
                    setToken(authToken);
                }

                console.log('✅ [CONTEXT] Login successful:', {
                    email: userData.email,
                    usage: userData.usage,
                    documentsRemaining: userData.usage?.documentsRemaining,
                    documentsCreatedThisMonth: userData.usage?.documentsCreatedThisMonth
                });

                return true;
            } else {
                setError('Credenciais inválidas ou usuário não retornado');
                return false;
            }
        } catch (err) {
            console.error('❌ [CONTEXT] Erro no login:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Credenciais inválidas');
            } else {
                setError('Erro de conexão');
            }
            return false;
        } finally {
            setIsLoggingIn(false);
        }
    }, [setToken]);

    const registerGoogle = useCallback(async (accessToken: string): Promise<boolean> => {
        setIsRegistering(true);
        setError(null);

        try {
            const axiosResponse = await apiClient.post('/users/google', {
                accessToken: accessToken
            });

            const responseData = axiosResponse.data;

            console.log('🎯 [CONTEXT] Google auth response:', responseData);

            if (responseData.success && responseData.data) {
                const userData = responseData.data.user;
                const authToken = responseData.data.token;

                if (userData) {
                    setUser(userData);

                    if (authToken) {
                        tokenManager.setToken(authToken);
                        setToken(authToken);
                    }

                    return true;
                }
            }

            setError(responseData.error || 'Erro ao autenticar com Google');
            return false;
        } catch (err) {
            console.error('❌ [CONTEXT] Erro no Google Auth:', err);

            let errorMessage = 'Erro de conexão ou servidor';

            if (axios.isAxiosError(err) && err.response) {
                errorMessage = (err.response.data as any)?.error ||
                    (err.response.data as any)?.message ||
                    `Erro do servidor: Status ${err.response.status}`;
            }

            setError(errorMessage);
            return false;
        } finally {
            setIsRegistering(false);
        }
    }, [setToken]);

    // Função para buscar usage específico
    const refreshUsage = useCallback(async (): Promise<void> => {
        try {
            const response = await apiClient.get('/users/usage');
            const responseData = response.data;

            if (responseData.success && responseData.data?.usage && user) {
                const updatedUsage = responseData.data.usage;

                // Atualiza apenas o usage do user
                setUser({
                    ...user,
                    usage: updatedUsage
                });

                console.log('🔄 [CONTEXT] Usage atualizado:', updatedUsage);
            }
        } catch (err) {
            console.error('❌ [CONTEXT] Erro ao buscar usage:', err);
        }
    }, [user]);

    const getUserProfile = useCallback(async (): Promise<User | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.get('/users/profile');
            const responseData = response.data;

            console.log('📋 [CONTEXT] Profile response:', responseData);

            if (responseData.success && responseData.data?.user) {
                const userData = responseData.data.user;
                setUser(userData);

                console.log('✅ [CONTEXT] Profile loaded:', {
                    email: userData.email,
                    usage: userData.usage,
                    documentsRemaining: userData.usage.documentsRemaining,
                    documentsCreatedThisMonth: userData.usage.documentsCreatedThisMonth
                });

                return userData;
            } else {
                setError(responseData.error || 'Erro ao carregar perfil');
                return null;
            }
        } catch (err) {
            console.error('❌ [CONTEXT] Erro ao carregar perfil:', err);
            setError('Erro de conexão');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Logout
    const logout = useCallback(() => {
        localStorage.removeItem("userCredentials");
        tokenManager.clearToken();
        setUser(null);
        setTokenState(null);
        setTeamMembers([]);
        setError(null);
        console.log("✅ [CONTEXT] Logout completo");
    }, []);

    const upgradePlan = useCallback(async (plan: 'free' | 'pro' | 'escritorio'): Promise<boolean> => {
        setIsUpgradingPlan(true);
        setError(null);

        try {
            if (!tokenManager.hasToken()) {
                setError('Usuário não autenticado');
                return false;
            }

            const response = await apiClient.post('/users/upgrade', { plan });
            const responseData = response.data;

            if (responseData.success && responseData.data) {
                setUser(responseData.data);
                return true;
            } else {
                setError(responseData.error || 'Erro ao atualizar plano');
                return false;
            }
        } catch (err) {
            setError('Erro de conexão');
            return false;
        } finally {
            setIsUpgradingPlan(false);
        }
    }, []);

    const updateUser = useCallback(async (data: Partial<User>): Promise<boolean> => {
        setError(null);

        try {
            if (!tokenManager.hasToken()) {
                setError('Usuário não autenticado');
                return false;
            }

            const response = await apiClient.put('/users', data);
            const responseData = response.data;

            if (responseData.success && responseData.data) {
                setUser(responseData.data);
                return true;
            } else {
                setError(responseData.error || 'Erro ao atualizar perfil');
                return false;
            }
        } catch (err) {
            setError('Erro de conexão');
            return false;
        }
    }, []);

    // Team operations (mantenha como estava)
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

            const response = await apiClient.post('/users/team-members', data);
            const responseData = response.data;

            if (responseData.success && responseData.data) {
                setTeamMembers(prev => [...prev, responseData.data!]);
                return true;
            } else {
                console.error('❌ [CONTEXT] Erro ao adicionar membro:', responseData.error);
                setError(responseData.error || 'Erro ao adicionar membro');
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

            const response = await apiClient.get('/users/team-members');
            const responseData = response.data;

            if (responseData.success && responseData.data) {
                setTeamMembers(responseData.data);
                return responseData.data;
            } else {
                setError(responseData.error || 'Erro ao buscar membros');
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

            const response = await apiClient.delete(`/users/team-members/${memberId}`);
            const responseData = response.data;

            if (responseData.success) {
                setTeamMembers(prev => prev.filter(member => member.id !== memberId));
                return true;
            } else {
                setError(responseData.error || 'Erro ao remover membro');
                return false;
            }
        } catch (err) {
            setError('Erro de conexão');
            return false;
        } finally {
            setIsRemovingTeamMember(false);
        }
    }, []);

    // Password operations
    const forgotPassword = useCallback(async (email: string): Promise<boolean> => {
        setIsSendingForgotPassword(true);
        setError(null);

        try {
            const response = await apiClient.post('/users/forgot-password', { email });
            const responseData = response.data;

            if (responseData.success) {
                return true;
            } else {
                setError(responseData.error || 'Erro ao enviar email de recuperação');
                return false;
            }
        } catch (err) {
            setError('Erro de conexão');
            return false;
        } finally {
            setIsSendingForgotPassword(false);
        }
    }, []);

    // Initialize auth on mount
    useEffect(() => {
        const initializeAuth = async () => {
            const savedToken = tokenManager.getToken();

            if (savedToken) {
                console.log('🔐 [CONTEXT] Token encontrado, validando...');
                setTokenState(savedToken);

                try {
                    const userProfile = await getUserProfile();
                    if (userProfile) {
                        console.log('✅ [CONTEXT] Token válido, usuário autenticado');
                    } else {
                        console.log('❌ [CONTEXT] Token inválido, limpando...');
                        logout();
                    }
                } catch (error) {
                    console.error('❌ [CONTEXT] Erro ao validar token:', error);
                    logout();
                }
            } else {
                console.log('🔐 [CONTEXT] Nenhum token salvo encontrado');
                setTokenState(null);
            }
        };

        initializeAuth();
    }, [getUserProfile, logout]);

    const value: UserContextType = {
        // Data
        user,
        teamMembers,
        token,

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

        // Auth state
        isAuthenticated: !!user && tokenManager.hasToken(),

        // Auth operations
        registerEmail,
        login,
        registerGoogle,
        logout,

        // User operations
        getUserProfile,
        upgradePlan,
        updateUser,
        refreshUser,

        // Team operations
        addTeamMember,
        getTeamMembers,
        removeTeamMember,

        // Password operations
        forgotPassword,

        // Usage operations
        refreshUsage,

        // Utility
        clearError,
        setToken,
        clearToken,

        // Usage helpers
        getUsageInfo,
    };

    return React.createElement(
        UserContext.Provider,
        { value },
        children
    );
}

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext deve ser usado dentro de um UserProvider');
    }
    return context;
};