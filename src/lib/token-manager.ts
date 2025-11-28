class TokenManager {
    private token: string | null = null;

    setToken(token: string) {
        this.token = token;
        // Opcional: salvar no localStorage/sessionStorage se quiser persistência
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('authToken', token);
        }
    }

    getToken(): string | null {
        if (!this.token && typeof window !== 'undefined') {
            // Tenta recuperar do sessionStorage
            this.token = sessionStorage.getItem('authToken');
        }
        return this.token;
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('authToken');
        }
    }

    hasToken(): boolean {
        return !!this.getToken();
    }
}

// Singleton global
export const tokenManager = new TokenManager();