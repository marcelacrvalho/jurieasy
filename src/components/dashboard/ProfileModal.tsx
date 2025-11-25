"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Users, Crown, LogOut, CreditCard, Menu } from "lucide-react";
import { useState } from "react";
import { useUserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { plans } from "@/data/pricesAndPlans";
import { useUserDocumentContext } from "@/contexts/UserDocumentContext";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { user, logout } = useUserContext();
    const { stats, isFetchingStats } = useUserDocumentContext();

    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'billing'>('profile');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        onClose();
        router.push('/auth');
    };

    const handleUpgradePlan = () => {
        //TODO: Lógica para upgrade de plano
        console.log('Upgrade plan clicked');
    };

    const handleAddTeamMember = () => {
        //TODO Lógica para adicionar membro da equipe
        console.log('Add team member clicked');
    };

    if (!user) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999] p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] flex overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sidebar de Navegação - Desktop */}
                        <div className="hidden md:flex w-64 bg-slate-50 border-r border-slate-200 p-6 flex-col">
                            {/* Header do Perfil */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{user.name}</h3>
                                        <p className="text-sm text-slate-600">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    <Crown className="w-4 h-4" />
                                    {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                                </div>
                            </div>

                            {/* Menu de Navegação */}
                            <nav className="space-y-2 flex-1">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${activeTab === 'profile'
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    <User className="w-5 h-5" />
                                    Meu Perfil
                                </button>

                                {user.plan === 'escritorio' && user.isOwner && (
                                    <button
                                        onClick={() => setActiveTab('team')}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${activeTab === 'team'
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'text-slate-700 hover:bg-slate-100'
                                            }`}
                                    >
                                        <Users className="w-5 h-5" />
                                        Minha Equipe
                                    </button>
                                )}

                                <button
                                    onClick={() => setActiveTab('billing')}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${activeTab === 'billing'
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Planos e Cobrança
                                </button>
                            </nav>

                            {/* Botão Sair */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 mt-4"
                            >
                                <LogOut className="w-5 h-5" />
                                Sair
                            </button>
                        </div>

                        {/* Sidebar Mobile Overlay */}
                        <AnimatePresence>
                            {mobileSidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="md:hidden fixed inset-0 bg-black/50 z-10"
                                    onClick={() => setMobileSidebarOpen(false)}
                                >
                                    <motion.div
                                        initial={{ x: -300 }}
                                        animate={{ x: 0 }}
                                        exit={{ x: -300 }}
                                        className="w-80 max-w-[80vw] h-full bg-slate-50 border-r border-slate-200 p-6 flex flex-col"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* Header do Perfil Mobile */}
                                        <div className="mb-8">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                    <User className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">{user.name}</h3>
                                                    <p className="text-sm text-slate-600">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                <Crown className="w-4 h-4" />
                                                {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                                            </div>
                                        </div>

                                        {/* Menu de Navegação Mobile */}
                                        <nav className="space-y-2 flex-1">
                                            <button
                                                onClick={() => {
                                                    setActiveTab('profile');
                                                    setMobileSidebarOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${activeTab === 'profile'
                                                    ? 'bg-blue-500 text-white shadow-md'
                                                    : 'text-slate-700 hover:bg-slate-100'
                                                    }`}
                                            >
                                                <User className="w-5 h-5" />
                                                Meu Perfil
                                            </button>

                                            {user.plan === 'escritorio' && user.isOwner && (
                                                <button
                                                    onClick={() => {
                                                        setActiveTab('team');
                                                        setMobileSidebarOpen(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${activeTab === 'team'
                                                        ? 'bg-blue-500 text-white shadow-md'
                                                        : 'text-slate-700 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    <Users className="w-5 h-5" />
                                                    Minha Equipe
                                                </button>
                                            )}

                                            <button
                                                onClick={() => {
                                                    setActiveTab('billing');
                                                    setMobileSidebarOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${activeTab === 'billing'
                                                    ? 'bg-blue-500 text-white shadow-md'
                                                    : 'text-slate-700 hover:bg-slate-100'
                                                    }`}
                                            >
                                                <CreditCard className="w-5 h-5" />
                                                Planos e Cobrança
                                            </button>
                                        </nav>

                                        {/* Botão Sair Mobile */}
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 mt-4"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Sair
                                        </button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Conteúdo Principal */}
                        <div className="flex-1 flex flex-col min-w-0">
                            {/* Header */}
                            <div className="flex-shrink-0 border-b border-slate-200 p-4 md:p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Botão Menu Mobile */}
                                        <button
                                            onClick={() => setMobileSidebarOpen(true)}
                                            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <Menu className="w-5 h-5 text-slate-600" />
                                        </button>
                                        <div>
                                            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                                                {activeTab === 'profile' && 'Meu Perfil'}
                                                {activeTab === 'team' && 'Minha Equipe'}
                                                {activeTab === 'billing' && 'Planos e Cobrança'}
                                            </h2>
                                            <p className="text-slate-600 text-xs md:text-sm mt-1">
                                                {activeTab === 'profile' && 'Gerencie suas informações pessoais'}
                                                {activeTab === 'team' && 'Adicione e gerencie membros da equipe'}
                                                {activeTab === 'billing' && 'Escolha o plano ideal para seu escritório'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Conteúdo com Scroll */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                                {activeTab === 'profile' && <ProfileTab user={user} stats={stats} />}
                                {activeTab === 'team' && user.plan === 'escritorio' && user.isOwner && <TeamTab />}
                                {activeTab === 'billing' && <BillingTab user={user} onUpgrade={handleUpgradePlan} />}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function ProfileTab({ user, stats }: { user: any, stats: any }) {
    return (
        <div className="max-w-2xl space-y-4 md:space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-3 md:mb-4">Informações Pessoais</h3>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                    <div>
                        <label className="text-xs md:text-sm font-medium text-slate-700">Nome completo</label>
                        <p className="text-slate-900 mt-1 text-sm md:text-base">{user.name}</p>
                    </div>
                    <div>
                        <label className="text-xs md:text-sm font-medium text-slate-700">E-mail</label>
                        <p className="text-slate-900 mt-1 text-sm md:text-base">{user.email}</p>
                    </div>
                    <div>
                        <label className="text-xs md:text-sm font-medium text-slate-700">Tipo de usuário</label>
                        <p className="text-slate-900 mt-1 text-sm md:text-base capitalize">{user.isOwner ? 'Proprietário' : 'Membro da equipe'}</p>
                    </div>
                    <div>
                        <label className="text-xs md:text-sm font-medium text-slate-700">Plano atual</label>
                        <p className="text-slate-900 mt-1 text-sm md:text-base">{user.plan === 'escritorio' ? 'Escritório' : user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-3 md:mb-4">Estatísticas</h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                    <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg md:rounded-xl">
                        <div className="text-lg md:text-2xl font-bold text-blue-600">{stats.total}</div>
                        <div className="text-xs md:text-sm text-slate-600">Documentos</div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg md:rounded-xl">
                        <div className="text-lg md:text-2xl font-bold text-green-600">{stats.completed}</div>
                        <div className="text-xs md:text-sm text-slate-600">Concluídos</div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-yellow-50 rounded-lg md:rounded-xl">
                        <div className="text-lg md:text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
                        <div className="text-xs md:text-sm text-slate-600">Em andamento</div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-purple-50 rounded-lg md:rounded-xl">
                        <div className="text-lg md:text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
                        <div className="text-xs md:text-sm text-slate-600">Taxa de finalização</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente para a aba de Equipe (apenas para escritório) TODO: exibir isso apenas se for owner e nao team_member
function TeamTab() {
    const [teamMembers, setTeamMembers] = useState([
        { id: 1, name: 'João Silva', email: 'joao@escritorio.com', role: 'Advogado', status: 'active' },
        { id: 2, name: 'Maria Santos', email: 'maria@escritorio.com', role: 'Estagiária', status: 'active' },
    ]);

    return (
        <div className="max-w-4xl space-y-4 md:space-y-6">
            {/* Header com botão adicionar */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-slate-900">Membros da Equipe</h3>
                    <p className="text-slate-600 text-xs md:text-sm">Gerencie os acessos da sua equipe</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm md:text-base w-full sm:w-auto">
                    <Users className="w-4 h-4" />
                    Adicionar Membro
                </button>
            </div>

            {/* Lista de membros */}
            <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl overflow-hidden">
                {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 md:p-4 border-b border-slate-200 last:border-b-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-slate-900 text-sm md:text-base truncate">{member.name}</h4>
                                <p className="text-xs md:text-sm text-slate-600 truncate">{member.email} • {member.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                                }`}>
                                {member.status === 'active' ? 'Ativo' : 'Inativo'}
                            </span>
                            <button className="p-1 md:p-2 text-slate-400 hover:text-red-600 transition-colors">
                                <X className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Componente para a aba de Planos
function BillingTab({ user, onUpgrade }: { user: any; onUpgrade: () => void }) {
    return (
        <div className="max-w-4xl space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
                {plans.map((plan) => (
                    <div
                        key={plan.label}
                        className={`border rounded-xl md:rounded-2xl p-4 md:p-6 transition-all duration-300 flex flex-col h-full ${plan.label === user.plan
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-slate-200 bg-white hover:shadow-md'
                            }`}
                    >
                        {/* Header do Plano */}
                        <div className="text-center mb-4 md:mb-6">
                            <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
                            <div className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{plan.price}</div>
                            <div className="text-xs md:text-sm text-slate-600">{plan.description}</div>
                        </div>

                        {/* Lista de Features */}
                        <div className="flex-1 mb-4 md:mb-6">
                            <ul className="space-y-2 md:space-y-3">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="text-xs md:text-sm text-slate-700">
                                        <span className="leading-tight">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Botão de Ação */}
                        <button
                            onClick={onUpgrade}
                            className={`w-full py-2 md:py-3 rounded-full font-medium transition-colors text-sm md:text-base ${plan.label === user.plan
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : plan.popular
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                }`}
                        >
                            {plan.label === user.plan ? 'Plano Atual' : plan.button}
                        </button>
                    </div>
                ))}
            </div>

            {/* Informações Adicionais */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-6">
                <h4 className="font-semibold text-slate-900 mb-2 md:mb-3 text-sm md:text-base">Como funciona a cobrança?</h4>
                <ul className="text-xs md:text-sm text-slate-600 space-y-1 md:space-y-2">
                    <li>• Cobrança mensal recorrente</li>
                    <li>• Você pode cancelar a qualquer momento</li>
                    <li>• Upgrade/downgrade imediato</li>
                    <li>• Suporte incluído em todos os planos</li>
                </ul>
            </div>
        </div>
    );
}