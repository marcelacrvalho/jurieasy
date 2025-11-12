import {
    FileText, Plus, Folder, Star, User, TrendingUp,
    Clock, RefreshCw, Zap, Shield, Briefcase,
    Building, Home, Scale,
    FilePen
} from "lucide-react";
import { QuickAction, Metric } from "@/components/dashboard/Types";
import React from "react";

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
        description: "Seus preferidos"
    },
    {
        icon: User,
        label: "Meu Perfil",
        color: "from-emerald-500 to-emerald-600",
        iconColor: "text-white",
        description: "Configurações pessoais"
    }
];