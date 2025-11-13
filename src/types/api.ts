export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    // Adicione outras propriedades comuns que sua API retorna
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    cached?: boolean;
}
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
    pagination: PaginationInfo;
}

// Para respostas de item único (sem paginação)
export interface SingleResponse<T = any> extends ApiResponse<T> {
}