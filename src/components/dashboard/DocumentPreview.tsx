"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { UserDocument } from "@/types/userDocument";
import { Document, Witness } from "@/types/document";
import { useUserDocuments } from "@/hooks/userDocuments";
import { Download, FolderOpen, ImageIcon, Trash2, Upload } from "lucide-react";

interface DocumentPreviewProps {
    userDocument: UserDocument;
    template: Document;
    plan: String;
    onBack: () => void;
    onSave: (updatedAnswers: Record<string, any>) => void;
    onComplete?: (completedDocument: UserDocument) => void;
}

export default function DocumentPreview({ userDocument, template, plan, onBack, onSave, onComplete }: DocumentPreviewProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadType, setDownloadType] = useState<'pdf' | 'doc' | 'docuSign' | null>(null);
    const [editingAnswers, setEditingAnswers] = useState<Record<string, any>>({ ...userDocument.answers });
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [logo, setLogo] = useState<string | null>(null);

    const { updateDocument, refreshDocuments } = useUserDocuments();

    // -------------------- FUNÇÕES --------------------

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => setLogo(null);

    // Função auxiliar para carregar dados da imagem
    const obterDimensoesImagem = (base64: string): Promise<{ width: number; height: number; format: string }> => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {
                // Tenta extrair o formato da string base64 (ex: data:image/png;base64...)
                let format = 'PNG'; // Fallback
                try {
                    const match = base64.match(/^data:image\/(\w+);base64,/);
                    if (match && match[1]) {
                        format = match[1].toUpperCase();
                        // jspdf prefere 'JPEG' em vez de 'JPG'
                        if (format === 'JPG') format = 'JPEG';
                    }
                } catch (e) {
                    console.warn("Não foi possível detectar formato da imagem, usando PNG.");
                }

                resolve({
                    width: img.width,
                    height: img.height,
                    format: format as string
                });
            };
            img.onerror = reject;
            img.src = base64;
        });
    };

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

    const [textoEditavel, setTextoEditavel] = useState(documentText || "");

    useEffect(() => {
        setTextoEditavel(documentText || "");
    }, [documentText]);

    // 3. (Opcional) Referência para pegar o texto na hora do download sem precisar re-renderizar tudo
    const textoRef = useRef(documentText || "");

    // Função para atualizar o texto conforme o usuário digita
    const handleTextChange = (e: { currentTarget: { innerText: any; }; }) => {
        const novoTexto = e.currentTarget.innerText;
        setTextoEditavel(novoTexto);
        textoRef.current = novoTexto;
    };

    const generatePDF = async (
        content: string,
        title: string,
        filename: string,
        witnesses?: Witness[]
    ) => {
        const { jsPDF } = await import("jspdf");

        const pdf = new jsPDF({
            unit: "pt",
            format: "a4",
        });

        const marginLeft = 60;
        const marginRight = 40;
        let marginTop = 60;
        const marginBottom = 40;
        const lineHeight = 18;
        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;

        pdf.setFont("Times");
        pdf.setFontSize(12);
        pdf.setTextColor(0);

        if (logo) {
            try {
                // 1. Obtemos as dimensões e formato de forma segura usando o navegador
                const { width, height, format } = await obterDimensoesImagem(logo);

                const imgWidth = 100; // Largura fixa desejada no PDF
                const imgHeight = (height * imgWidth) / width; // Mantém proporção

                // Centraliza
                const x = (pageWidth - imgWidth) / 2;
                const y = 30;

                // 2. Passamos o formato explicitamente ('PNG', 'JPEG') para o jspdf não se perder
                // O alias 'format' deve ser um dos tipos suportados pelo jspdf
                // Se o formato não for suportado (ex: webp), isso pode ainda dar erro, 
                // mas o input file deve restringir isso.
                pdf.addImage(logo, format, x, y, imgWidth, imgHeight);

                marginTop = y + imgHeight + 30;
            } catch (error) {
                console.error("Erro ao adicionar logo no PDF:", error);
                // Se der erro, o PDF continua sendo gerado sem a logo
            }
        }
        // ---------------------------------------------------------

        let y = marginTop + 10;

        // Cabeçalho
        pdf.setLineWidth(0.4);
        pdf.line(marginLeft, marginTop - 20, pageWidth - marginRight, marginTop - 20);

        pdf.setFont("Times", "bold");
        pdf.setFontSize(14);
        pdf.text(title.toUpperCase(), pageWidth / 2, y, { align: "center" });
        y += 25;

        pdf.setLineWidth(0.3);
        pdf.line(marginLeft, y, pageWidth - marginRight, y);
        y += 20;

        pdf.setFont("Times", "normal");
        pdf.setFontSize(12);

        let clausulaIndex = 0;

        const paragraphs = content.split("\n");

        for (let p of paragraphs) {
            const text = p.trim();
            if (!text) {
                y += lineHeight;
                continue;
            }

            // Cláusula
            const isClause = text === text.toUpperCase() && text.length > 4;

            if (isClause) {
                clausulaIndex++;

                if (y > pageHeight - marginBottom - 40) {
                    pdf.addPage();
                    y = marginTop;
                }

                pdf.setFont("Times", "bold");
                pdf.text(`${clausulaIndex}. ${text}`, marginLeft, y);
                pdf.setFont("Times", "normal");

                y += lineHeight + 6;
                continue;
            }

            // Parágrafo normal
            const lines = pdf.splitTextToSize(
                text,
                pageWidth - marginLeft - marginRight
            );

            if (y + lines.length * lineHeight > pageHeight - marginBottom) {
                pdf.addPage();
                y = marginTop;
            }

            pdf.text(lines, marginLeft, y);
            y += lines.length * lineHeight;
        }

        // -----------------------------
        // ⭐ Assinaturas das partes
        // -----------------------------

        if (y + 140 > pageHeight - marginBottom) {
            pdf.addPage();
            y = marginTop;
        }

        y += 40;

        // Parte 1
        pdf.line(marginLeft, y, marginLeft + 180, y);
        pdf.text("Assinatura da Parte 1", marginLeft, y + 14);

        // Parte 2
        pdf.line(pageWidth - marginRight - 180, y, pageWidth - marginRight, y);
        pdf.text(
            "Assinatura da Parte 2",
            pageWidth - marginRight - 180,
            y + 14
        );

        y += 80;

        // -----------------------------
        // ⭐ Testemunhas (opcionais)
        // -----------------------------

        if (witnesses && witnesses.length > 0) {

            if (y + 160 > pageHeight - marginBottom) {
                pdf.addPage();
                y = marginTop;
            }

            y += 40;
            pdf.setFont("Times", "bold");
            pdf.text("Testemunhas", marginLeft, y);
            y += 25;

            pdf.setFont("Times", "normal");

            witnesses.forEach(w => {
                pdf.line(marginLeft, y, marginLeft + 200, y);
                pdf.text(w.name, marginLeft, y + 14);
                pdf.text(w.document, marginLeft, y + 28);
                y += 50;
            });
        }

        pdf.save(`${filename}.pdf`);
    };

    const handleGoToDocuSign = async () => {
        await generatePDF(
            textoEditavel, // ✅ Usar texto editado
            template.title,
            template.title.replace(/\s+/g, '_'),
            template.witnesses
        );
        window.open("https://app.docusign.com/send", "_blank");
    };

    const generateDOC = async (
        content: string,
        title: string,
        filename: string,
        witnesses?: Witness[]
    ) => {

        let clausulaIndex = 0;

        const logoHtml = logo
            ? `<div style="text-align:center; margin-bottom: 20px;">
         <img src="${logo}" width="120" style="height:auto;" />
       </div>`
            : '';

        const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    ${logoHtml}
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
            margin-bottom: 25px;
        }

        .clause-title {
            font-weight: bold;
            font-size: 12pt;
            margin: 20px 0 5px 0;
            text-transform: uppercase;
        }

        p {
            text-indent: 30px;
            margin: 4px 0;
        }

        .signature-wrapper {
            margin-top: 70px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .signature-block {
            width: 60%;
            text-align: center;
            font-size: 12pt;
            line-height: 1.2;
            margin-bottom: 40px;
        }

        hr.signature-line {
            border: none;
            border-top: 1px solid #000;
            margin: 0 auto 5px;
            width: 90%;
            height: 1px;
        }

        .footer {
            font-size: 9pt;
            text-align: left;
            margin-top: 40px;
        }
    </style>
</head>

<body>

    <div class="title">${title}</div>

    ${content
                .split('\n')
                .map(paragraph => {
                    const clean = paragraph.trim();
                    const isClause = clean && clean === clean.toUpperCase();

                    if (isClause) {
                        clausulaIndex++;
                        return `
                    <div class="clause-title">
                        ${clausulaIndex}. ${clean}
                    </div>
                `;
                    }

                    return `<p>${clean}</p>`;
                })
                .join('')}

    <div class="signature-wrapper">

        <!-- Parte 1 -->
        <div class="signature-block">
            <hr class="signature-line" />
            <div>Assinatura da Parte 1</div>
        </div>

        <div style="height: 40px;"></div>

        <!-- Parte 2 -->
        <div class="signature-block">
            <hr class="signature-line" />
            <div>Assinatura da Parte 2</div>
        </div>

        ${witnesses && witnesses.length > 0
                ? `
            <div style="margin-top: 60px; text-align:center;">
                <strong>Testemunhas</strong>
            </div>

            ${witnesses
                    .map(
                        w => `
                <div class="signature-block">
                    <hr class="signature-line" />
                    <div>${w.name}</div>
                    <div>${w.document}</div>
                </div>
                `
                    )
                    .join('')}
        `
                : ''
            }

    </div>

</body>
</html>`;


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


    const handleDownload = async (format: 'pdf' | 'doc' | 'docuSign') => {
        setIsDownloading(true);
        setDownloadType(format);

        try {
            // 1. Atualizar o documento para status "completed" com o texto EDITADO
            const updatedDocument = await updateDocument(userDocument._id, {
                answers: editingAnswers,
                generatedText: textoEditavel, // ✅ Usar o texto editado, não o original
                status: "completed",
                currentStep: userDocument.currentStep,
                totalSteps: userDocument.totalSteps,
                shouldSave: true
            });

            if (updatedDocument) {
                // 2. Gerar e baixar no formato escolhido usando o texto EDITADO
                const textoParaDownload = textoEditavel; // ✅ Usar texto editado

                if (format === 'pdf') {
                    await generatePDF(textoParaDownload, template.title, template.title.replace(/\s+/g, '_'));
                } else if (format == 'doc') {
                    await generateDOC(textoParaDownload, template.title, template.title.replace(/\s+/g, '_'), template.witnesses);
                } else {
                    await handleGoToDocuSign();
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">

                {/* Header Moderno */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-200/50 p-6 mb-6 transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                    {/* MOBILE: Empilhar verticalmente */}
                    <div className="sm:flex sm:items-center sm:justify-between gap-5">
                        {/* MOBILE: Primeira linha - Botão + Título */}
                        <div className="flex items-center justify-between mb-4 sm:mb-0">
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

                            {/* MOBILE: Mostrar título ao lado do botão */}
                            <div className="sm:hidden ml-4 flex-1">
                                <h1 className="text-lg font-bold text-gray-900 truncate">
                                    {template.title}
                                </h1>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    <span className="text-black font-semibold">ABNT</span>
                                </p>
                            </div>
                        </div>

                        {/* DESKTOP: Título no meio */}
                        <div className="hidden sm:block flex-1 text-center">
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                {template.title}
                            </h1>
                            <p className="text-gray-600 mt-1 leading-relaxed">
                                {template.description} —
                                <span className="text-black font-semibold"> Formato ABNT</span>
                            </p>
                        </div>

                        {/* BOTÕES DE DOWNLOAD - Mesmo layout para todas as telas */}
                        <div className="flex items-center gap-3 justify-center sm:justify-end">
                            {/* BOTÃO BAIXAR PDF */}
                            <button
                                onClick={() => handleDownload('pdf')}
                                disabled={isDownloading}
                                className="px-4 py-2 rounded-xl text-white font-medium
                                bg-slate-600 hover:bg-slate-700
                                disabled:opacity-50
                                transition-all active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                {isDownloading && downloadType === 'pdf' ? (
                                    <span className="text-sm">Baixando...</span>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span className="hidden sm:inline">PDF</span>
                                        <span className="sm:hidden">PDF</span>
                                    </>
                                )}
                            </button>

                            {/* BOTÃO BAIXAR DOC */}
                            <button
                                onClick={() => handleDownload('doc')}
                                disabled={isDownloading}
                                className="px-4 py-2 rounded-xl text-white font-medium
                                bg-blue-600 hover:bg-blue-700
                                disabled:opacity-50
                                transition-all active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                {isDownloading && downloadType === 'doc' ? (
                                    <span className="text-sm">Baixando...</span>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span className="hidden sm:inline">DOC</span>
                                        <span className="sm:hidden">DOC</span>
                                    </>
                                )}
                            </button>

                            {plan !== 'free' && (
                                <button
                                    onClick={() => handleDownload('docuSign')}
                                    className="px-4 py-2 rounded-xl text-white font-medium
        bg-amber-500 hover:bg-amber-600
        transition-all active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2"
                                >
                                    <FolderOpen className="w-4 h-4" />
                                    <span className="hidden sm:inline">DocuSign</span>
                                    <span className="sm:hidden">Sign</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* MOBILE: Mostrar descrição completa abaixo */}
                    <div className="mt-4 sm:hidden">
                        <p className="text-sm text-gray-600">
                            {template.description} —
                            <span className="text-black font-semibold"> Formato ABNT</span>
                        </p>
                    </div>
                </div>

                {/* Personalizar Documento */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-200/50 p-6 mb-6 shadow-sm transition-all flex flex-col hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-blue-600" />
                            Personalizar Documento
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Adicione o logotipo da sua empresa ao cabeçalho do documento, em PNG
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {logo ? (
                            <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-gray-200">
                                <img src={logo} alt="Logo Preview" className="h-10 w-auto object-contain rounded-md" />
                                <button
                                    onClick={removeLogo}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    title="Remover logo"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="file"
                                    id="logo-upload"
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={handleLogoUpload}
                                />
                                <label
                                    htmlFor="logo-upload"
                                    className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span className="text-sm font-medium">Upload Logo</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Resto do conteúdo */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 sm:p-10 mb-10 transition-all group relative">

                    {/* Tooltip de ajuda visual */}
                    <div className="absolute top-4 right-4 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/90 px-2 py-1 rounded-md border border-gray-100 pointer-events-none">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Modo edição ativo
                    </div>

                    <div className="max-w-none font-serif text-sm sm:text-[15px] text-gray-900 leading-[1.6] text-justify tracking-tight prose-headings:font-serif prose-headings:text-gray-900 prose-headings:text-base sm:prose-headings:text-[17px]">
                        {textoEditavel ? (
                            <>
                                {/* ÁREA DE TEXTO EDITÁVEL */}
                                <div
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    onInput={handleTextChange} // Atualiza o estado local a cada letra
                                    className="outline-none focus:ring-2 focus:ring-blue-100 focus:bg-blue-50/30 rounded-lg p-2 -m-2 transition-all whitespace-pre-wrap min-h-[200px]"
                                    style={{ textIndent: '0px' }}
                                >
                                    {/* Renderiza o texto inicial. O React não vai atualizar isso a cada tecla para não pular o cursor */}
                                    {documentText}
                                </div>

                                {/* Assinaturas (Mantidas estáticas para preservar layout) */}
                                <div className="mt-10 sm:mt-20 pt-6 sm:pt-10 border-t border-gray-400 grid grid-cols-1 gap-8 sm:gap-16">
                                    {[1, 2].map((p) => (
                                        <div key={p} className="text-center">
                                            <div className="h-16 sm:h-24"></div>
                                            <div className="border-t border-gray-600 w-48 sm:w-64 mx-auto"></div>
                                            <p className="text-xs sm:text-[13px] text-gray-700 mt-2 tracking-wide font-serif">
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
                {/* Dados Preenchidos */}
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-200/40 p-4 sm:p-6 transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-black tracking-tight">
                            Dados Preenchidos
                        </h2>
                    </div>

                    {/* GRID DE CAMPOS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
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
                                    className="rounded-xl p-4 cursor-pointer transition-all border border-gray-200 bg-white/50 hover:bg-white/70 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 capitalize">
                                            {key.replace(/_/g, " ")}
                                        </span>

                                        <span
                                            className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-sm"
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
                                        <div className="text-gray-800 font-semibold text-sm mt-1">
                                            {v}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* RODAPÉ */}
                    <div className="mt-6 pt-4 border-t border-gray-200/70">
                        <p className="text-sm text-gray-700">
                            Todas as alterações são refletidas automaticamente no documento.
                        </p>
                    </div>
                </div>

                {/* Informações do Documento */}
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-4 sm:p-6 mt-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all">

                    <h3 className="text-lg sm:text-xl font-bold text-black mb-6 flex items-center gap-2 tracking-tight">
                        Informações do Documento
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 text-sm">
                        {/* Card */}
                        <div className="rounded-xl p-4 bg-white border border-gray-300 shadow-sm hover:shadow-md transition-all">
                            <span className="text-blue-600 font-medium block opacity-90">Título</span>
                            <p className="mt-1 text-gray-800 font-semibold tracking-tight">
                                {template.title}
                            </p>
                        </div>

                        {/* Card */}
                        <div className="rounded-xl p-4 bg-white border border-gray-300 shadow-sm hover:shadow-md transition-all">
                            <span className="text-blue-600 font-medium block opacity-90">Categoria</span>
                            <p className="mt-1 text-gray-800 font-semibold capitalize tracking-tight">
                                {template.category}
                            </p>
                        </div>

                        {/* Card */}
                        <div className="rounded-xl p-4 bg-white border border-gray-300 shadow-sm hover:shadow-md transition-all">
                            <span className="text-blue-600 font-medium block opacity-90">Gerado em</span>
                            <p className="mt-1 text-gray-800 font-semibold capitalize tracking-tight">
                                {new Date().toLocaleDateString("pt-BR")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}