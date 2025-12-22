import { UserDocument } from "@/types/userDocument";
import { Document } from "@/types/document";
import { getIconByCategory } from "@/utils/documentCategoriesIcons";
import { ChevronRight, Clock, Plus, Star, Eye, HelpCircle } from "lucide-react";
import { useState } from "react";
import TemplatePreviewDrawer from "@/components/dashboard/TemplatePreviewDrawer";

interface DocumentCardProps {
    item: Document | UserDocument;
    mode: 'create' | 'drafts';
    onSelect: (item: Document | UserDocument) => void;
}

export function DocumentCard({ item, mode, onSelect }: DocumentCardProps) {
    const [showTemplatePreview, setShowTemplatePreview] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<{
        text: string;
        title: string;
    } | null>(null);

    const handlePreviewTemplate = (e: React.MouseEvent, document: Document) => {
        e.stopPropagation(); // Impede que o clique dispare o onSelect

        if (document.templateText) {
            setSelectedTemplate({
                text: document.templateText,
                title: document.title
            });
            setShowTemplatePreview(true);
        }
    };

    const handleClosePreview = () => {
        setShowTemplatePreview(false);
        setSelectedTemplate(null);
    };

    if (mode === 'create') {
        const document = item as Document;
        const IconComponent = getIconByCategory(document.category);

        return (
            <>
                <div
                    className="group relative p-4 sm:p-6 border border-slate-200 rounded-xl sm:rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
                    onClick={() => onSelect(document)}
                >
                    {/* Ícones flutuantes - Aparecem no hover */}
                    {(document.templateText || document.whyUseThis || document.requiredDocuments) && (
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                            {document.templateText && (
                                <button
                                    onClick={(e) => handlePreviewTemplate(e, document)}
                                    className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-sm border border-slate-200"
                                    title="Visualizar template do contrato"
                                >
                                    <Eye className="w-4 h-4 text-slate-600 hover:text-blue-600 transition-colors" />
                                </button>
                            )}

                            {(document.whyUseThis || document.requiredDocuments) && (
                                <div className="relative group/question">
                                    <div className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 cursor-help">
                                        <HelpCircle className="w-4 h-4 text-slate-600" />
                                    </div>

                                    {/* Tooltip */}
                                    <div className="absolute right-0 top-full mt-2 w-64 sm:w-80 p-4 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover/question:opacity-100 group-hover/question:visible transition-all duration-200 z-20">
                                        <div className="space-y-3">
                                            {document.whyUseThis && (
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 text-sm mb-1">Por que usar?</h4>
                                                    <p className="text-slate-600 text-xs">{document.whyUseThis}</p>
                                                </div>
                                            )}

                                            {document.requiredDocuments && (
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 text-sm mb-1">Documentos necessários:</h4>
                                                    <p className="text-slate-600 text-xs">
                                                        {Array.isArray(document.requiredDocuments)
                                                            ? document.requiredDocuments.join(', ')
                                                            : document.requiredDocuments}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Seta do tooltip */}
                                        <div className="absolute -top-2 right-3 w-4 h-4 bg-white border-t border-l border-slate-200 transform rotate-45"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


                    <div className="flex items-start gap-3 sm:gap-4">
                        {/* Ícone */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 min-w-0">
                            {/* Cabeçalho com título e badge popular */}
                            <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-2">
                                <h3 className="font-semibold text-slate-900 text-base sm:text-lg leading-tight line-clamp-2 xs:line-clamp-1 pr-8">
                                    {document.title}
                                </h3>
                                {document.isPopular && (
                                    <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full w-fit">
                                        <Star className="w-3 h-3 fill-amber-500" />
                                        Popular
                                    </span>
                                )}

                                <span className="flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full w-fit">
                                    <Clock className="w-3 h-3" />
                                    {document.estimatedCompletionTime} minutos
                                </span>
                            </div>

                            {/* Descrição */}
                            <p className="text-slate-600 text-xs sm:text-sm mb-3 line-clamp-2">
                                {document.description}
                            </p>

                            {/* Rodapé */}
                            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-0">
                                <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-full w-fit">
                                    {document.category.charAt(0).toUpperCase() + document.category.slice(1)}
                                </span>
                                <div className="text-blue-600 text-xs sm:text-sm font-semibold group-hover:translate-x-1 transition-transform duration-300 flex items-center justify-end gap-1">
                                    Criar <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-50 opacity-0 group-hover:opacity-100 rounded-xl sm:rounded-2xl transition-opacity duration-300 -z-10" />
                </div>

                {/* Drawer de preview do template */}
                {selectedTemplate && (
                    <TemplatePreviewDrawer
                        isOpen={showTemplatePreview}
                        onClose={handleClosePreview}
                        templateText={selectedTemplate.text}
                        documentTitle={selectedTemplate.title}
                    />
                )}
            </>
        );
    } else {
        const document = item as UserDocument;
        const documentTitle = document.documentId?.title || 'Documento sem título';
        const documentCategory = document.documentId?.category || 'Sem categoria';
        const IconComponent = getIconByCategory(documentCategory);

        const getProgressInfo = () => {
            // USAR totalSteps do UserDocument
            const totalQuestions = document.totalSteps || 0;

            if (totalQuestions === 0) {
                return { percentage: 0, answered: 0, total: 0, hasValidProgress: false };
            }

            const answeredQuestions = document.answers ?
                Object.values(document.answers).filter(
                    answer => answer !== null && answer !== undefined && answer !== ''
                ).length : 0;

            const percentage = Math.min(Math.round((answeredQuestions / totalQuestions) * 100), 100);

            return {
                percentage,
                answered: answeredQuestions,
                total: totalQuestions,
                hasValidProgress: totalQuestions > 0
            };
        };

        const progressInfo = getProgressInfo();

        const hasProgress = progressInfo.hasValidProgress &&
            (document.status === 'draft' || document.status === 'in_progress') &&
            progressInfo.answered > 0;

        return (
            <div
                className="group relative p-4 sm:p-6 border border-slate-200 rounded-xl sm:rounded-2xl hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
                onClick={() => onSelect(document)}
            >
                <div className="flex items-start gap-3 sm:gap-4">
                    {/* Ícone */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600  rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                        {/* Título */}
                        <h3 className="font-semibold text-slate-900 text-base sm:text-lg leading-tight mb-2 line-clamp-2">
                            {documentTitle}
                        </h3>

                        {/* Barra de Progresso - Baseada nas respostas preenchidas */}
                        {hasProgress && (
                            <div className="mb-3">
                                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                                    <span>Progresso</span>
                                    <span>{progressInfo.percentage}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 sm:h-2">
                                    <div
                                        className="bg-green-600 h-1.5 sm:h-2 rounded-full transition-all duration-300 group-hover:bg-green-700"
                                        style={{ width: `${progressInfo.percentage}%` }}
                                    />
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                    {progressInfo.answered} de {document.totalSteps} questões respondidas
                                </div>
                            </div>
                        )}

                        {/* Categoria e Informações */}
                        <div className={`flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-0 ${hasProgress ? 'mb-3' : 'mb-4'}`}>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-full w-fit">
                                    {documentCategory.charAt(0).toUpperCase() + documentCategory.slice(1)}
                                </span>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${document.status === 'draft'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : document.status === 'in_progress'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                    {document.status === 'draft' ? 'Rascunho' :
                                        document.status === 'in_progress' ? 'Em Andamento' :
                                            'Concluído'}
                                </span>
                            </div>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {document.updatedAt ?
                                    `Editado ${new Date(document.updatedAt).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit'
                                    })}` :
                                    'Sem data'
                                }
                            </span>
                        </div>

                        {/* Rodapé */}
                        <div className="flex items-center justify-between">
                            <div className="text-blue-600 text-xs sm:text-sm font-semibold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1 ml-auto">
                                {document.status === 'completed' ? 'Visualizar' : 'Continuar'}
                                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-slate-50 opacity-0 group-hover:opacity-100 rounded-xl sm:rounded-2xl transition-opacity duration-300 -z-10" />
            </div>
        );
    }
}