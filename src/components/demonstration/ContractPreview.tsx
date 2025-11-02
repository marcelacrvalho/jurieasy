"use client";

import { ContractData } from '@/lib/contract-template';
import { useState } from 'react';

interface ContractPreviewProps {
    contractData: ContractData;
    onBack: () => void;
    onGeneratePDF: () => void;
}

export default function ContractPreview({ contractData, onBack, onGeneratePDF }: ContractPreviewProps) {
    const [editedData, setEditedData] = useState<ContractData>(contractData);

    const handleFieldChange = (field: keyof ContractData, value: string) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const highlightText = (text: string, field: keyof ContractData) => (
        <span
            className="bg-yellow-200 px-1 rounded cursor-pointer hover:bg-yellow-300 transition-colors"
            onClick={() => {
                const newValue = prompt(`Editar ${field}:`, editedData[field] || '');
                if (newValue !== null) {
                    handleFieldChange(field, newValue);
                }
            }}
            title="Clique para editar"
        >
            {text || `[${field.toUpperCase()}]`}
        </span>
    );

    const contractText = `
DAS PARTES

CONTRATADA: ${highlightText(editedData.service_provider_name, 'service_provider_name')}, pessoa jurídica de direito privado, inscrita no CNPJ n° [CNPJ DA CONTRATADA], com sede em [ENDEREÇO DA CONTRATADA], doravante denominado CONTRATADA.

CONTRATANTE: ${highlightText(editedData.contractor_name, 'contractor_name')}, ${editedData.contractor_type === 'physical' ? 'pessoa física' : 'pessoa jurídica'} de direito privado, inscrita no ${editedData.contractor_type === 'physical' ? 'CPF' : 'CNPJ'} n° ${highlightText(editedData.contractor_document, 'contractor_document')}, com sede em [ENDEREÇO DO CONTRATANTE], doravante denominado CONTRATANTE.

CLÁUSULA PRIMEIRA - DO OBJETO

1.1 O presente contrato tem por objeto a prestação de serviços profissionais especializados em ${highlightText(editedData.service_description, 'service_description')} por parte da CONTRATADA.

CLÁUSULA QUARTA - DOS SERVIÇOS

4.1 A CONTRATADA prestará os serviços contratados para fins de ${highlightText(editedData.service_description, 'service_description')}.

4.2 Os serviços terão início em [NÚMERO] dias corridos da assinatura do presente contrato, com prazo para término de ${highlightText(editedData.deadline, 'deadline')}.

CLÁUSULA QUINTA - DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO

5.1 Pelo objeto deste contrato, a CONTRATANTE pagará à CONTRATADA o valor total de ${highlightText(editedData.service_value, 'service_value')}.

CLÁUSULA DÉCIMA PRIMEIRA - DO FORO

11.1 Para dirimir quaisquer controvérsias oriundas do presente contrato, as partes elegem o foro da Comarca de ${highlightText(editedData.jurisdiction, 'jurisdiction')}.

${editedData.anything_else ? `
CLÁUSULA DÉCIMA SEGUNDA - DISPOSIÇÕES ADICIONAIS

12.1 ${highlightText(editedData.anything_else, 'anything_else')}
` : ''}
  `.trim();

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar
                    </button>
                    <h1 className="text-2xl font-bold">Prévia do Contrato</h1>
                    <button
                        onClick={onGeneratePDF}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                        📄 Gerar PDF
                    </button>
                </header>

                {/* Contrato */}
                <div className="bg-white text-gray-900 rounded-lg p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
                    <div className="prose prose-lg max-w-none">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h2>
                            <p className="text-gray-600">Contrato gerado em {new Date().toLocaleDateString('pt-BR')}</p>
                        </div>

                        <div className="whitespace-pre-line leading-relaxed text-sm sm:text-base">
                            {contractText.split('\n').map((paragraph, index) => (
                                <p key={index} className="mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Assinaturas */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="text-center">
                                <div className="border-t border-gray-300 mt-16 pt-4">
                                    <p>___________________________________</p>
                                    <p className="font-semibold">CONTRATADA</p>
                                    <p className="text-sm text-gray-600">{editedData.service_provider_name}</p>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="border-t border-gray-300 mt-16 pt-4">
                                    <p>___________________________________</p>
                                    <p className="font-semibold">CONTRATANTE</p>
                                    <p className="text-sm text-gray-600">{editedData.contractor_name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instruções */}
                <div className="mt-4 text-center">
                    <p className="text-gray-400 text-sm">
                        💡 <strong>Dica:</strong> Clique nos textos destacados em amarelo para editá-los antes de gerar o PDF.
                    </p>
                </div>
            </div>
        </div>
    );
}