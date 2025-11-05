import { ChevronRight } from "lucide-react";
import { QuickAction } from "../dashboard/Types";

interface QuickActionButtonProps {
    action: QuickAction;
    onClick: () => void;
}

export default function QuickActionButton({ action, onClick }: QuickActionButtonProps) {
    return (
        <button
            className="w-full flex items-center gap-4 p-4 text-left border border-slate-200 rounded-xl transition-all duration-300 group hover:border-blue-200 hover:shadow-md"
            onClick={onClick}
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
    );
}