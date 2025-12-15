"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Users, Crown, LogOut, CreditCard, Menu, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { plans } from "@/data/pricesAndPlans";
import { useUserDocumentContext } from "@/contexts/UserDocumentContext";
import { AddTeamMemberData, TeamMember, useTeamMembers } from "@/hooks/teamMembers";
import toast from "react-hot-toast";
import LoadingAnimation from "../shared/LoadingAnimation";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { user, logout } = useUserContext();
    const { stats } = useUserDocumentContext();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'billing'>('profile');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        onClose();
        router.push('/auth');
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
                                    {user.plan != null ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'Free'}
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
                                                {user.plan != null ? user.plan === 'escritorio' ? 'Escritório' : user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'Free'}
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
                                {activeTab === 'billing' && <BillingTab user={user} />}
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
                        <p className="text-slate-900 mt-1 text-sm md:text-base">{user.plan != null ? user.plan === 'escritorio' ? 'Escritório' : user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'Free'}
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

function TeamTab() {
    const { addTeamMember, getTeamMembers, removeTeamMember, isLoading, error } = useTeamMembers();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState<AddTeamMemberData>({
        email: '',
        name: '',
        password: '',
        role: 'editor',
        permissions: {
            createDocuments: true,
            editDocuments: true,
            deleteDocuments: false,
            manageTemplates: false,
            inviteMembers: false
        }
    });

    // Carregar membros da equipe
    useEffect(() => {
        loadTeamMembers();
    }, []);

    const loadTeamMembers = async () => {
        try {
            const members = await getTeamMembers();
            setTeamMembers(members);
        } catch (err) {
            console.error('Erro ao carregar membros:', err);
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const newMember = await addTeamMember(formData);

            // Adiciona o novo membro à lista
            setTeamMembers(prev => [...prev, newMember]);

            // Reseta o formulário
            setFormData({
                email: '',
                name: '',
                password: '',
                role: 'editor',
                permissions: {
                    createDocuments: true,
                    editDocuments: true,
                    deleteDocuments: false,
                    manageTemplates: false,
                    inviteMembers: false
                }
            });

            setShowAddForm(false);
        } catch (err) {
            console.error('Erro ao adicionar membro:', err);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!confirm('Tem certeza que deseja remover este membro da equipe?')) {
            return;
        }

        try {
            await removeTeamMember(memberId);
            setTeamMembers(prev => prev.filter(member => member.id !== memberId));
        } catch (err) {
            console.error('Erro ao remover membro:', err);
        }
    };

    const handleInputChange = (field: keyof AddTeamMemberData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // CORREÇÃO: Usar NonNullable para garantir que as chaves são válidas
    const handlePermissionChange = (permission: keyof NonNullable<AddTeamMemberData['permissions']>, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions!,
                [permission]: value
            }
        }));
    };

    // Função para mapear isActive para status
    const getMemberStatus = (member: TeamMember) => {
        return member.isActive ? 'active' : 'inactive';
    };

    return (
        <div className="max-w-4xl space-y-4 md:space-y-6">
            {/* Header com botão adicionar */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-slate-900">Membros da Equipe</h3>
                    <p className="text-slate-600 text-xs md:text-sm">Gerencie os acessos da sua equipe</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm md:text-base w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" />
                    {isLoading ? 'Adicionando...' : 'Adicionar Membro'}
                </button>
            </div>

            {/* Modal de Adicionar Membro */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg text-gray-700 font-semibold">Adicionar Membro</h3>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="p-1 hover:bg-slate-100 rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddMember} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nome completo
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full text-gray-600 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Digite o nome completo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full text-gray-600 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Digite o e-mail"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="w-full text-gray-600 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Permissões
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.permissions?.createDocuments}
                                            onChange={(e) => handlePermissionChange('createDocuments', e.target.checked)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-slate-700">Criar documentos</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.permissions?.editDocuments}
                                            onChange={(e) => handlePermissionChange('editDocuments', e.target.checked)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-slate-700">Editar documentos</span>
                                    </label>
                                    {/* <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.permissions?.deleteDocuments}
                                            onChange={(e) => handlePermissionChange('deleteDocuments', e.target.checked)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-slate-700">Excluir documentos</span>
                                    </label> }*/}
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Adicionando...' : 'Adicionar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lista de membros */}
            <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl overflow-hidden">
                {teamMembers.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>Nenhum membro na equipe</p>
                        <p className="text-sm">Adicione o primeiro membro clicando no botão acima.</p>
                    </div>
                ) : (
                    teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 md:p-4 border-b border-slate-200 last:border-b-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-slate-900 text-sm md:text-base truncate">{member.name}</h4>
                                    <p className="text-xs md:text-sm text-slate-600 truncate">
                                        {member.email} • {member.role}
                                        {member.usage && ` • ${member.usage.documentsCreated} docs`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMemberStatus(member) === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-slate-100 text-slate-800'
                                    }`}>
                                    {getMemberStatus(member) === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                                <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    disabled={isLoading}
                                    className="p-1 md:p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function BillingTab({ user }: { user: any }) {
    const { upgradePlan, isUpgradingPlan, error: upgradeError } = useUserContext();
    const [localError, setLocalError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handlePlanChange = async (plan: 'free' | 'pro' | 'escritorio') => {
        // Não fazer nada se já estiver no plano selecionado
        if (user.plan === plan) {
            toast.success('Você já está neste plano!');
            return;
        }

        const planNames = {
            free: 'Free',
            pro: 'Pro',
            escritorio: 'Escritório'
        };

        const currentPlanName = planNames[user.plan as keyof typeof planNames] || user.plan;
        const newPlanName = planNames[plan] || plan;

        const confirmationMessage = plan === 'free'
            ? 'Tem certeza que deseja fazer downgrade para o plano Free? Você perderá algumas funcionalidades.'
            : `Tem certeza que deseja ${user.plan === 'free' ? 'fazer upgrade' : 'mudar'} para o plano ${newPlanName}?`;

        // Confirmação com React Hot Toast customizado
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
            max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${plan === 'free' ? 'bg-yellow-100' : 'bg-blue-100'
                                }`}>
                                <svg className={`w-5 h-5 ${plan === 'free' ? 'text-yellow-600' : 'text-blue-600'}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                {plan === 'free' ? 'Confirmar Downgrade' : 'Confirmar Alteração'}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {confirmationMessage}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex border-l border-gray-200">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            await processPlanChange(plan, newPlanName);
                        }}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Confirmar
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ), {
            duration: 5000,
        });
    };

    const processPlanChange = async (plan: 'free' | 'pro' | 'escritorio', planName: string) => {
        const toastId = toast.loading(`Alterando para o plano ${planName}...`);

        try {
            const success = await upgradePlan(plan);

            if (success) {
                toast.success(`Plano alterado para ${planName} com sucesso!`, {
                    id: toastId,
                    duration: 5000
                });
            } else {
                toast.error('Erro ao alterar plano. Tente novamente.', {
                    id: toastId,
                    duration: 5000
                });
            }
        } catch (err) {
            toast.error('Erro ao processar a solicitação', {
                id: toastId,
                duration: 5000
            });
        } finally {
            setTimeout(() => {
                toast.dismiss(toastId);
            }, 6000); // 1 segundo a mais que a duração máxima
        }
    };

    return (
        <div className="max-w-4xl space-y-4 md:space-y-6">
            {/* Mensagens de feedback */}
            {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-700 text-sm">{successMessage}</p>
                </div>
            )}

            {(localError || upgradeError) && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm">{localError || upgradeError}</p>
                </div>
            )}

            {/* Grid de Planos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
                {plans.map((plan) => (
                    <div
                        key={plan.label}
                        className={`border rounded-xl md:rounded-2xl p-4 md:p-6 transition-all duration-300 flex flex-col h-full ${plan.label === user.plan
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-slate-200 bg-white hover:shadow-md'
                            } ${isUpgradingPlan ? 'opacity-50 pointer-events-none' : ''}`}
                    >

                        {/* Header do Plano */}
                        <div className="text-center mb-4 md:mb-6">
                            <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
                                {plan.name}
                            </h3>
                            <div className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                                {plan.price}
                            </div>
                            <div className="text-xs md:text-sm text-slate-600">
                                {plan.description}
                            </div>
                        </div>

                        {/* Lista de Features */}
                        <div className="flex-1 mb-4 md:mb-6">
                            <ul className="space-y-2 md:space-y-3">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="text-xs md:text-sm text-slate-700 flex items-start">
                                        <svg
                                            className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="leading-tight">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Botão de Ação */}
                        <button
                            onClick={() => handlePlanChange(plan.label as 'free' | 'pro' | 'escritorio')}
                            disabled={isUpgradingPlan}
                            className={`w-full py-2 md:py-3 rounded-full font-medium transition-colors text-sm md:text-base ${plan.label === user.plan
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                :
                                'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isUpgradingPlan ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="text-center">
                                        <LoadingAnimation />

                                        <p className="mt-4 text-slate-600"> Processando...</p>
                                    </div>
                                </div>
                            ) : plan.label === user.plan ? (
                                'Plano Atual'
                            ) : (
                                plan.button
                            )}
                        </button>

                    </div>
                ))}
            </div>

            {/* Informações Adicionais */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-6">
                <h4 className="font-semibold text-slate-900 mb-2 md:mb-3 text-sm md:text-base">
                    Como funciona a cobrança?
                </h4>
                <ul className="text-xs md:text-sm text-slate-600 space-y-1 md:space-y-2">
                    <li>• Cobrança mensal recorrente</li>
                    <li>• Você pode cancelar a qualquer momento</li>
                    <li>• Upgrade/downgrade imediato</li>
                    <li>• Suporte incluído em todos os planos</li>
                    <li>• Alterações são refletidas instantaneamente</li>
                </ul>
            </div>

            {/* Aviso sobre downgrade */}
            {user.plan !== 'free' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl md:rounded-2xl p-4 md:p-6">
                    <h4 className="font-semibold text-yellow-900 mb-2 text-sm md:text-base">
                        ⚠️ Atenção ao fazer downgrade
                    </h4>
                    <ul className="text-xs md:text-sm text-yellow-700 space-y-1">
                        <li>• Ao voltar para o plano Free, algumas funcionalidades ficarão indisponíveis</li>
                        <li>• Seus documentos existentes serão mantidos</li>
                        <li>• Limites do plano Free serão aplicados imediatamente</li>
                    </ul>
                </div>
            )}
        </div>
    );
}