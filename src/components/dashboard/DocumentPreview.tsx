"use client";

import { useState, useMemo } from "react";
import { UserDocument } from "@/types/userDocument";
import { Document } from "@/types/document";
import { useUserDocuments } from "@/hooks/userDocuments";
import { Download } from "lucide-react";
import LoadingAnimation from "../shared/LoadingAnimation";

interface DocumentPreviewProps {
    userDocument: UserDocument;
    template: Document;
    onBack: () => void;
    onSave: (updatedAnswers: Record<string, any>) => void;
    onComplete?: (completedDocument: UserDocument) => void;
}

export default function DocumentPreview({ userDocument, template, onBack, onSave, onComplete }: DocumentPreviewProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadType, setDownloadType] = useState<'pdf' | 'doc' | null>(null);
    const [editingAnswers, setEditingAnswers] = useState<Record<string, any>>({ ...userDocument.answers });
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    const { updateDocument, refreshDocuments } = useUserDocuments();

    // -------------------- FUNÇÕES --------------------

    const criarDataLocal = (ano: number, mes: number, dia: number): Date => {
        return new Date(ano, mes - 1, dia);
    };

    const formatarDataABNT = (dataString: string) => {
        if (!dataString) return "Não informado";

        try {
            if (dataString.includes(' de ')) {
                return dataString;
            }

            let data: Date;

            if (dataString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const [ano, mes, dia] = dataString.split('-').map(Number);
                data = criarDataLocal(ano, mes, dia);
            } else {
                data = new Date(dataString);
            }

            if (isNaN(data.getTime())) {
                return dataString;
            }

            const options: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            };
            return data.toLocaleDateString('pt-BR', options);
        } catch {
            return dataString;
        }
    };

    const formatarDataParaInput = (dataString: string) => {
        if (!dataString) return "";

        try {
            let data: Date;

            if (dataString.includes('T')) {
                data = new Date(dataString);
            }
            else if (dataString.includes(' de ')) {
                const partes = dataString.split(' de ');
                if (partes.length === 3) {
                    const dia = parseInt(partes[0]);
                    const mes = obterNumeroMes(partes[1]);
                    const ano = parseInt(partes[2]);
                    data = criarDataLocal(ano, mes, dia);
                } else {
                    return "";
                }
            }
            else {
                data = new Date(dataString);
            }

            if (isNaN(data.getTime())) return "";

            const ano = data.getFullYear();
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const dia = String(data.getDate()).padStart(2, '0');

            return `${ano}-${mes}-${dia}`;
        } catch {
            return "";
        }
    };

    const obterNumeroMes = (mes: string): number => {
        const meses: { [key: string]: number } = {
            'janeiro': 1, 'fevereiro': 2, 'março': 3, 'abril': 4,
            'maio': 5, 'junho': 6, 'julho': 7, 'agosto': 8,
            'setembro': 9, 'outubro': 10, 'novembro': 11, 'dezembro': 12
        };
        return meses[mes.toLowerCase()] || 1;
    };

    const converterDataDoInput = (dataInput: string) => {
        if (!dataInput) return "";

        try {
            const [ano, mes, dia] = dataInput.split('-').map(Number);
            const dataLocal = criarDataLocal(ano, mes, dia);

            const anoISO = dataLocal.getFullYear();
            const mesISO = String(dataLocal.getMonth() + 1).padStart(2, '0');
            const diaISO = String(dataLocal.getDate()).padStart(2, '0');

            return `${anoISO}-${mesISO}-${diaISO}`;
        } catch {
            return dataInput;
        }
    };

    const capitalizarNomeProprio = (texto: string) => {
        if (!texto) return texto;

        const palavrasMinusculas = ["de", "da", "do", "das", "dos", "e", "em", "por", "para", "com", "sem", "sob", "sobre", "entre", "a", "o"];

        return texto
            .toLowerCase()
            .split(" ")
            .map((palavra, index) =>
                index > 0 && palavrasMinusculas.includes(palavra)
                    ? palavra
                    : palavra.charAt(0).toUpperCase() + palavra.slice(1)
            )
            .join(" ");
    };

    const capitalizarLocal = (texto: string) => {
        if (!texto) return texto;

        const especiais = {
            "do": "do",
            "da": "da",
            "de": "de",
            "dos": "dos",
            "das": "das",
            "são": "São",
            "santo": "Santo",
            "santa": "Santa",
            "rio": "Rio",
            "nova": "Nova",
            "novo": "Novo"
        };

        return texto
            .toLowerCase()
            .split(" ")
            .map((p) => especiais[p as keyof typeof especiais] || p.charAt(0).toUpperCase() + p.slice(1))
            .join(" ");
    };

    const iniciarEdicao = (key: string, value: any) => {
        setEditingField(key);

        if (key.includes("data")) {
            setEditValue(formatarDataParaInput(String(value || "")));
        } else {
            setEditValue(String(value || ""));
        }
    };

    const salvarEdicao = () => {
        if (editingField) {
            let valorFinal = editValue;

            if (editingField.includes("data")) {
                valorFinal = converterDataDoInput(editValue);
            }

            const updated = { ...editingAnswers, [editingField]: valorFinal };
            setEditingAnswers(updated);
            setEditingField(null);
            setEditValue("");
        }
    };

    const cancelarEdicao = () => {
        setEditingField(null);
        setEditValue("");
    };

    const handleSaveAll = () => {
        onSave(editingAnswers);
    };

    const documentText = useMemo(() => {
        if (userDocument.generatedText) {
            return userDocument.generatedText;
        }

        // ✅ FALLBACK: Gera o texto se não existir no banco (para documentos antigos)
        let text = template.templateText || "";

        if (!text) {
            text = `\n\n\t\t${template.title.toUpperCase()}\n\n`;

            template.variables?.forEach((variable) => {
                let value = editingAnswers[variable.id] || "Não informado";
                let f = String(value);

                if (variable.type === "date") f = formatarDataABNT(f);
                if (variable.label.toLowerCase().includes("nome")) f = capitalizarNomeProprio(f);
                if (variable.label.toLowerCase().includes("cidade")) f = capitalizarLocal(f);

                text += `${variable.label}: ${f}\n`;
            });

            text += `\n\nDocumento gerado em ${new Date().toLocaleDateString("pt-BR")}\n`;
        } else {
            Object.entries(editingAnswers).forEach(([key, value]) => {
                const placeholder = `{{${key}}}`;
                let f = String(value || "");

                if (key.includes("data")) f = formatarDataABNT(f);
                if (key.includes("nome")) f = capitalizarNomeProprio(f);
                if (key.includes("cidade")) f = capitalizarLocal(f);

                text = text.replace(new RegExp(placeholder, "g"), f);
            });
        }

        return text;
    }, [userDocument.generatedText, template.templateText, template.variables, editingAnswers]); // ✅ Adicione userDocument.generatedText nas dependências

    const generatePDF = async (content: string, title: string, filename: string) => {
        const { jsPDF } = await import('jspdf');

        const pdf = new jsPDF();

        // Configurações ABNT
        const marginLeft = 30;
        const marginRight = 20;
        const marginTop = 40;
        const marginBottom = 20;
        const lineHeight = 6;
        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;
        let yPosition = marginTop;

        pdf.setFont("times");

        // TÍTULO
        pdf.setFontSize(14);
        pdf.setFont("times", "bold");
        const titleFormatted = title.toUpperCase();
        const titleWidth = pdf.getTextWidth(titleFormatted);
        const titleX = (pageWidth - titleWidth) / 2;
        pdf.text(titleFormatted, titleX, yPosition);
        yPosition += 20;

        // LINHA SEPARADORA
        pdf.setDrawColor(0, 0, 0);
        pdf.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
        yPosition += 15;

        // CORPO DO TEXTO
        pdf.setFontSize(12);
        pdf.setFont("times", "normal");

        const paragraphs = content.split('\n');

        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i].trim();

            if (!paragraph) {
                yPosition += lineHeight;
                continue;
            }

            if (paragraph === paragraph.toUpperCase() && paragraph.length > 5) {
                if (yPosition > pageHeight - marginBottom - 20) {
                    pdf.addPage();
                    yPosition = marginTop;
                }

                pdf.setFont("times", "bold");
                const titleLines = pdf.splitTextToSize(paragraph, pageWidth - marginLeft - marginRight);
                pdf.text(titleLines, marginLeft, yPosition);
                yPosition += (titleLines.length * lineHeight) + 8;
                pdf.setFont("times", "normal");
                continue;
            }

            const textLines = pdf.splitTextToSize(paragraph, pageWidth - marginLeft - marginRight);

            if (yPosition + (textLines.length * lineHeight) > pageHeight - marginBottom) {
                pdf.addPage();
                yPosition = marginTop;
            }

            pdf.text(textLines, marginLeft, yPosition);
            yPosition += (textLines.length * lineHeight) + 2;
        }

        // SEÇÃO DE ASSINATURAS
        yPosition += 20;
        if (yPosition > pageHeight - 60) {
            pdf.addPage();
            yPosition = marginTop;
        }

        const signatureY = pageHeight - 50;
        pdf.line(marginLeft, signatureY, marginLeft + 70, signatureY);
        pdf.line(pageWidth - marginRight - 70, signatureY, pageWidth - marginRight, signatureY);

        pdf.setFontSize(10);
        pdf.text("Assinatura da Parte 1", marginLeft, signatureY + 8);
        pdf.text("Assinatura da Parte 2", pageWidth - marginRight - 70, signatureY + 8);

        // RODAPÉ ABNT
        const date = new Date().toLocaleDateString('pt-BR');
        pdf.setFontSize(9);
        pdf.text(`Documento gerado em ${date} - Jurieasy`, marginLeft, pageHeight - 10);

        pdf.save(`${filename}.pdf`);
    };

    const generateDOC = async (content: string, title: string, filename: string) => {
        // Criar conteúdo HTML formatado para DOC
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${title}</title>
                <style>
                    body { 
                        font-family: 'Times New Roman', Times, serif; 
                        font-size: 12pt; 
                        line-height: 1.6;
                        margin: 3cm 2cm 2cm 3cm;
                        text-align: justify;
                    }
                    .title { 
                        text-align: center; 
                        font-weight: bold; 
                        font-size: 14pt;
                        text-transform: uppercase;
                        margin-bottom: 20px;
                    }
                    .signature-section { 
                        margin-top: 60px; 
                        border-top: 1px solid #000;
                        padding-top: 10px;
                        text-align: center;
                    }
                    .footer {
                        font-size: 9pt;
                        text-align: left;
                        margin-top: 30px;
                    }
                </style>
            </head>
            <body>
                <div class="title">${title}</div>
                ${content.split('\n').map(paragraph => {
            if (paragraph.trim().toUpperCase() === paragraph.trim() && paragraph.trim()) {
                return `<div class="title" style="font-size: 12pt; margin: 15px 0;">${paragraph}</div>`;
            }
            return `<p style="text-indent: 30px; margin: 2px 0;">${paragraph}</p>`;
        }).join('')}
                
                <div class="signature-section">
                    <table width="100%">
                        <tr>
                            <td width="50%" align="center">
                                <div style="border-top: 1px solid #000; width: 200px; margin: 0 auto;"></div>
                                <p>Assinatura da Parte 1</p>
                            </td>
                            <td width="50%" align="center">
                                <div style="border-top: 1px solid #000; width: 200px; margin: 0 auto;"></div>
                                <p>Assinatura da Parte 2</p>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <div class="footer">
                    Documento gerado em ${new Date().toLocaleDateString('pt-BR')} - Jurieasy
                </div>
            </body>
            </html>
        `;

        // Criar blob e fazer download
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // components/dashboard/DocumentPreview.tsx
    const handleDownload = async (format: 'pdf' | 'doc') => {
        setIsDownloading(true);
        setDownloadType(format);

        try {
            // 1. Atualizar o documento para status "completed"
            const updatedDocument = await updateDocument(userDocument._id, {
                answers: editingAnswers,
                status: "completed",
                currentStep: userDocument.currentStep,
                totalSteps: userDocument.totalSteps,
                shouldSave: true
            });

            if (updatedDocument) {
                // 2. Gerar e baixar no formato escolhido
                if (format === 'pdf') {
                    await generatePDF(documentText, template.title, template.title.replace(/\s+/g, '_'));
                } else {
                    await generateDOC(documentText, template.title, template.title.replace(/\s+/g, '_'));
                }

                // 3. ✅ CORREÇÃO: Aguardar um pouco antes do refresh para garantir que o backend processou
                setTimeout(() => {
                    refreshDocuments();
                }, 500);

                // 4. Notificar componente pai sobre conclusão
                if (onComplete) {
                    onComplete(updatedDocument);
                }

                console.log(`✅ Documento concluído e ${format.toUpperCase()} baixado com sucesso!`);
            }
        } catch (error) {
            console.error(`❌ Erro no download ${format.toUpperCase()}:`, error);
            // ... fallback
        } finally {
            setIsDownloading(false);
            setDownloadType(null);
        }
    };

    const formatarTextoPreview = (texto: string) => {
        return texto.split("\n").map((linha, index) => {
            if (linha.trim().toUpperCase() === linha.trim() && linha.trim()) {
                return (
                    <div key={index} className="text-center font-bold text-lg my-6 tracking-wide text-gray-900">
                        {linha}
                    </div>
                );
            }

            if (linha.includes(":")) {
                const [rotulo, valor] = linha.split(":");
                return (
                    <div key={index} className="my-2 flex gap-2">
                        <span className="font-semibold text-gray-800">{rotulo}:</span>
                        <span className="text-gray-700">{valor}</span>
                    </div>
                );
            }

            return <div key={index} className="my-1 text-gray-700">{linha || <br />}</div>;
        });
    };

    // -------------------- UI MODERNIZADA --------------------

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">

                {/* Header Moderno */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-200/50 p-6 mb-6 transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                {template.title}
                            </h1>

                            <p className="text-gray-600 mt-1 leading-relaxed">
                                {template.description} —
                                <span className="text-[#1A237E] font-semibold"> Formato ABNT</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3">

                            {/* BOTÃO VOLTAR */}
                            <button
                                onClick={onBack}
                                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700
                bg-white/60 backdrop-blur-sm
                hover:bg-gray-100 hover:border-gray-400
                transition-all active:scale-95 shadow-sm"
                            >
                                ←
                            </button>

                            <div className="flex items-center gap-2">
                                {/* BOTÃO BAIXAR PDF */}
                                <button
                                    onClick={() => handleDownload('pdf')}
                                    disabled={isDownloading}
                                    className="px-4 py-2 rounded-xl text-white font-medium
                    bg-slate-600
                    hover:from-slate-600 hover:to-slate-700
                    disabled:opacity-50
                    transition-all active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2"
                                >
                                    {isDownloading && downloadType === 'pdf' ? (
                                        <div className="flex items-center gap-2">
                                            <div className="text-center">
                                                <LoadingAnimation />
                                                <p className="mt-4 text-slate-600">Baixando...</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            PDF
                                        </>
                                    )}
                                </button>

                                {/* BOTÃO BAIXAR DOC */}
                                <button
                                    onClick={() => handleDownload('doc')}
                                    disabled={isDownloading}
                                    className="px-4 py-2 rounded-xl text-white font-medium
                    bg-blue-600
                    hover:from-blue-600 hover:to-blue-700
                    disabled:opacity-50
                    transition-all active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2"
                                >
                                    {isDownloading && downloadType === 'doc' ? (
                                        <div className="flex items-center gap-2">
                                            <div className="text-center">
                                                <LoadingAnimation />
                                                Baixando...
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            DOC
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Resto do conteúdo */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-10 mb-10 transition-all">
                    <div className="max-w-none font-serif text-[15px] text-gray-900 leading-[1.6] text-justify tracking-tight [text-indent:30px] prose-headings:font-serif prose-headings:text-gray-900 prose-headings:text-[17px]">
                        {documentText ? (
                            <>
                                {formatarTextoPreview(documentText)}

                                {/* Assinaturas (ABNT) */}
                                <div className="mt-20 pt-10 border-t border-gray-400 grid grid-cols-1 md:grid-cols-2 gap-16">
                                    {[1, 2].map((p) => (
                                        <div key={p} className="text-center">
                                            <div className="h-24"></div>
                                            <div className="border-t border-gray-600 w-64 mx-auto"></div>
                                            <p className="text-[13px] text-gray-700 mt-2 tracking-wide font-serif">
                                                Assinatura da Parte {p}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-500 py-12">
                                <p>Nenhum conteúdo disponível para visualização.</p>
                            </div>
                        )}
                    </div>
                </div>


                <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-200/40 p-6 transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-black tracking-tight">
                            Dados Preenchidos
                        </h2>
                    </div>

                    {/* GRID DE CAMPOS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {Object.entries(editingAnswers).map(([key, value]) => {
                            let v = String(value || "—");
                            if (key.includes("nome")) v = capitalizarNomeProprio(v);
                            if (key.includes("cidade")) v = capitalizarLocal(v);
                            if (key.includes("data")) v = formatarDataABNT(v);

                            const isActive = editingField === key;
                            const isDataField = key.includes("data");

                            return (
                                <div
                                    key={key}
                                    onClick={() => iniciarEdicao(key, value)}
                                    className={`
                        rounded-xl p-4 cursor-pointer transition-all border border-gray-200 bg-white/50 hover:bg-white/70 hover:shadow-md"
                                        
                    `}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 capitalize">
                                            {key.replace(/_/g, " ")}
                                        </span>

                                        <span
                                            className={`
                                text-xs px-2 py-0.5 rounded-full shadow-sm transition
                                ${isActive
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-blue-600 text-white"
                                                }
                            `}
                                        >
                                            {isActive ? "Editando…" : "Editar"}
                                        </span>
                                    </div>

                                    {/* CAMPO DE EDIÇÃO */}
                                    {isActive ? (
                                        <div className="mt-2 space-y-3">
                                            {isDataField ? (
                                                <input
                                                    type="date"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg
                                    focus:ring-2 focus:ring-blue-300 outline-none shadow-sm"
                                                    autoFocus
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg
                                    focus:ring-2 focus:ring-blue-300 outline-none shadow-sm"
                                                    autoFocus
                                                />
                                            )}

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        salvarEdicao();
                                                    }}
                                                    className="px-3 py-1.5 rounded-lg font-medium text-white bg-gradient-to-r
                                    from-blue-500 to-blue-600 hover:opacity-90 active:scale-95 transition shadow-sm"
                                                >
                                                    Salvar
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        cancelarEdicao();
                                                    }}
                                                    className="px-3 py-1.5 rounded-lg font-medium text-black bg-gray-200
                                    hover:bg-gray-300 active:scale-95 transition shadow-sm"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-[#1A237E] font-semibold text-sm mt-1">
                                            {v}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* RODAPÉ */}
                    <div className="mt-6 pt-4 border-t border-gray-200/70 flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                            Todas as alterações são refletidas automaticamente no documento.
                        </p>
                    </div>
                </div>

                {/* Informações do Documento */}
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 mt-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all">

                    <h3 className="text-xl font-bold text-[#1A237E] mb-6 flex items-center gap-2 tracking-tight">
                        Informações do Documento
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">

                        {/* Card */}
                        <div className="rounded-xl p-4 bg-[#E8EAF6] border border-[#C5CAE9] shadow-sm hover:shadow-md transition-all">
                            <span className="text-[#1A237E] font-medium block opacity-90">Título</span>
                            <p className="mt-1 text-[#1A237E] font-semibold tracking-tight">
                                {template.title}
                            </p>
                        </div>

                        {/* Card */}
                        <div className="rounded-xl p-4 bg-[#E8EAF6] border border-[#C5CAE9] shadow-sm hover:shadow-md transition-all">
                            <span className="text-[#1A237E] font-medium block opacity-90">Categoria</span>
                            <p className="mt-1 text-[#1A237E] font-semibold capitalize tracking-tight">
                                {template.category}
                            </p>
                        </div>

                        {/* Card */}
                        <div className="rounded-xl p-4 bg-[#E8EAF6] border border-[#C5CAE9] shadow-sm hover:shadow-md transition-all">
                            <span className="text-[#1A237E] font-medium block opacity-90">Gerado em</span>
                            <p className="mt-1 text-[#1A237E] font-semibold tracking-tight">
                                {new Date().toLocaleDateString("pt-BR")}
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}