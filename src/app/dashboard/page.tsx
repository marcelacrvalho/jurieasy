"use client";

import { useState } from "react";
import { Zap } from "lucide-react";

// Components
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import TemplateCard from "@/components/dashboard/TemplateCard";
import FeaturedTemplateCard from "@/components/dashboard/FeaturedTemplateCard";
import QuickActionButton from "@/components/dashboard/QuickActionButton";
import StatusBanner from "@/components/dashboard/StatusBanner";
import MobileMenu from "@/components/dashboard/MobileMenu";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// Data
import {
    recentTemplatesData,
    featuredTemplatesData,
    quickActionsData,
    metricsData
} from "@/data/dashboardData";

export default function Dashboard() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        console.log('Quick action:', actionLabel);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 sm:py-10">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* Header */}
                <DashboardHeader
                    onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                />

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    {metricsData.map((metric, index) => (
                        <MetricsGrid
                            key={metric.label}
                            metric={metric}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        {/* Continue Working Section */}
                        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Continuar de onde parou</h2>
                                    <p className="text-slate-600 text-sm mt-1">3 documentos em andamento</p>
                                </div>
                                <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                                    3 itens {/*TODO: receber via parametro a quantidade de itens em andamento */}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {recentTemplatesData.map((template) => (
                                    <TemplateCard
                                        key={template.id}
                                        template={template}
                                        onTouchStart={handleTouchStart}
                                        onTouchEnd={handleTouchEnd}
                                    />
                                ))}
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {featuredTemplatesData.map((template) => (
                                    <FeaturedTemplateCard
                                        key={template.id}
                                        template={template}
                                        onTouchStart={handleTouchStart}
                                        onTouchEnd={handleTouchEnd}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar - Hidden on Mobile */}
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

            {/* Mobile Menu Component */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                quickActions={quickActionsData}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            />
        </div>
    );
}