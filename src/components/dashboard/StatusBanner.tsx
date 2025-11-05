import { Shield } from "lucide-react";

export default function StatusBanner() {
    return (
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
    );
}