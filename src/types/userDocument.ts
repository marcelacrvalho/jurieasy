import { ApiResponse, PaginatedResponse } from './api';

export interface DocumentTemplateInfo {
    _id: string;
    title: string;
    category: string;
    icon: string;
    estimatedCompletionTime: number;
}

export type DocumentStatus = 'draft' | 'in_progress' | 'completed' | 'archived' | 'cancelled';

export type UserType = 'user' | 'admin' | 'team_member';

export interface UserAnswers {
    [key: string]: string | number | boolean | null;
}

export interface SharedWithUser {
    userId: string;
    email: string;
    permission: 'view' | 'edit' | 'comment';
    sharedAt: string;
}

export interface UserDocument {
    _id: string;
    userId: string;
    userType: UserType;
    documentId: DocumentTemplateInfo;
    answers: UserAnswers;
    status: DocumentStatus;
    generatedText?: string;
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
    totalSteps?: number;
    shouldSave?: boolean;
    isPublic?: boolean;
    generatedText?: string;
}

export interface UpdateDocumentData {
    answers?: UserAnswers;
    status?: DocumentStatus;
    currentStep?: number;
    totalSteps?: number;
    shouldSave?: boolean;
    isPublic?: boolean;
    lastAccessedAt?: string;
    generatedText?: string;
}

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