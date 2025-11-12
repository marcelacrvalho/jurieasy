// src/lib/fetcher.ts
import { ApiResponse } from '@/types/api';

export const swrFetcher = async <T = any>(url: string): Promise<T> => {
    const token = localStorage.getItem('token');

    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const fullURL = `${baseURL}${url}`;

    const response = await fetch(fullURL, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<T> = await response.json();

    if (data.success === false) {
        throw new Error(data.error || data.message || 'Erro na API');
    }

    // Retorna os dados diretamente (sem o wrapper ApiResponse)
    return data.data as T;
};