"use client";

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { User } from '@/types/user';
import { apiClient } from '@/lib/api-client';
import { tokenManager } from '@/lib/token-manager';
import { AxiosResponse } from 'axios';
interface UserContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => void;
    setUser: (user: User | null) => void;
    setToken: (token: string) => void;
    clearToken: () => void;
    setLoading: (loading: boolean) => void;
    loadUserProfile: () => Promise<User | null>;
    upgradePlan: (plan: 'free' | 'pro' | 'escritorio') => Promise<boolean>;
    isUpgradingPlan: boolean;
    error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpgradingPlan, setIsUpgradingPlan] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setToken = useCallback((newToken: string) => {
        tokenManager.setToken(newToken);
        setTokenState(newToken);
    }, []);

    const clearToken = useCallback(() => {
        tokenManager.clearToken();
        setTokenState(null);
    }, []);


    const loadUserProfile = useCallback(async (): Promise<User | null> => {
        const currentToken = tokenManager.getToken();
        if (!currentToken) {
            console.log('❌ loadUserProfile: Nenhum token disponível no tokenManager');
            return null;
        }

        setIsLoading(true);
        try {
            // CORREÇÃO: Pegar a resposta do Axios
            const response = await apiClient.get('/users/profile');
            const responseData = response.data; // ✅ Acessa os dados retornados pelo seu backend

            if (responseData.success && responseData.data) {
                setUser(responseData.data.user);
                return responseData.data.user;
            } else {
                return null;
            }
        } catch (error) {
            // O interceptor do Axios já trata 401, então aqui pegamos outros erros de rede/servidor.
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Função para upgrade de plano
    const upgradePlan = useCallback(async (plan: 'free' | 'pro' | 'escritorio'): Promise<boolean> => {
        setIsUpgradingPlan(true);
        setError(null);

        try {
            if (!tokenManager.hasToken()) {
                setError('Usuário não autenticado');
                return false;
            }

            const response = await apiClient.post('/users/upgrade', { plan });
            const responseData = response.data; // ✅ Acessa os dados retornados pelo seu backend

            if (responseData.success && responseData.data) {
                setUser(responseData.data.user || responseData.data);
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

    const logout = useCallback(() => {
        setUser(null);
        clearToken();
    }, [clearToken]);

    // contexts/UserContext.tsx
    useEffect(() => {
        const initializeAuth = async () => {
            const savedToken = tokenManager.getToken();

            if (savedToken) {
                console.log('🔐 Token encontrado no storage, validando...');
                setTokenState(savedToken);

                try {
                    // Tenta carregar o perfil do usuário com o token salvo
                    const userProfile = await loadUserProfile();
                    if (userProfile) {
                        console.log('✅ Token válido, usuário autenticado automaticamente');
                        // O usuário será redirecionado pelo AuthPage
                    } else {
                        console.log('❌ Token inválido ou expirado, limpando...');
                        logout(); // Limpa token inválido
                    }
                } catch (error) {
                    console.error('❌ Erro ao validar token salvo:', error);
                    logout(); // Limpa em caso de erro
                }
            } else {
                console.log('🔐 Nenhum token salvo encontrado');
                setTokenState(null);
            }
        };

        initializeAuth();
    }, [loadUserProfile, logout]);


    const setUserCallback = useCallback((userData: User | null) => {
        setUser(userData);
    }, []);

    const setLoadingCallback = useCallback((loading: boolean) => {
        setIsLoading(loading);
    }, []);

    const value: UserContextType = {
        user,
        token,
        isLoading,
        isAuthenticated: !!user && tokenManager.hasToken(),
        logout,
        setUser: setUserCallback,
        setToken,
        clearToken,
        setLoading: setLoadingCallback,
        loadUserProfile,
        upgradePlan,
        isUpgradingPlan,
        error,
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