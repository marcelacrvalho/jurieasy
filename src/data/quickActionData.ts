import {
    Plus, Folder, Library, User,
} from "lucide-react";
import { QuickAction } from "@/components/dashboard/Types";

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
        icon: Library,
        label: "Biblioteca",
        color: "from-amber-500 to-amber-600",
        iconColor: "text-white",
        description: "Seu banco de dados pessoal"
    },
    {
        icon: User,
        label: "Meu Perfil",
        color: "from-emerald-500 to-emerald-600",
        iconColor: "text-white",
        description: "Configurações pessoais"
    }
];