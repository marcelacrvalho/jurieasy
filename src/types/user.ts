import { ApiResponse } from "./api";

export interface UserPreferences {
    notifications: {
        email: boolean;
        documentExpiry: boolean;
        usageAlerts: boolean;
    };
    language: string;
}

export interface UserUsage {
    documentsCreatedThisMonth: number;
    documentsRemaining: number;
    canSaveDocuments: boolean;
    canHaveTeamMembers: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    plan: 'free' | 'pro' | 'escritorio';
    authType: 'email' | 'google';
    emailVerified: boolean;
    isOwner: boolean;
    preferences: UserPreferences;
    usage: UserUsage;
    hasActiveSubscription: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProfileResponseData {
    user: User;
}

export type ProfileResponse = ApiResponse<ProfileResponseData>;

export interface RegisterResponseData {
    user: User;
    token: string;
}

export type RegisterResponse = ApiResponse<RegisterResponseData>;

export interface LoginResponseData {
    user: User;
    token: string;
}

export type LoginResponse = ApiResponse<LoginResponseData>;

export type UserResponse = ApiResponse<User>;

export type AuthResult = {
    success: boolean;
    message?: string;
};