import { ChevronRight } from "lucide-react";
import { ContractTemplate, TouchHandlers } from "../dashboard/Types";

interface TemplateCardProps extends TouchHandlers {
    template: ContractTemplate;
}

export default function TemplateCard({ template, onTouchStart, onTouchEnd }: TemplateCardProps) {
    return (
        <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-slate-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl"></div>
            <div
                role="button"
                tabIndex={0}
                className="relative flex flex-col xs:flex-row xs:items-center justify-between p-4 border border-slate-200 rounded-xl transition-all duration-300 cursor-pointer active:scale-95 lg:hover:border-blue-200 lg:hover:shadow-md"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        console.log('Selected template:', template.title);
                    }
                }}
                onClick={() => {
                    console.log('Selected template:', template.title);
                }}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center transition-transform duration-300 shadow-sm active:scale-110 lg:group-hover:scale-110">
                            {template.icon}
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900 truncate text-sm sm:text-base">
                                {template.title}
                            </h3>
                        </div>
                        <p className="text-sm text-slate-600 mt-0.5">{template.category}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-3 xs:mt-0">
                    <div className="text-right flex-shrink-0">
                        <p className="text-xs text-slate-500 font-medium">Último uso</p>
                        <p className="text-sm font-semibold text-slate-900">{template.lastUsed}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 transition-all duration-300 flex-shrink-0 active:text-blue-600 active:translate-x-1 lg:group-hover:text-blue-600 lg:group-hover:translate-x-1" />
                </div>
            </div>
        </div>
    );
}