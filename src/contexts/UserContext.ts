"use client";

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { User } from '@/types/user';
import { apiClient } from '@/lib/api-client';
import { tokenManager } from '@/lib/token-manager';

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

    const loadUserProfile = useCallback(async (): Promise<User | null> => {
        const currentToken = tokenManager.getToken();
        if (!currentToken) {
            console.log('❌ loadUserProfile: Nenhum token disponível no tokenManager');
            return null;
        }

        setIsLoading(true);
        try {
            const response = await apiClient.get('/users/profile');

            if (response.success && response.data) {
                setUser(response.data.user);
                return response.data.user;
            } else {
                return null;
            }
        } catch (error) {
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

            if (response.success && response.data) {
                setUser(response.data.user || response.data);
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
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            const savedToken = tokenManager.getToken();

            if (savedToken) {
                setTokenState(savedToken);
                await loadUserProfile();
            } else {
                setTokenState(null);
            }
        };

        initializeAuth();
    }, [loadUserProfile]);

    const setToken = useCallback((newToken: string) => {
        tokenManager.setToken(newToken);
        setTokenState(newToken);
    }, []);

    const clearToken = useCallback(() => {
        tokenManager.clearToken();
        setTokenState(null);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        clearToken();
    }, [clearToken]);

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
        // Novas propriedades
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