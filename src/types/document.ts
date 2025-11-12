import { ApiResponse, PaginatedResponse } from './api';

// Interfaces para validação
export interface ValidationRules {
    pattern?: string;
    min?: number;
    max?: number;
    required?: boolean;
}

// Interfaces para variáveis do Document
export interface DocumentVariable {
    id: string;
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'email' | 'tel';
    required: boolean;
    options: string[];
    placeholder?: string;
    description?: string;
    validation?: ValidationRules;
    defaultValue?: string;
}

// Interfaces para questões (questionário)
export interface DocumentQuestion {
    id: string;
    variableId: string;
    order: number;
    text: string;
    type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'email' | 'tel';
    options: string[];
}

// Interface principal do Document
export interface Document {
    _id: string;
    title: string;
    description: string;
    category: string;
    icon: string;
    DocumentText: string;
    variables: DocumentVariable[];
    questions: DocumentQuestion[];
    tags: string[];
    isPopular: boolean;
    isActive: boolean;
    estimatedCompletionTime: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    jurisdiction: string;
    legalReferences: string[];
    usageCount: number;
    successRate: number;
    averageCompletionTime: number;
    version: string;
    createdAt: string;
    updatedAt: string;
}

export type DocumentsListResponse = PaginatedResponse<Document>;

export type DocumentResponse = ApiResponse<Document>;

export type DocumentsArrayResponse = ApiResponse<Document[]>;

export interface DocumentFilters {
    category?: string;
    difficulty?: string;
    search?: string;
    tags?: string[];
    isPopular?: boolean;
    jurisdiction?: string;
}

// Parâmetros para listagem com paginação
export interface DocumentListParams {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: 'title' | 'createdAt' | 'usageCount' | 'difficulty';
    sortOrder?: 'asc' | 'desc';
}