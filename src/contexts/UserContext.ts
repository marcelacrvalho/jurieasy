"use client";

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { User } from '@/types/user';
import { apiClient } from '@/lib/api-client';
import { tokenManager } from '@/lib/token-manager'; // ✅ Import do tokenManager

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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // ✅ FUNÇÃO PARA CARREGAR PERFIL DO USUÁRIO
    const loadUserProfile = useCallback(async (): Promise<User | null> => {
        // ✅ VERIFICA NO TOKEN MANAGER (fonte da verdade)
        const currentToken = tokenManager.getToken();
        if (!currentToken) {
            console.log('❌ loadUserProfile: Nenhum token disponível no tokenManager');
            return null;
        }

        setIsLoading(true);
        try {
            console.log('🔄 Carregando perfil do usuário...');
            const response = await apiClient.get('/users/profile');

            if (response.success && response.data) {
                console.log('✅ Perfil carregado com sucesso:', response.data.user.name);
                setUser(response.data.user);
                return response.data.user;
            } else {
                console.error('❌ Erro ao carregar perfil:', response.error);
                return null;
            }
        } catch (error) {
            console.error('💥 Erro na requisição do perfil:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []); // ✅ Removida dependência do token local

    // ✅ CARREGAR TOKEN E PERFIL AO INICIALIZAR - AGORA DO TOKEN MANAGER
    useEffect(() => {
        const initializeAuth = async () => {
            console.log('🔍 UserProvider: Inicializando autenticação...');

            // ✅ USA O TOKEN MANAGER COMO FONTE DA VERDADE
            const savedToken = tokenManager.getToken();

            if (savedToken) {
                console.log('💾 Token encontrado no tokenManager, sincronizando contexto...');
                setTokenState(savedToken); // ✅ Sincroniza com contexto

                // ✅ CARREGA O PERFIL AUTOMATICAMENTE
                await loadUserProfile();
            } else {
                console.log('❌ Nenhum token no tokenManager');
                setTokenState(null); // ✅ Garante sincronização
            }
        };

        initializeAuth();
    }, [loadUserProfile]);

    // ✅ SET TOKEN - ATUALIZA TOKEN MANAGER E CONTEXTO
    const setToken = useCallback((newToken: string) => {
        console.log('💾 Salvando token no tokenManager E contexto...');
        tokenManager.setToken(newToken); // ✅ Fonte da verdade
        setTokenState(newToken); // ✅ Sincroniza contexto
    }, []);

    // ✅ CLEAR TOKEN - LIMPA TOKEN MANAGER E CONTEXTO
    const clearToken = useCallback(() => {
        console.log('🧹 Limpando token do tokenManager E contexto...');
        tokenManager.clearToken(); // ✅ Fonte da verdade
        setTokenState(null); // ✅ Sincroniza contexto
    }, []);

    // ✅ LOGOUT - LIMPA TUDO
    const logout = useCallback(() => {
        console.log('🚪 Fazendo logout...');
        setUser(null);
        clearToken(); // ✅ Já limpa tokenManager e contexto
    }, [clearToken]);

    const setUserCallback = useCallback((userData: User | null) => {
        console.log('👤 Definindo usuário:', userData?.name || 'null');
        setUser(userData);
    }, []);

    const setLoadingCallback = useCallback((loading: boolean) => {
        setIsLoading(loading);
    }, []);

    // ✅ VALOR DO CONTEXTO - isAuthenticated usa tokenManager como fonte
    const value: UserContextType = {
        user,
        token,
        isLoading,
        isAuthenticated: !!user && tokenManager.hasToken(), // ✅ Fonte da verdade
        logout,
        setUser: setUserCallback,
        setToken,
        clearToken,
        setLoading: setLoadingCallback,
        loadUserProfile,
    };

    console.log('🎯 UserContext - Status:', {
        user: user?.name || 'null',
        tokenContext: token ? 'presente' : 'ausente',
        tokenManager: tokenManager.hasToken() ? 'presente' : 'ausente',
        isLoading
    });

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