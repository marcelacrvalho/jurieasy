"use client";

import jsPDF from 'jspdf';
import { ContractData, generateContractText } from '@/lib/contract-template';
import { useState } from 'react';

interface ContractDocumentProps {
    contractData: ContractData;
    onBack: () => void;
}

export default function ContractDocument({ contractData, onBack }: ContractDocumentProps) {
    const [editedData, setEditedData] = useState<ContractData>(contractData);
    const [isEditing, setIsEditing] = useState(false);

    const handleFieldChange = (field: keyof ContractData, value: string) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDownload = () => {
        const pdf = new jsPDF();

        // Configurações iniciais
        let yPosition = 15;
        const lineHeight = 7;
        const margin = 15;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const maxWidth = pageWidth - (2 * margin);

        // Título
        pdf.setFontSize(14);
        pdf.setFont('Arial', 'bold');
        pdf.text('CONTRATO', pageWidth / 2, yPosition, { align: 'center' });

        yPosition += 20;

        // Corpo do texto
        pdf.setFontSize(11);
        pdf.setFont('Arial', 'normal');

        const contractText = generateContractText(editedData);
        const lines = pdf.splitTextToSize(contractText, maxWidth);

        // Adicionar texto com controle de página
        lines.forEach(line => {
            if (yPosition > 270) { // Verifica se precisa de nova página
                pdf.addPage();
                yPosition = 15;
            }

            pdf.text(line, margin, yPosition);
            yPosition += lineHeight;
        });

        // Rodapé
        pdf.setFontSize(8);
        pdf.setFont('Arial', 'italic');
        pdf.text(
            `Gerado em ${new Date().toLocaleDateString()}`,
            pageWidth / 2,
            290,
            { align: 'center' }
        );

        pdf.save(`contrato-${editedData.contractor_name}-${new Date().getTime()}.pdf`);
    };
    const EditableField = ({ value, field, label }: { value: string, field: keyof ContractData, label: string }) => (
        <div className="mb-2">
            {isEditing ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                    {field === 'service_description' || field === 'anything_else' ? (
                        <textarea
                            value={value}
                            onChange={(e) => handleFieldChange(field, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                        />
                    ) : (
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleFieldChange(field, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    )}
                </div>
            ) : (
                <span className="bg-yellow-100 px-1 rounded">{value || `[${label}]`}</span>
            )}
        </div>
    );

    const contractText = generateContractText(editedData);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-6 bg-white rounded-lg shadow-sm border">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Voltar
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Seu Contrato Pronto</h1>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isEditing
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {isEditing ? '✅ Salvar Edições' : '✏️ Editar Contrato'}
                        </button>

                        <button
                            onClick={handleDownload}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                            📄 Baixar PDF
                        </button>
                    </div>
                </header>

                {/* Painel de Edição Rápida */}
                {isEditing && (
                    <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edição Rápida</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditableField
                                value={editedData.contractor_name}
                                field="contractor_name"
                                label="Nome do Contratante"
                            />
                            <EditableField
                                value={editedData.service_provider_name}
                                field="service_provider_name"
                                label="Nome da Contratada"
                            />
                            <EditableField
                                value={editedData.contractor_document}
                                field="contractor_document"
                                label="CPF/CNPJ"
                            />
                            <EditableField
                                value={editedData.service_value}
                                field="service_value"
                                label="Valor do Serviço"
                            />
                            <div className="md:col-span-2">
                                <EditableField
                                    value={editedData.service_description}
                                    field="service_description"
                                    label="Descrição do Serviço"
                                />
                            </div>
                            <EditableField
                                value={editedData.deadline}
                                field="deadline"
                                label="Prazo"
                            />
                            <EditableField
                                value={editedData.jurisdiction}
                                field="jurisdiction"
                                label="Foro"
                            />
                            {editedData.anything_else && (
                                <div className="md:col-span-2">
                                    <EditableField
                                        value={editedData.anything_else}
                                        field="anything_else"
                                        label="Observações Adicionais"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Documento do Contrato */}
                <div className="bg-white rounded-lg shadow-lg border p-8">
                    <div className="prose prose-lg max-w-none">
                        <div className="text-center mb-8 border-b pb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h2>
                            <p className="text-gray-600">Documento gerado em {new Date().toLocaleDateString('pt-BR')}</p>
                        </div>

                        <div className="whitespace-pre-line leading-relaxed text-gray-800 text-sm sm:text-base font-serif">
                            {contractText.split('\n').map((paragraph, index) => (
                                <p key={index} className="mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Instruções */}
                <div className="mt-6 text-center">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                        <p className="text-blue-800 text-sm">
                            {isEditing
                                ? "💡 Editando: Modifique os campos acima e clique em 'Salvar Edições'"
                                : "💡 Clique em 'Editar Contrato' para personalizar ou 'Baixar PDF' para salvar"
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}