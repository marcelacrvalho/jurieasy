"use client";

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { User } from '@/types/user';

interface UserContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => void;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const logout = () => {
        setUser(null);
    };

    const value: UserContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        setUser,
        setLoading: setIsLoading,
    };

    console.log('🎯 UserContext - user:', user?.name || 'null');

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