// lib/token-manager.ts
class TokenManager {
    private token: string | null = null;
    private readonly STORAGE_KEY = 'auth_token';

    constructor() {
        this.loadToken();
    }

    private loadToken() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem(this.STORAGE_KEY);
        }
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, token);
        }
    }

    getToken(): string | null {
        return this.token;
    }

    hasToken(): boolean {
        return !!this.token;
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.STORAGE_KEY);
            // Limpar também credenciais salvas se quiser
            localStorage.removeItem('userCredentials');
        }
    }
}

export const tokenManager = new TokenManager();