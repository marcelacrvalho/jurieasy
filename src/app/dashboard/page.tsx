"use client";

import { JSX, useState } from "react";
import { FileText, Plus, Folder, Star, User, TrendingUp, Clock, RefreshCw, ChevronRight, Zap, Shield, Briefcase } from "lucide-react";

interface ContractTemplate {
    id: string;
    title: string;
    lastUsed?: string;
    isNew?: boolean;
    category: string;
    description?: string;
    icon?: JSX.Element;
}

export default function Dashboard() {
    const [recentTemplates] = useState<ContractTemplate[]>([
        {
            id: "1",
            title: "Compra e Venda",
            lastUsed: "31/10/2025",
            category: "Contratos Civis",
            icon: <Briefcase className="w-4 h-4" />
        },
        {
            id: "2",
            title: "Pensão Socioafetiva",
            lastUsed: "31/10/2025",
            category: "Direito Familiar",
            isNew: true,
            icon: <Shield className="w-4 h-4" />
        },
        {
            id: "3",
            title: "Contrato de Compra e Venda",
            lastUsed: "01/10/2025",
            category: "Contratos Civis",
            icon: <FileText className="w-4 h-4" />
        }
    ]);

    const [featuredTemplates] = useState<ContractTemplate[]>([
        {
            id: "4",
            title: "Contrato de Prestação de Serviços",
            category: "Contratos Trabalhistas",
            description: "Modelo atualizado conforme nova legislação",
            icon: <Zap className="w-4 h-4" />
        },
        {
            id: "5",
            title: "Locação Residencial",
            category: "Contratos Imobiliários",
            description: "Inclui cláusulas de proteção ao locatário",
            icon: <Folder className="w-4 h-4" />
        },
        {
            id: "6",
            title: "Procuração Geral",
            category: "Documentos Jurídicos",
            description: "Modelo com poderes específicos",
            icon: <User className="w-4 h-4" />
        }
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 sm:py-10">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* Header com gradiente */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Olá, Marcela
                            </h1>
                            <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-2xl">
                                Continue de onde parou ou explore novos modelos
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20 shadow-sm">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-slate-700">Online</span>
                        </div>
                    </div>
                </div>

                {/* Metrics com design glassmorphism */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-slate-600 text-sm font-medium mb-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Contratos este mês
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    128
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-slate-600 text-sm font-medium mb-2">
                                    <RefreshCw className="w-4 h-4" />
                                    Modelos atualizados
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                    14
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <RefreshCw className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] col-span-1 xs:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-slate-600 text-sm font-medium mb-2">
                                    <Clock className="w-4 h-4" />
                                    Tempo médio
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                    4m 22s
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Main column */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        {/* Continue Section */}
                        <section className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-5 sm:p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Continuar de onde parou</h2>
                                    <p className="text-slate-600 text-sm mt-1">3 documentos em andamento</p>
                                </div>
                                <span className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
                                    3 itens
                                </span>
                            </div>

                            <div className="space-y-4">
                                {recentTemplates.map((template, index) => (
                                    <div
                                        key={template.id}
                                        className="group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            className="relative flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
                                            onKeyDown={() => { }}
                                            onClick={() => { }}
                                        >
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className="relative">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                                        {template.icon}
                                                    </div>
                                                    {template.isNew && (
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                                                            <span className="text-xs text-white font-bold">N</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-slate-900 truncate text-sm sm:text-base">
                                                            {template.title}
                                                        </h3>
                                                    </div>
                                                    <p className="text-sm text-slate-600 mt-0.5">{template.category}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-xs text-slate-500 font-medium">Último uso</p>
                                                    <p className="text-sm font-semibold text-slate-900">{template.lastUsed}</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Featured Section */}
                        <section className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-5 sm:p-6 shadow-lg">
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
                                {featuredTemplates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                        <div
                                            className="relative p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer h-full"
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={() => { }}
                                            onClick={() => { }}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0 shadow-sm">
                                                    {template.icon}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-tight">
                                                        {template.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 mt-1.5">{template.category}</p>
                                                    {template.description && (
                                                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                                            {template.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6 sm:space-y-8">
                        {/* Quick Actions */}
                        <section className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-5 sm:p-6 shadow-lg">
                            <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-4">Ações Rápidas</h3>
                            <div className="space-y-3">
                                {[
                                    { icon: Plus, label: "Novo Contrato", color: "from-emerald-500 to-green-600", iconColor: "text-white" },
                                    { icon: Folder, label: "Meus Documentos", color: "from-blue-500 to-indigo-600", iconColor: "text-white" },
                                    { icon: Star, label: "Favoritos", color: "from-amber-500 to-orange-600", iconColor: "text-white" },
                                    { icon: User, label: "Meu Perfil", color: "from-violet-500 to-purple-600", iconColor: "text-white" }
                                ].map((action, index) => (
                                    <button
                                        key={action.label}
                                        className="w-full flex items-center gap-4 p-4 text-left border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
                                    >
                                        <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                            <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                                        </div>
                                        <span className="font-semibold text-slate-900 text-sm sm:text-base flex-1">
                                            {action.label}
                                        </span>
                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Status Banner */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Sistema Atualizado</h4>
                                    <p className="text-blue-100 text-xs">Todos os modelos conforme a lei</p>
                                </div>
                            </div>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Nossos templates estão sempre sincronizados com as últimas mudanças legislativas.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}