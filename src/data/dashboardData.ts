import {
    FileText, Plus, Folder, Star, User, TrendingUp,
    Clock, RefreshCw, Zap, Shield, Briefcase,
    Building, Home, Scale
} from "lucide-react";
import { ContractTemplate, QuickAction, Metric } from "@/components/dashboard/Types";
import React from "react";

export const recentTemplatesData: ContractTemplate[] = [
    {
        id: "1",
        title: "Compra e Venda",
        lastUsed: "31/10/2025",
        category: "Contratos Civis",
        icon: React.createElement(Briefcase, { className: "w-4 h-4 text-white" })
    },
    {
        id: "2",
        title: "Pensão Socioafetiva",
        lastUsed: "31/10/2025",
        category: "Direito Familiar",
        icon: React.createElement(Scale, { className: "w-4 h-4 text-white" })
    },
    {
        id: "3",
        title: "Contrato de Compra e Venda",
        lastUsed: "01/10/2025",
        category: "Contratos Civis",
        icon: React.createElement(FileText, { className: "w-4 h-4 text-white" })
    }
];

export const featuredTemplatesData: ContractTemplate[] = [
    {
        id: "4",
        title: "Contrato de Prestação de Serviços",
        category: "Contratos Trabalhistas",
        description: "Modelo atualizado conforme nova legislação",
        icon: React.createElement(Zap, { className: "w-4 h-4 text-white" })
    },
    {
        id: "5",
        title: "Locação Residencial",
        category: "Contratos Imobiliários",
        description: "Inclui cláusulas de proteção ao locatário",
        icon: React.createElement(Home, { className: "w-4 h-4 text-white" })
    },
    {
        id: "6",
        title: "Procuração Geral",
        category: "Documentos Jurídicos",
        description: "Modelo com poderes específicos",
        icon: React.createElement(User, { className: "w-4 h-4 text-white" })
    },
    {
        id: "7",
        title: "Contrato Societário",
        category: "Empresarial",
        description: "Para constituição e alteração de sociedades",
        icon: React.createElement(Building, { className: "w-4 h-4 text-white" })
    }
];

export const quickActionsData: QuickAction[] = [
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

export const metricsData: Metric[] = [
    {
        icon: TrendingUp,
        label: "Contratos este mês",
        value: "128",
        gradient: "from-slate-800 to-slate-900",
        bgGradient: "from-blue-500 to-blue-600",
        iconComponent: React.createElement(FileText, { className: "w-6 h-6 text-white" })
    },
    {
        icon: RefreshCw,
        label: "Modelos atualizados",
        value: "14",
        gradient: "from-slate-800 to-slate-900",
        bgGradient: "from-emerald-500 to-emerald-600",
        iconComponent: React.createElement(RefreshCw, { className: "w-6 h-6 text-white" })
    },
    {
        icon: Clock,
        label: "Tempo médio",
        value: "4m 22s",
        gradient: "from-slate-800 to-slate-900",
        bgGradient: "from-violet-500 to-violet-600",
        iconComponent: React.createElement(Clock, { className: "w-6 h-6 text-white" })
    }
];