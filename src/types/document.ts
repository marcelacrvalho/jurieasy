export interface Document {
    _id: string;
    title: string;
    description: string;
    category: string;
    content: string;
    questions?: Question[];
    tags: string[];
    isActive: boolean;
    isPopular: boolean;
    usageCount: number;
    estimatedCompletionTime: number;
    version: string;
    icon?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Question {
    id: string;
    question: string;
    type: 'text' | 'select' | 'radio' | 'checkbox' | 'date';
    options?: string[];
    required: boolean;
    placeholder?: string;
}

export interface DocumentFilters {
    category?: string;
    isPopular?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

// ✅ CORRIGIDO: data é opcional para consistência com ApiResponse
export interface DocumentsResponse {
    success: boolean;
    data?: Document[]; // ✅ Tornado opcional
    pagination?: PaginationInfo; // ✅ Tornado opcional
    cached?: boolean;
    error?: string;
}

// ✅ CORRIGIDO: data é opcional
export interface DocumentResponse {
    success: boolean;
    data?: Document; // ✅ Tornado opcional
    error?: string;
}

// ✅ CORRIGIDO: data é opcional
export interface CategoriesResponse {
    success: boolean;
    data?: string[]; // ✅ Tornado opcional
    error?: string;
}

export interface CreateDocumentData {
    title: string;
    description: string;
    category: string;
    content: string;
    questions?: Question[];
    tags?: string[];
    isPopular?: boolean;
    estimatedCompletionTime?: number;
    version?: string;
    icon?: string;
}

export interface UpdateDocumentData {
    title?: string;
    description?: string;
    category?: string;
    content?: string;
    questions?: Question[];
    tags?: string[];
    isPopular?: boolean;
    estimatedCompletionTime?: number;
    version?: string;
    icon?: string;
}