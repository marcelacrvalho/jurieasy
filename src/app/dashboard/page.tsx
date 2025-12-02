"use client";

import { useState, useEffect } from "react";
import { Check, CheckCircle, File, FilePen, FileText, Pencil, Zap } from "lucide-react";
import { useUserContext } from '@/contexts/UserContext';
import { useUserDocumentContext } from '@/contexts/UserDocumentContext';
import { useUsers } from '@/hooks/users';
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";

// Components
import MetricCard from "@/components/dashboard/MetricsGrid";
import QuickActionButton from "@/components/dashboard/QuickActionButton";
import StatusBanner from "@/components/dashboard/StatusBanner";
import MobileMenu from "@/components/dashboard/MobileMenu";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DocumentManagerModal from "@/components/dashboard/DocumentManagerModal";
import DocumentCreationModal from "@/components/dashboard/DocumentCreationModal";

import { quickActionsData } from "@/data/quickActionData";

import { useUserDocuments } from "@/hooks/userDocuments";
import { useDocuments } from "@/hooks/document";
import React from "react";
import { UserDocument } from "@/types/userDocument";
import { Document } from "@/types/document";
import { DocumentCard } from "@/components/shared/DocumentCard";
import LoadingAnimation from "@/components/shared/LoadingAnimation";
import { tokenManager } from '@/lib/token-manager';
import ContinueDraftsModal from "@/components/dashboard/ContinueDaftsModal";
import CompletedDocumentsModal from "@/components/dashboard/CompletedDocumentsModal";
import ProfileModal from "@/components/dashboard/ProfileModal";

export default function Dashboard() {
    const router = useRouter();
    const { user, isLoading: isUserLoading, isAuthenticated, loadUserProfile } = useUserContext();
    const { stats, isFetchingStats } = useUserDocumentContext();
    const { userDocuments, getUserDocumentDraft, getUserDocumentStats, refreshStats } = useUserDocuments();
    const { documents, getDocuments, isLoadingDocuments } = useDocuments();

    // States
    const [selectedTemplate, setSelectedTemplate] = useState<Document | null>(null);
    const [selectedDraft, setSelectedDraft] = useState<UserDocument | null>(null);
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
    const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isMyDocumentsModalOpen, setIsMyDocumentsModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            if (!tokenManager.hasToken()) {
                router.push('/auth');
                return;
            }

            if (tokenManager.hasToken() && !user) {
                try {
                    await loadUserProfile();
                } catch (error) {
                    tokenManager.clearToken();
                    router.push('/auth');
                    return;
                }
            }

            setIsCheckingAuth(false);
        };

        checkAuthentication();
    }, [user, isAuthenticated, router, loadUserProfile]);

    useEffect(() => {
        if (!isCheckingAuth) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isCheckingAuth]);

    useEffect(() => {
        if (!isLoading && user?.id && isAuthenticated) {
            refreshStats();

            getUserDocumentStats(user.id).catch(error => {
                console.error('Erro ao carregar estatísticas:', error);
                toast.error('Erro ao carregar estatísticas');
            });

            getUserDocumentDraft(user.id, 1, 10).catch(error => {
                console.error('Erro ao carregar rascunhos:', error);
                toast.error('Erro ao carregar documentos em andamento');
            });

            getDocuments({
                page: 1,
                limit: 20,
                sortBy: 'updatedAt',
                sortOrder: 'desc'
            }).catch(error => {
                toast.error('Erro ao carregar modelos');
            });
        }
    }, [isLoading, getUserDocumentStats, getUserDocumentDraft, getDocuments, user?.id, isAuthenticated]); // 👈 Dependências atualizadas

    // Handlers
    const handleCloseCreationModal = () => {
        setIsCreationModalOpen(false);
        setSelectedTemplate(null);
        setSelectedDraft(null);
        refreshStats();
    };

    const handleItemSelect = (item: Document | UserDocument) => {
        if ('documentId' in item) {
            const userDocument = item as UserDocument;
            setIsDraftsModalOpen(false);

            setTimeout(() => {
                setSelectedDraft(userDocument);
                setIsCreationModalOpen(true);
            }, 100);

            toast.success(`Continuando: ${userDocument.documentId?.title || 'Documento sem título'}`);
        } else {
            const document = item as Document;

            setIsDocumentModalOpen(false);

            setTimeout(() => {
                setSelectedTemplate(document);
                setIsCreationModalOpen(true);
            }, 100);

        }
    };

    const handleDocumentCreated = (userDocument: UserDocument) => {
        if (selectedDraft) {
            toast.success('Rascunho atualizado!');
        } else {
            toast.success('Documento criado com sucesso!');
        }

        if (user?.id) {
            getUserDocumentDraft(user.id, 1, 10).catch(console.error);
            getUserDocumentStats(user.id).catch(console.error);
        }

        handleCloseCreationModal();
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'scale(0.98)';
        target.style.transition = 'transform 0.1s ease';
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'scale(1)';
    };

    const handleQuickAction = (actionLabel: string) => {
        if (actionLabel === "Novo Contrato") {
            setIsDocumentModalOpen(true);
        } else if (actionLabel === "Meus Documentos") {
            setIsMyDocumentsModalOpen(true);
        } else {
            setIsProfileModalOpen(true);
        }
    };

    if (isCheckingAuth || isUserLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <LoadingAnimation />
                    <p className="mt-4 text-slate-600">Verificando autenticação...</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="text-center">
                    <div className="mx-auto mb-6">
                        <LoadingAnimation />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800">Carregando dashboard...</h2>
                    <p className="text-slate-600 mt-2">Aguarde alguns instantes</p>
                </div>
            </div>
        );
    }

    if (!user || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Acesso não autorizado</h2>
                    <p className="text-slate-600 mb-4">Faça login para acessar o dashboard</p>
                    <button
                        onClick={() => router.push('/auth')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Fazer Login
                    </button>
                </div>
            </div>
        );
    }

    const recentDocuments = (userDocuments ?? []).slice(0, 4);
    const featuredDocuments = (documents ?? []).slice(0, 4);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 sm:py-10">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* Header */}
                <DashboardHeader
                    name={user.name}
                    onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                />

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    {stats && !isFetchingStats ? (
                        <>
                            <MetricCard
                                metric={{
                                    label: "Total de Documentos",
                                    value: (stats.total ?? 0).toString(),
                                    icon: File,
                                    gradient: "from-slate-800 to-slate-900",
                                    bgGradient: "from-emerald-500 to-emerald-600",
                                    iconComponent: React.createElement(FileText, { className: "w-6 h-6 text-white" })
                                }}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            />

                            <MetricCard
                                metric={{
                                    label: "Em Andamento",
                                    value: (stats.inProgress ?? 0).toString(),
                                    icon: Pencil,
                                    gradient: "from-slate-800 to-slate-900",
                                    bgGradient: "from-emerald-500 to-emerald-600",
                                    iconComponent: React.createElement(FilePen, { className: "w-6 h-6 text-white" })
                                }}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            />

                            <MetricCard
                                metric={{
                                    label: "Finalizados",
                                    value: (stats.completed ?? 0).toString(),
                                    icon: Check,
                                    gradient: "from-slate-800 to-slate-900",
                                    bgGradient: "from-emerald-500 to-emerald-600",
                                    iconComponent: React.createElement(CheckCircle, { className: "w-6 h-6 text-white" })
                                }}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            />
                        </>
                    ) : (
                        // Loading state para métricas
                        [...Array(3)].map((_, index) => (
                            <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 animate-pulse">
                                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                            </div>
                        ))
                    )}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        {/* Drafts Section */}
                        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => setIsDraftsModalOpen(true)}
                                    className="text-left hover:opacity-80 transition-opacity cursor-pointer group"
                                >
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        Continuar de onde parou
                                    </h2>
                                    <p className="text-slate-600 text-sm mt-1">
                                        {userDocuments.length} documento{userDocuments.length !== 1 ? 's' : ''} em andamento
                                    </p>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {recentDocuments.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 mb-4">Nenhum documento em andamento</p>
                                        <button
                                            onClick={() => setIsDocumentModalOpen(true)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                        >
                                            Criar primeiro documento
                                        </button>
                                    </div>
                                ) : (
                                    recentDocuments.map((document: UserDocument) => (
                                        <DocumentCard
                                            key={document._id}
                                            item={document}
                                            mode="drafts"
                                            onSelect={handleItemSelect}
                                        />
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Featured Templates Section */}
                        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Modelos em Destaque</h2>
                                    <p className="text-slate-600 text-sm mt-1">Atualizados conforme as últimas mudanças legais</p>
                                </div>
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                                    <span className="text-xs font-medium">Atualizado</span>
                                </div>
                            </div>

                            {isLoadingDocuments ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[...Array(4)].map((_, index) => (
                                        <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : featuredDocuments.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                    {featuredDocuments.map((document: Document) => (
                                        <DocumentCard
                                            key={document._id}
                                            item={document}
                                            mode="create"
                                            onSelect={handleItemSelect}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <File className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500 mb-4">Nenhum modelo disponível</p>
                                    <button
                                        onClick={() => setIsDocumentModalOpen(true)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Explorar Modelos
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="hidden lg:block space-y-6 sm:space-y-8">
                        {/* Quick Actions */}
                        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-4">Ações Rápidas</h3>
                            <div className="space-y-3">
                                {quickActionsData.map((action) => (
                                    <QuickActionButton
                                        key={action.label}
                                        action={action}
                                        onClick={() => handleQuickAction(action.label)}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Status Banner */}
                        <StatusBanner />
                    </aside>
                </div>
            </div>

            {/* Modals */}
            <ContinueDraftsModal
                isOpen={isDraftsModalOpen}
                onDraftSelect={handleItemSelect}
                onClose={() => setIsDraftsModalOpen(false)}
            />

            <DocumentManagerModal
                isOpen={isDocumentModalOpen}
                //documents={documents}
                onClose={() => setIsDocumentModalOpen(false)}
                mode="create"
                onDocumentSelect={handleItemSelect}
                user={user}
            />

            <DocumentCreationModal
                isOpen={isCreationModalOpen}
                onClose={handleCloseCreationModal}
                document={selectedTemplate}
                userDocument={selectedDraft}
                onDocumentCreated={handleDocumentCreated}
            />

            <CompletedDocumentsModal
                isOpen={isMyDocumentsModalOpen}
                onClose={() => setIsMyDocumentsModalOpen(false)}
            />

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                quickActions={quickActionsData}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onNewDocument={() => setIsDocumentModalOpen(true)}
                onMyDocuments={() => setIsMyDocumentsModalOpen(true)}
                onMyProfile={() => setIsProfileModalOpen(true)}
            />
        </div>
    );
}
