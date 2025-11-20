// utils/pdf-generator.ts
import jsPDF from 'jspdf';

export async function generatePDF(content: string, title: string, filename: string) {
    const pdf = new jsPDF();

    // Configurações do PDF
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, 20, 20);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    // Quebra o texto em linhas
    const lines = pdf.splitTextToSize(content, 170);

    // Adiciona o conteúdo
    pdf.text(lines, 20, 40);

    // Adiciona data e rodapé
    const date = new Date().toLocaleDateString('pt-BR');
    pdf.setFontSize(10);
    pdf.text(`Gerado em: ${date} - Jurieasy`, 20, pdf.internal.pageSize.height - 10);

    // Salva o PDF
    pdf.save(`${filename}.pdf`);
}