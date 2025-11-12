import { ApiResponse, PaginatedResponse } from '@/types/api';

export class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL; // TODO: add baseURL e NEXT_PUBLIC_API_URL ao .env
    }

    async request<T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const token = localStorage.getItem('token');

        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        return response.json();
    }

    async getPaginated<T = any>(
        endpoint: string,
        page: number = 1,
        limit: number = 10
    ): Promise<PaginatedResponse<T>> {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        const url = `${endpoint}?${queryParams}`;
        const response = await this.request<T[]>(url);
        return response as PaginatedResponse<T>;
    }

    async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint);
    }

    async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
        });
    }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api');