// components/dashboard/ProfileModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Users, Crown, LogOut, CreditCard, Building } from "lucide-react";
import { useState } from "react";
import { useUserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { plans } from "@/data/pricesAndPlans";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { user, logout } = useUserContext();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'billing'>('profile');

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
                        {/* Sidebar de Navegação */}
                        <div className="w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col">
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

                        {/* Conteúdo Principal */}
                        <div className="flex-1 flex flex-col">
                            {/* Header */}
                            <div className="flex-shrink-0 border-b border-slate-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">
                                            {activeTab === 'profile' && 'Meu Perfil'}
                                            {activeTab === 'team' && 'Minha Equipe'}
                                            {activeTab === 'billing' && 'Planos e Cobrança'}
                                        </h2>
                                        <p className="text-slate-600 text-sm mt-1">
                                            {activeTab === 'profile' && 'Gerencie suas informações pessoais'}
                                            {activeTab === 'team' && 'Adicione e gerencie membros da equipe'}
                                            {activeTab === 'billing' && 'Escolha o plano ideal para seu escritório'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-6 h-6 text-slate-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Conteúdo com Scroll */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {activeTab === 'profile' && <ProfileTab user={user} />}
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

function ProfileTab({ user }: { user: any }) {
    return (
        <div className="max-w-2xl space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Informações Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Nome completo</label>
                        <p className="text-slate-900 mt-1">{user.name}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">E-mail</label>
                        <p className="text-slate-900 mt-1">{user.email}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Tipo de usuário</label>
                        <p className="text-slate-900 mt-1 capitalize">{user.isOwner ? 'Proprietário' : 'Membro da equipe'}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Plano atual</label>
                        <p className="text-slate-900 mt-1">{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Estatísticas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">12</div>
                        <div className="text-sm text-slate-600">Documentos</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                        <div className="text-2xl font-bold text-green-600">8</div>
                        <div className="text-sm text-slate-600">Concluídos</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                        <div className="text-2xl font-bold text-yellow-600">3</div>
                        <div className="text-sm text-slate-600">Em andamento</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">1</div>
                        <div className="text-sm text-slate-600">Rascunhos</div>
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
        <div className="max-w-4xl space-y-6">
            {/* Header com botão adicionar */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Membros da Equipe</h3>
                    <p className="text-slate-600">Gerencie os acessos da sua equipe</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <Users className="w-4 h-4" />
                    Adicionar Membro
                </button>
            </div>

            {/* Lista de membros */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border-b border-slate-200 last:border-b-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900">{member.name}</h4>
                                <p className="text-sm text-slate-600">{member.email} • {member.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                                }`}>
                                {member.status === 'active' ? 'Ativo' : 'Inativo'}
                            </span>
                            <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                                <X className="w-4 h-4" />
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
        <div className="max-w-4xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {plans.map((plan) => (
                    <div
                        key={plan.label}
                        className={`border rounded-2xl p-6 transition-all duration-300 flex flex-col h-full ${plan.label === user.plan // ✅ CORRIGIDO - use a mesma propriedade
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-slate-200 bg-white hover:shadow-md'
                            }`}
                    >
                        {/* Header do Plano */}
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
                            <div className="text-3xl font-bold text-slate-900 mb-1">{plan.price}</div>
                            <div className="text-sm text-slate-600">{plan.description}</div>
                        </div>

                        {/* Lista de Features */}
                        <div className="flex-1 mb-6">
                            <ul className="space-y-3">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="text-sm text-slate-700">
                                        <span className="leading-tight">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Botão de Ação - CORRIGIDO */}
                        <button
                            onClick={() => (plan.label)} // ✅ CORRIGIDO - chama a função
                            className={`w-full py-3 rounded-full font-medium transition-colors ${plan.label === user.plan // ✅ CORRIGIDO - mesma lógica
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : plan.popular
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                }`}
                        >
                            {plan.label === user.plan ? 'Plano Atual' : plan.button} {/* ✅ CORRIGIDO */}
                        </button>
                    </div>
                ))}
            </div>

            {/* Informações Adicionais */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h4 className="font-semibold text-slate-900 mb-3">Como funciona a cobrança?</h4>
                <ul className="text-sm text-slate-600 space-y-2">
                    <li>• Cobrança mensal recorrente</li>
                    <li>• Você pode cancelar a qualquer momento</li>
                    <li>• Upgrade/downgrade imediato</li>
                    <li>• Suporte incluído em todos os planos</li>
                </ul>
            </div>
        </div>
    );
}