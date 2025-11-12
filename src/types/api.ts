export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
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