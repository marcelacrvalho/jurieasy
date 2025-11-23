// utils/pdf-generator.ts
import jsPDF from 'jspdf';

export async function generatePDF(content: string, title: string, filename: string) {
    const pdf = new jsPDF();

    // ✅ CONFIGURAÇÕES ABNT
    const marginLeft = 30;    // ≈3cm (ABNT: 3cm esquerda)
    const marginRight = 20;   // ≈2cm (ABNT: 2cm direita) 
    const marginTop = 40;     // ≈3cm (ABNT: 3cm superior)
    const marginBottom = 20;  // ≈2cm (ABNT: 2cm inferior)
    const lineHeight = 6;
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    let yPosition = marginTop;

    // ✅ FONTE RECOMENDADA ABNT (Times ou Arial)
    pdf.setFont("times");

    // ✅ TÍTULO (CAIXA ALTA, CENTRALIZADO, NEGRITO)
    pdf.setFontSize(14);
    pdf.setFont("times", "bold");
    const titleFormatted = title.toUpperCase();
    const titleWidth = pdf.getTextWidth(titleFormatted);
    const titleX = (pageWidth - titleWidth) / 2;
    pdf.text(titleFormatted, titleX, yPosition);
    yPosition += 20;

    // ✅ LINHA SEPARADORA APÓS TÍTULO
    pdf.setDrawColor(0, 0, 0);
    pdf.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
    yPosition += 15;

    // ✅ CORPO DO TEXTO (JUSTIFICADO)
    pdf.setFontSize(12);
    pdf.setFont("times", "normal");

    // Processar conteúdo mantendo estrutura
    const paragraphs = content.split('\n');

    for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i].trim();

        // Pular linhas vazias
        if (!paragraph) {
            yPosition += lineHeight;
            continue;
        }

        // ✅ TRATAMENTO PARA TÍTULOS INTERNOS (todo em maiúsculo)
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

        // ✅ TEXTO NORMAL (JUSTIFICADO)
        const textLines = pdf.splitTextToSize(paragraph, pageWidth - marginLeft - marginRight);

        // Verificar quebra de página
        if (yPosition + (textLines.length * lineHeight) > pageHeight - marginBottom) {
            pdf.addPage();
            yPosition = marginTop;
        }

        // ✅ TEXTO JUSTIFICADO (simulado)
        pdf.text(textLines, marginLeft, yPosition);
        yPosition += (textLines.length * lineHeight) + 2;
    }

    // ✅ SEÇÃO DE ASSINATURAS (OBRIGATÓRIO EM CONTRATOS)
    yPosition += 20;
    if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = marginTop;
    }

    // Linhas para assinaturas
    const signatureY = pageHeight - 50;
    pdf.line(marginLeft, signatureY, marginLeft + 70, signatureY);
    pdf.line(pageWidth - marginRight - 70, signatureY, pageWidth - marginRight, signatureY);

    // Nomes das partes
    pdf.setFontSize(10);
    pdf.text("Assinatura da Parte 1", marginLeft, signatureY + 8);
    pdf.text("Assinatura da Parte 2", pageWidth - marginRight - 70, signatureY + 8);

    // ✅ RODAPÉ ABNT
    const date = new Date().toLocaleDateString('pt-BR');
    pdf.setFontSize(9);
    pdf.text(`Documento gerado em ${date} - Jurieasy`, marginLeft, pageHeight - 10);

    // ✅ SALVAR
    pdf.save(`${filename}.pdf`);
}

// ✅ VERSÃO ALTERNATIVA PARA DOCUMENTOS MAIS COMPLEXOS
export async function generateABNTDocument(
    content: string,
    title: string,
    filename: string,
    parties?: { name: string; id: string }[] // Partes envolvidas
) {
    const pdf = new jsPDF();

    // Configurações ABNT
    const marginLeft = 30;
    const marginRight = 20;
    const marginTop = 40;
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    let yPosition = marginTop;

    // Fonte Times (recomendada)
    pdf.setFont("times");

    // ✅ CABEÇALHO COM IDENTIFICAÇÃO DAS PARTES
    if (parties && parties.length > 0) {
        pdf.setFontSize(10);
        pdf.setFont("times", "normal");
        parties.forEach((party, index) => {
            pdf.text(`${party.name} - ${party.id}`, marginLeft, yPosition);
            yPosition += 5;
        });
        yPosition += 10;
    }

    // ✅ TÍTULO PRINCIPAL
    pdf.setFontSize(14);
    pdf.setFont("times", "bold");
    const titleFormatted = title.toUpperCase();
    const titleWidth = pdf.getTextWidth(titleFormatted);
    const titleX = (pageWidth - titleWidth) / 2;
    pdf.text(titleFormatted, titleX, yPosition);
    yPosition += 20;

    // ✅ LINHA SEPARADORA
    pdf.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
    yPosition += 15;

    // ✅ CORPO DO DOCUMENTO
    pdf.setFontSize(12);
    pdf.setFont("times", "normal");

    const paragraphs = content.split('\n');

    for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i].trim();

        if (!paragraph) {
            yPosition += 4;
            continue;
        }

        // Identificação de cláusulas/numerados
        if (paragraph.match(/^(CLÁUSULA|Artigo|§|Art\.)/i)) {
            pdf.setFont("times", "bold");
        }

        const textLines = pdf.splitTextToSize(paragraph, pageWidth - marginLeft - marginRight);

        if (yPosition + (textLines.length * 6) > pageHeight - 30) {
            pdf.addPage();
            yPosition = marginTop;
        }

        pdf.text(textLines, marginLeft, yPosition);
        yPosition += (textLines.length * 6) + 2;
        pdf.setFont("times", "normal");
    }

    // ✅ ASSINATURAS DETALHADAS
    yPosition += 20;
    if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = marginTop;
    }

    const signatureBaseY = pageHeight - 60;

    if (parties) {
        parties.forEach((party, index) => {
            const xPos = index === 0 ? marginLeft : pageWidth - marginRight - 70;
            pdf.line(xPos, signatureBaseY, xPos + 70, signatureBaseY);
            pdf.setFontSize(9);
            pdf.text(party.name, xPos, signatureBaseY + 6);
            pdf.setFontSize(8);
            pdf.text(party.id, xPos, signatureBaseY + 12);
        });
    }

    // ✅ RODAPÉ
    const date = new Date().toLocaleDateString('pt-BR');
    pdf.setFontSize(8);
    pdf.text(`Gerado em ${date} via Jurieasy - Documento ABNT`, marginLeft, pageHeight - 10);

    pdf.save(`${filename}.pdf`);
}