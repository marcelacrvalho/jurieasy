export interface Witness {
    name: string;
    document: string; // CPF / RG
}

export interface Document {
    _id: string;
    title: string;
    description: string;
    category: string;
    templateText: string;
    variables?: Variable[];
    witnesses?: Witness[];
    tags: string[];
    isActive: boolean;
    isPopular: boolean;
    usageCount: number;
    estimatedCompletionTime: number;
    version: string;
    icon?: string;
    createdAt: string;
    updatedAt: string;
    difficulty?: string;
    jurisdiction?: string;
    legalReferences?: string[];
    successRate?: number;
    averageCompletionTime?: number;
    questions?: any[];
    whyUseThis?: string;
    requiredDocuments?: string[];
}

export interface Variable {
    id: string;
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'date' | 'number';
    required: boolean;
    options?: string[];
    placeholder?: string;
    description?: string;
    defaultValue?: any;
    helperMessage?: string;
    validation?: {
        pattern?: string;
        min?: number;
        max?: number;
    };
}

// Mantenha o Question separado para o wizard
export interface Question {
    id: string;
    question: string;
    variableId?: string;
    type: 'text' | 'select' | 'radio' | 'checkbox' | 'date' | 'textarea' | 'number';
    options?: string[];
    required: boolean;
    placeholder?: string;
    description?: string;
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

export interface DocumentsResponse {
    success: boolean;
    data?: Document[];
    pagination?: PaginationInfo;
    cached?: boolean;
    error?: string;
}

export interface DocumentResponse {
    success: boolean;
    data?: Document;
    error?: string;
}

export interface CategoriesResponse {
    success: boolean;
    data?: string[];
    error?: string;
}

export interface CreateDocumentData {
    title: string;
    description: string;
    category: string;
    templateText: string;
    variables?: Variable[];
    witnesses?: Witness[];
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
    templateText?: string;
    variables?: Variable[];
    witnesses?: Witness[];
    tags?: string[];
    isPopular?: boolean;
    estimatedCompletionTime?: number;
    version?: string;
    icon?: string;
}