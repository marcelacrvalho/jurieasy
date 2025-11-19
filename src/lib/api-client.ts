import { tokenManager } from './token-manager';

const apiClient = {
    async get(url: string, options?: { headers?: Record<string, string> }) {
        const token = await tokenManager.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options?.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        console.log('🔐 GET:', url, token ? 'COM token' : 'SEM token');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
            method: 'GET',
            headers,
        });

        return await response.json();
    },

    async post(url: string, body?: any, options?: { headers?: Record<string, string> }) {
        const token = await tokenManager.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options?.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        console.log('🔐 POST:', url, token ? 'COM token' : 'SEM token');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
            method: 'POST',
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        return await response.json();
    },

    async put(url: string, body?: any, options?: { headers?: Record<string, string> }) {
        const token = await tokenManager.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options?.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        console.log('🔐 PUT:', url, token ? 'COM token' : 'SEM token');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
            method: 'PUT',
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        return await response.json();
    },

    async delete(url: string, options?: { headers?: Record<string, string> }) {
        const token = await tokenManager.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options?.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        console.log('🔐 DELETE:', url, token ? 'COM token' : 'SEM token');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
            method: 'DELETE',
            headers,
        });

        return await response.json();
    },
};

export { apiClient };