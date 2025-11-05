import { ContractTemplate, TouchHandlers } from "../dashboard/Types";

interface FeaturedTemplateCardProps extends TouchHandlers {
    template: ContractTemplate;
}

export default function FeaturedTemplateCard({ template, onTouchStart, onTouchEnd }: FeaturedTemplateCardProps) {
    return (
        <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl"></div>
            <div
                className="relative p-4 border border-slate-200 rounded-xl transition-all duration-300 cursor-pointer h-full active:scale-95 lg:hover:border-blue-200 lg:hover:shadow-md"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        console.log('Selected featured template:', template.title);
                    }
                }}
                onClick={() => {
                    console.log('Selected featured template:', template.title);
                }}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center transition-transform duration-300 flex-shrink-0 shadow-sm active:scale-110 lg:group-hover:scale-110">
                        {template.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-tight">
                            {template.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1.5">{template.category}</p>
                        {template.description && (
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                {template.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}