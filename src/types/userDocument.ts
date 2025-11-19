// types/document.ts
import { ApiResponse, PaginatedResponse } from './api';

// Interfaces para Documentos do Usuário

// Informações básicas do documento template
export interface DocumentTemplateInfo {
    _id: string;
    title: string;
    category: string;
    icon: string;
    estimatedCompletionTime: number;
}

// Status possíveis do documento
export type DocumentStatus = 'draft' | 'in_progress' | 'completed' | 'archived' | 'cancelled';

// Tipo de usuário
export type UserType = 'user' | 'admin' | 'team_member';

// Respostas do usuário (dinâmicas, baseadas no template)
export interface UserAnswers {
    [key: string]: string | number | boolean | null;
}

// Informações de compartilhamento
export interface SharedWithUser {
    userId: string;
    email: string;
    permission: 'view' | 'edit' | 'comment';
    sharedAt: string;
}

// Interface principal do Documento do Usuário
export interface UserDocument {
    _id: string;
    userId: string;
    userType: UserType;
    documentId: DocumentTemplateInfo;
    answers: UserAnswers;
    status: DocumentStatus;
    currentStep: number;
    totalSteps: number;
    documentVersion: string;
    shouldSave: boolean;
    isPublic: boolean;
    sharedWith: SharedWithUser[];
    lastAccessedAt: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

// Response para documeno ÚNICO
export type UserDocumentResponse = ApiResponse<UserDocument>;

// Response para lista PAGINADA de documentos
export type UserDocumentsListResponse = PaginatedResponse<UserDocument>;

// Response para lista SEM paginação
export type UserDocumentsArrayResponse = ApiResponse<UserDocument[]>;

export interface CreateDocumentData {
    documentId: string;
    userId?: string;
    answers?: UserAnswers;
    status?: DocumentStatus;
    currentStep?: number;
    shouldSave?: boolean;
    isPublic?: boolean;
}

export interface UpdateDocumentData {
    answers?: UserAnswers;
    status?: DocumentStatus;
    currentStep?: number;
    shouldSave?: boolean;
    isPublic?: boolean;
    lastAccessedAt?: string;
}

// Filtros para listagem de documentos
export interface DocumentFilters {
    status?: DocumentStatus;
    category?: string;
    search?: string;
    isPublic?: boolean;
    dateFrom?: string;
    dateTo?: string;
}

export interface DocumentStats {
    byStatus: Array<{
        status: string;
        count: number;
    }>;
    completed: number;
    completionRate: number;
    inProgress: number;
    total: number;
}