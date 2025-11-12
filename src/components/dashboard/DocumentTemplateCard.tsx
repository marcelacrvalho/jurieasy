import { UserDocument } from '@/types/userDocument';
import { TouchHandlers } from "./Types";
import {
    LucideProps,
    FileText,
    House,
    HouseHeart,
    Store,
    ShoppingCart,
    Construction,
    Users,
    BrickWall,
    Scale
} from 'lucide-react';
import { ForwardRefExoticComponent } from 'react';

interface DocumentTemplateCardProps extends TouchHandlers {
    document: UserDocument;
}

export default function DocumentTemplateCard({ document, onTouchStart, onTouchEnd }: DocumentTemplateCardProps) {
    const template = document.documentId;
    const documentTitle = template?.title || 'Documento sem título';
    const documentCategory = template?.category || 'Sem categoria';

    const getIconByCategory = (category: string) => {
        const icons: { [key: string]: ForwardRefExoticComponent<Omit<LucideProps, "ref">> } = {
            'civil': Scale,
            'trabalhista': Construction,
            'penal': BrickWall,
            'empresarial': Store,
            'consumidor': ShoppingCart,
            'família': HouseHeart,
            'imobiliario': House,
            'sucessões': Users
        };
        return icons[category.toLowerCase()] || FileText;
    };

    const Icon = getIconByCategory(documentCategory);

    return (
        <div
            className="group relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer h-full 
            border border-gray-200 bg-white
            shadow-sm transition-all duration-300 active:scale-95 lg:hover:scale-[1.02] lg:hover:border-blue-200 hover:shadow-md"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    console.log('Selected document:', documentTitle);
                }
            }}
            onClick={() => console.log('Selected document:', documentTitle)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div className="relative p-4 flex items-start gap-4">
                {/* Ícone */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center 
                transition-transform duration-300 flex-shrink-0 shadow-sm 
                active:scale-110 lg:group-hover:scale-110">
                    <Icon className="w-5 h-5 text-white transition-colors" />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#0B1220] text-sm sm:text-base leading-tight">
                        {documentTitle}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1.5">
                        {documentCategory.charAt(0).toUpperCase() + documentCategory.slice(1)}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">
                            {document.updatedAt
                                ? `Último uso em ${new Date(document.updatedAt).toLocaleDateString()}`
                                : 'Sem data'}
                        </span>

                        <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${document.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : document.status === 'in_progress'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                        >
                            {document.status === 'draft'
                                ? 'Rascunho'
                                : document.status === 'in_progress'
                                    ? 'Em andamento'
                                    : 'Completo'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
