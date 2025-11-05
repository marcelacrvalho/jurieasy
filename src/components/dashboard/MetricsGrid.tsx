import { Metric, TouchHandlers } from "../dashboard/Types";

interface MetricsGridProps extends TouchHandlers {
    metric: Metric;
}

export default function MetricsGrid({ metric, onTouchStart, onTouchEnd }: MetricsGridProps) {
    return (
        <div
            className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm transition-all duration-300 active:scale-95 lg:hover:scale-[1.02] lg:hover:shadow-lg"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm font-medium mb-2">
                        <metric.icon className="w-4 h-4" />
                        {metric.label}
                    </div>
                    <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                        {metric.value}
                    </div>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.bgGradient} rounded-xl flex items-center justify-center transition-transform duration-300 shadow-sm active:scale-110 lg:group-hover:scale-110`}>
                    {metric.iconComponent}
                </div>
            </div>
        </div>
    );
}