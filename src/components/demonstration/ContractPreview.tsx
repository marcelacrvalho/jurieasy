"use client";

import jsPDF from "jspdf";
import { ContractData, generateContractText } from "@/lib/contract-template";
import { useState } from "react";

interface ContractDocumentProps {
    contractData: ContractData;
    onBack: () => void;
}

const EditableField = ({
    value,
    field,
    label,
    isEditing,
    onChange,
}: {
    value: string;
    field: keyof ContractData;
    label: string;
    isEditing: boolean;
    onChange: (field: keyof ContractData, value: string) => void;
}) => (
    <div className="mb-3">
        {isEditing ? (
            <div>
                <label className="block text-sm font-medium text-black mb-1">
                    {label}
                </label>
                {field === "service_description" || field === "anything_else" ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(field, e.target.value)}
                        className="w-full px-3 py-2 bg-gray-100 border border-blue-500/30 text-black rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-black-200/50"
                        rows={3}
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(field, e.target.value)}
                        className="w-full px-3 py-2 bg-gray-100 border border-blue-500/30 text-black rounded-full focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-black-200/50"
                    />
                )}
            </div>
        ) : (
            <span className="bg-blue-900/30 px-1 rounded text-black">
                {value || `[${label}]`}
            </span>
        )}
    </div>
);

export default function ContractDocument({
    contractData,
    onBack,
}: ContractDocumentProps) {
    const [editedData, setEditedData] = useState<ContractData>(contractData);
    const [isEditing, setIsEditing] = useState(false);

    const handleFieldChange = (field: keyof ContractData, value: string) => {
        setEditedData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDownload = () => {
        const pdf = new jsPDF();

        let yPosition = 15;
        const lineHeight = 7;
        const margin = 15;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const maxWidth = pageWidth - 2 * margin;

        pdf.setFontSize(14);
        pdf.setFont("Arial", "bold");
        pdf.text("CONTRATO", pageWidth / 2, yPosition, { align: "center" });
        yPosition += 20;

        pdf.setFontSize(11);
        pdf.setFont("Arial", "normal");

        const contractText = generateContractText(editedData);
        const lines = pdf.splitTextToSize(contractText, maxWidth);

        lines.forEach((line: string) => {
            if (yPosition > 270) {
                pdf.addPage();
                yPosition = 15;
            }
            pdf.text(line, margin, yPosition);
            yPosition += lineHeight;
        });

        pdf.setFontSize(8);
        pdf.setFont("Arial", "italic");
        pdf.text(
            `Gerado em ${new Date().toLocaleDateString()}`,
            pageWidth / 2,
            290,
            { align: "center" }
        );

        pdf.save(
            `contrato-${editedData.contractor_name}-${new Date().getTime()}.pdf`
        );
    };

    const contractText = generateContractText(editedData);

    return (
        <div className="min-h-screen bg-gray-900 py-12 text-white">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 border border-blue-800/30 rounded-2xl p-6 backdrop-blur-md shadow-lg">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-blue-300 hover:text-white transition"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Voltar
                        </button>
                        <h3 className="text-3xl font-bold text-white">Seu Contrato</h3>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ${isEditing
                                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                : "bg-blue-600 hover:bg-blue-500 text-white"
                                }`}
                        >
                            {isEditing ? "Salvar Edições" : "Editar Contrato"}
                        </button>

                        <button
                            onClick={handleDownload}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200"
                        >
                            Baixar PDF
                        </button>
                    </div>
                </header>

                {/* Painel de Edição */}
                {isEditing && (
                    <div className="mb-8 bg-white backdrop-blur-md border border-blue-800/30 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-black mb-4">
                            Edição Rápida
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                            <EditableField
                                value={editedData.contractor_name}
                                field="contractor_name"
                                label="Nome do Contratante"
                                isEditing={isEditing}
                                onChange={handleFieldChange}
                            />
                            <EditableField
                                value={editedData.service_provider_name}
                                field="service_provider_name"
                                label="Nome da Contratada"
                                isEditing={isEditing}
                                onChange={handleFieldChange}
                            />
                            <EditableField
                                value={editedData.contractor_document}
                                field="contractor_document"
                                label="CPF/CNPJ"
                                isEditing={isEditing}
                                onChange={handleFieldChange}
                            />
                            <EditableField
                                value={editedData.service_value}
                                field="service_value"
                                label="Valor do Serviço"
                                isEditing={isEditing}
                                onChange={handleFieldChange}
                            />
                            <div className="md:col-span-2">
                                <EditableField
                                    value={editedData.service_description}
                                    field="service_description"
                                    label="Descrição do Serviço"
                                    isEditing={isEditing}
                                    onChange={handleFieldChange}
                                />
                            </div>
                            <EditableField
                                value={editedData.deadline}
                                field="deadline"
                                label="Prazo"
                                isEditing={isEditing}
                                onChange={handleFieldChange}
                            />
                            <EditableField
                                value={editedData.jurisdiction}
                                field="jurisdiction"
                                label="Foro"
                                isEditing={isEditing}
                                onChange={handleFieldChange}
                            />
                            {editedData.anything_else && (
                                <div className="md:col-span-2">
                                    <EditableField
                                        value={editedData.anything_else}
                                        field="anything_else"
                                        label="Observações Adicionais"
                                        isEditing={isEditing}
                                        onChange={handleFieldChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Documento */}
                <div className="bg-white backdrop-blur-md border border-blue-800/30 rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8 border-b border-blue-800/40 pb-6">
                        <h2 className="text-3xl font-bold text-black mb-2">
                            CONTRATO DE PRESTAÇÃO DE SERVIÇOS
                        </h2>
                        <p className="text-black">
                            Documento gerado em {new Date().toLocaleDateString("pt-BR")}
                        </p>
                    </div>

                    <div className="whitespace-pre-line leading-relaxed text-black text-sm sm:text-base font-serif">
                        {contractText.split("\n").map((paragraph, index) => (
                            <p key={index} className="mb-4">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Dica */}
                <div className="mt-6 text-center">
                    <div className="bg-blue-900/30 border border-blue-800/40 rounded-xl p-4 inline-block">
                        <p className="text-blue-200 text-sm">
                            {isEditing
                                ? "💡 Editando: Modifique os campos acima e clique em 'Salvar Edições'."
                                : "💡 Clique em 'Editar Contrato' para personalizar ou 'Baixar PDF' para salvar."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
