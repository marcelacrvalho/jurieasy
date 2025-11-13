"use client";

import { useState, useEffect } from "react";
import { Check, CheckCircle, File, FilePen, FileText, Pencil, Zap } from "lucide-react";
import { useUserContext } from '@/contexts/UserContext';
import { useUserDocumentContext } from '@/contexts/UserDocumentContext';
import { users } from '@/hooks/users';
import toast from "react-hot-toast";

// Components
import MetricCard from "@/components/dashboard/MetricsGrid";
import QuickActionButton from "@/components/dashboard/QuickActionButton";
import StatusBanner from "@/components/dashboard/StatusBanner";
import MobileMenu from "@/components/dashboard/MobileMenu";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DocumentManagerModal from "@/components/dashboard/DocumentManagerModal";

import { quickActionsData } from "@/data/dashboardData";

import { useUserDocuments } from "@/hooks/userDocuments";
import { useDocuments } from "@/hooks/document";
import React from "react";
import { UserDocument } from "@/types/userDocument";
import { Document } from "@/types/document";
import { DocumentCard } from "@/components/shared/DocumentCard";

export default function Dashboard() {
    const { user, isLoading } = useUserContext();
    const { stats, isFetchingStats } = useUserDocumentContext();
    const { userDocuments, getUserDocumentDraft, getUserDocumentStats } = useUserDocuments();
    const { documents, getDocuments, isLoadingDocuments } = useDocuments();

    const { getUserProfile } = users();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
    const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                await getUserProfile();
            } catch (error) {
                console.error('💥 Erro ao carregar perfil:', error);
            }
        };

        loadUserProfile();
    }, [getUserProfile]);

    useEffect(() => {
        const loadUserDocumentsStats = async () => {
            if (!user?.id) return;

            try {
                await getUserDocumentStats(user.id);
            } catch (error) {
                toast.error("Erro ao tentar carregar as estatísticas", {
                    icon: "⚠️"
                });
            }
        };

        loadUserDocumentsStats();
    }, [getUserDocumentStats, user?.id]);

    useEffect(() => {
        if (user?.id) {
            getUserDocumentDraft(user.id, 1, 10);
        }
    }, [getUserDocumentDraft, user?.id]);

    // ✅ NOVO useEffect para carregar os documentos da API
    useEffect(() => {
        const loadDocuments = async () => {
            try {
                // Carrega os documentos mais populares ou todos, você pode ajustar os filtros
                await getDocuments({
                    page: 1,
                    limit: 20,
                    sortBy: 'updatedAt',
                    sortOrder: 'asc'
                });
            } catch (error) {
                console.error('💥 Erro ao carregar documentos:', error);
            }
        };

        loadDocuments();
    }, [getDocuments]);

    const handleDraftSelect = (document: UserDocument) => {
        // TODO: redireciona para a edição do documento (pagina de perguntas)
        alert(`Continuando edição de: ${document.documentId?.title || 'Documento sem título'}`);
    };

    // Função para animações em mobile (touch)
    const handleTouchStart = (e: React.TouchEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'scale(0.98)';
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'scale(1)';
    };

    const handleQuickAction = (actionLabel: string) => {
        if (actionLabel === "Novo Contrato") {
            setIsDocumentModalOpen(true);
        } else {
            console.log('Quick action:', actionLabel);
        }
    };

    // No seu Dashboard, substitua a função handleDocumentSelect:
    const handleDocumentSelect = (document: Document) => {
        console.log('📄 Documento selecionado:', document);

        // Aqui você inicia a criação do documento real
        // Pode ser: redirecionar para página de criação, abrir outro modal, etc.

        // TODO: Redirecionar para página de criação
        // router.push(`/documents/create/${document._id}`);

        // Exemplo 2: Abrir modal de criação com o documento selecionado
        // openDocumentCreationModal(document);

        // Exemplo 3: Mostrar alerta (temporário)
        alert(`Iniciando criação de: ${document.title}`);

        // Exemplo 4: Criar um UserDocument (rascunho) automaticamente
        // createUserDocumentDraft(document._id);

        // TODO: Implementar a lógica de criação real aqui
    };

    const featuredDocuments = documents.slice(-4).reverse();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Usuário não encontrado</h2>
                    <p className="text-slate-600">Faça login para acessar o dashboard</p>
                </div>
            </div>
        );
    }

    const recentDocuments = userDocuments.slice(-4).reverse();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 sm:py-10">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <DashboardHeader
                    name={user.name}
                    onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                />

                {/* Metrics Grid com stats */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    {stats && (
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
                    )}

                    {/* Loading state */}
                    {isFetchingStats && (
                        <>
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 animate-pulse">
                                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        {/* Continue Working Section */}
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

                                <div className="flex gap-2">
                                    {userDocuments.length > 4 && (
                                        <button
                                            onClick={() => setIsDraftsModalOpen(true)}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                                        >
                                            Ver todos
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {recentDocuments.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500">Nenhum documento em andamento</p>
                                        <button
                                            onClick={() => setIsDocumentModalOpen(true)}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Criar Primeiro Documento
                                        </button>
                                    </div>
                                ) : (
                                    recentDocuments.map((document: UserDocument) => (
                                        <DocumentCard
                                            key={document._id}
                                            item={document}
                                            mode={"drafts"}
                                            onSelect={function (item: Document | UserDocument): void {
                                                throw new Error("Function not implemented.");
                                            }} />
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
                                    <Zap className="w-4 h-4" />
                                    <span className="text-xs font-medium">Atualizado</span>
                                </div>
                            </div>

                            {/* ✅ CORREÇÃO: Use um componente de card individual */}
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
                                            mode={"create"}
                                            onSelect={function (item: Document | UserDocument): void {
                                                throw new Error("Function not implemented.");
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-slate-500">Nenhum modelo disponível</p>
                                    <button
                                        onClick={() => setIsDocumentModalOpen(true)}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Explorar Modelos
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>

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

            <DocumentManagerModal
                isOpen={isDraftsModalOpen}
                onClose={() => setIsDraftsModalOpen(false)}
                mode="drafts"
                userDocuments={userDocuments}
                onDraftSelect={handleDraftSelect}
                userId={user?.id}
                title="Continuar de onde parou"
                description="Selecione um documento para continuar editando"
            />

            {/* Modal para Criar Novo Documento */}
            <DocumentManagerModal
                isOpen={isDocumentModalOpen}
                documents={documents}
                onClose={() => setIsDocumentModalOpen(false)}
                mode="create"
                onDocumentSelect={handleDocumentSelect}
            />

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                quickActions={quickActionsData}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onNewDocument={() => setIsDocumentModalOpen(true)}
            />
        </div>
    );
}