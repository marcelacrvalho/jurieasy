import { ChevronRight, X } from "lucide-react";
import { QuickAction, TouchHandlers } from "../dashboard/Types";

interface MobileMenuProps extends TouchHandlers {
    isOpen: boolean;
    onClose: () => void;
    quickActions: QuickAction[];
    onNewDocument: () => void;
    onMyDocuments: () => void; // ✅ NOVA PROP
    onMyProfile: () => void;   // ✅ NOVA PROP
}

export default function MobileMenu({
    isOpen,
    onClose,
    quickActions,
    onTouchStart,
    onTouchEnd,
    onNewDocument,
    onMyDocuments, // ✅ NOVA PROP
    onMyProfile     // ✅ NOVA PROP
}: MobileMenuProps) {

    const handleActionClick = (actionLabel: string) => {
        switch (actionLabel) {
            case "Novo Contrato":
                onNewDocument();
                break;
            case "Meus Documentos":
                onMyDocuments(); // ✅ CHAMA A FUNÇÃO
                break;
            case "Meu Perfil":
                onMyProfile();   // ✅ CHAMA A FUNÇÃO
                break;
            default:
                console.log('Mobile action:', actionLabel);
        }
        onClose(); // Fecha o menu após clicar
    };

    return (
        <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Menu Drawer */}
            <div className={`absolute right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-l border-slate-200 rounded-l-3xl shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Header do Menu */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Menu</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
                    >
                        <X className="w-6 h-6 text-slate-700" />
                    </button>
                </div>

                {/* Conteúdo do Menu */}
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Navegação</h3>
                        {quickActions.map((action) => (
                            <button
                                key={action.label}
                                className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-100 rounded-2xl transition-all duration-200 active:scale-95"
                                onClick={() => handleActionClick(action.label)} // ✅ FUNÇÃO UNIFICADA
                                onTouchStart={onTouchStart}
                                onTouchEnd={onTouchEnd}
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
}