import { Menu } from "lucide-react";
import { TouchHandlers } from "./Types";

interface DashboardHeaderProps extends TouchHandlers {
    onMobileMenuOpen: () => void;
    name: String
}

export default function DashboardHeader({ onMobileMenuOpen, onTouchStart, onTouchEnd, name }: DashboardHeaderProps) {
    return (
        <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Botão Menu Mobile */}
                    <button
                        className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 active:scale-95"
                        onClick={onMobileMenuOpen}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                    >
                        <Menu className="w-6 h-6 text-slate-700" />
                    </button>

                    <div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
                            Olá, {name}
                        </h1>
                        <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-2xl">
                            Continue de onde parou ou explore novos modelos
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}