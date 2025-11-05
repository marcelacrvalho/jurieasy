"use client";

import { JSX, useState } from "react";
import {
    FileText,
    Plus,
    Folder,
    Star,
    User,
    TrendingUp,
    Clock,
    RefreshCw,
    ChevronRight,
    Zap,
    Shield,
    Briefcase,
    Building,
    Home,
    Scale,
    Menu,
    X
} from "lucide-react";

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
            icon: <Scale className="w-4 h-4" />
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
            icon: <Home className="w-4 h-4" />
        },
        {
            id: "6",
            title: "Procuração Geral",
            category: "Documentos Jurídicos",
            description: "Modelo com poderes específicos",
            icon: <User className="w-4 h-4" />
        },
        {
            id: "7",
            title: "Contrato Societário",
            category: "Empresarial",
            description: "Para constituição e alteração de sociedades",
            icon: <Building className="w-4 h-4" />
        }
    ]);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const quickActions = [
        {
            icon: Plus,
            label: "Novo Contrato",
            color: "from-blue-500 to-blue-600",
            iconColor: "text-white",
            description: "Criar um novo documento"
        },
        {
            icon: Folder,
            label: "Meus Documentos",
            color: "from-slate-600 to-slate-700",
            iconColor: "text-white",
            description: "Acessar seus contratos"
        },
        {
            icon: Star,
            label: "Favoritos",
            color: "from-amber-500 to-amber-600",
            iconColor: "text-white",
            description: "Modelos mais usados"
        },
        {
            icon: User,
            label: "Meu Perfil",
            color: "from-emerald-500 to-emerald-600",
            iconColor: "text-white",
            description: "Configurações pessoais"
        }
    ];

    const metrics = [
        {
            icon: TrendingUp,
            label: "Contratos este mês",
            value: "128",
            gradient: "from-slate-800 to-slate-900",
            bgGradient: "from-blue-500 to-blue-600",
            iconComponent: <FileText className="w-6 h-6 text-white" />
        },
        {
            icon: RefreshCw,
            label: "Modelos atualizados",
            value: "14",
            gradient: "from-slate-800 to-slate-900",
            bgGradient: "from-emerald-500 to-emerald-600",
            iconComponent: <RefreshCw className="w-6 h-6 text-white" />
        },
        {
            icon: Clock,
            label: "Tempo médio",
            value: "4m 22s",
            gradient: "from-slate-800 to-slate-900",
            bgGradient: "from-violet-500 to-violet-600",
            iconComponent: <Clock className="w-6 h-6 text-white" />
        }
    ];

    // Função para animações em mobile (touch)
    const handleTouchStart = (e: React.TouchEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'scale(0.98)';
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'scale(1)';
    };

    const MobileMenu = () => (
        <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Drawer */}
            <div className={`absolute right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-l border-slate-200 rounded-l-3xl shadow-2xl transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Header do Menu */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Menu</h2>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
                    >
                        <X className="w-6 h-6 text-slate-700" />
                    </button>
                </div>

                {/* Conteúdo do Menu */}
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Navegação</h3>
                        {quickActions.map((action, index) => (
                            <button
                                key={action.label}
                                className="w-full flex items-center gap-4 p-4 text-left bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all duration-200 active:scale-95"
                                onClick={() => {
                                    console.log('Mobile action:', action.label);
                                    setIsMobileMenuOpen(false);
                                }}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-sm`}>
                                    <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="font-semibold text-slate-900 text-base block">
                                        {action.label}
                                    </span>
                                    <span className="text-sm text-slate-600 mt-0.5 block">
                                        {action.description}
                                    </span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 sm:py-10">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* Header com Menu Mobile */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Botão Menu Mobile */}
                            <button
                                className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 active:scale-95"
                                onClick={() => setIsMobileMenuOpen(true)}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                <Menu className="w-6 h-6 text-slate-700" />
                            </button>

                            <div>
                                <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
                                    Olá, Marcela
                                </h1>
                                <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-2xl">
                                    Continue de onde parou ou explore novos modelos.
                                </p>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-200 shadow-sm">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-slate-700">Online</span>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    {metrics.map((metric, index) => (
                        <div
                            key={metric.label}
                            className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm transition-all duration-300 active:scale-95 lg:hover:scale-[1.02] lg:hover:shadow-lg"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-slate-600 text-sm font-medium mb-2">
                                        <metric.icon className="w-4 h-4" />
                                        {metric.label}
                                    </div>
                                    <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                                        {metric.value}
                                    </div>
                                </div>
                                <div className={`w-12 h-12 bg-gradient-to-br ${metric.bgGradient} rounded-xl flex items-center justify-center transition-transform duration-300 shadow-sm active:scale-110 lg:group-hover:scale-110`}>
                                    {metric.iconComponent}
                                </div>
                            </div>
                        </div>
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
                                    3 itens
                                </span>
                            </div>

                            <div className="space-y-4">
                                {recentTemplates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-slate-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl"></div>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            className="relative flex flex-col xs:flex-row xs:items-center justify-between p-4 border border-slate-200 rounded-xl transition-all duration-300 cursor-pointer active:scale-95 lg:hover:border-blue-200 lg:hover:shadow-md"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    console.log('Selected template:', template.title);
                                                }
                                            }}
                                            onClick={() => {
                                                console.log('Selected template:', template.title);
                                            }}
                                            onTouchStart={handleTouchStart}
                                            onTouchEnd={handleTouchEnd}
                                        >
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className="relative">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center transition-transform duration-300 shadow-sm active:scale-110 lg:group-hover:scale-110">
                                                        {template.icon}
                                                    </div>
                                                    {template.isNew && (
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
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

                                            <div className="flex items-center gap-4 mt-3 xs:mt-0">
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-xs text-slate-500 font-medium">Último uso</p>
                                                    <p className="text-sm font-semibold text-slate-900">{template.lastUsed}</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-slate-400 transition-all duration-300 flex-shrink-0 active:text-blue-600 active:translate-x-1 lg:group-hover:text-blue-600 lg:group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
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
                                {featuredTemplates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl"></div>
                                        <div
                                            className="relative p-4 border border-slate-200 rounded-xl transition-all duration-300 cursor-pointer h-full active:scale-95 lg:hover:border-blue-200 lg:hover:shadow-md"
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    console.log('Selected featured template:', template.title);
                                                }
                                            }}
                                            onClick={() => {
                                                console.log('Selected featured template:', template.title);
                                            }}
                                            onTouchStart={handleTouchStart}
                                            onTouchEnd={handleTouchEnd}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center transition-transform duration-300 flex-shrink-0 shadow-sm active:scale-110 lg:group-hover:scale-110">
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

                    {/* Sidebar - Hidden on Mobile */}
                    <aside className="hidden lg:block space-y-6 sm:space-y-8">
                        {/* Quick Actions */}
                        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-4">Ações Rápidas</h3>
                            <div className="space-y-3">
                                {quickActions.map((action) => (
                                    <button
                                        key={action.label}
                                        className="w-full flex items-center gap-4 p-4 text-left border border-slate-200 rounded-xl transition-all duration-300 group hover:border-blue-200 hover:shadow-md"
                                        onClick={() => {
                                            console.log('Quick action:', action.label);
                                        }}
                                    >
                                        <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center transition-transform duration-300 shadow-sm group-hover:scale-110`}>
                                            <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="font-semibold text-slate-900 text-sm sm:text-base block">
                                                {action.label}
                                            </span>
                                            <span className="text-xs text-slate-600 mt-0.5 block">
                                                {action.description}
                                            </span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400 transition-all duration-300 flex-shrink-0 group-hover:text-blue-600 group-hover:translate-x-1" />
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Status Banner */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg">
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

            {/* Mobile Menu Component */}
            <MobileMenu />
        </div>
    );
}