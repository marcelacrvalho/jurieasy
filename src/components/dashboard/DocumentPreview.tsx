"use client";

import { useState } from "react";
import { UserDocument } from "@/types/userDocument";
import { Document } from "@/types/document";

interface DocumentPreviewProps {
    userDocument: UserDocument;
    template: Document;
    onBack: () => void;
    onSave: () => void;
}

export default function DocumentPreview({ userDocument, template, onBack, onSave }: DocumentPreviewProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const generateDocumentText = () => {
        let text = template.content || '';

        // Substituir variáveis pelas respostas
        Object.entries(userDocument.answers).forEach(([key, value]) => {
            text = text.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
        });

        return text;
    };

    const handleDownload = async () => {
        setIsDownloading(true);

        try {
            const text = generateDocumentText();
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${template.title}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao baixar documento:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const documentText = generateDocumentText();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{template.title}</h1>
                            <p className="text-gray-600 mt-1">{template.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onBack}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isDownloading ? 'Baixando...' : 'Baixar Documento'}
                            </button>
                            <button
                                onClick={onSave}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Concluir
                            </button>
                        </div>
                    </div>
                </div>

                {/* Document Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                            {documentText}
                        </pre>
                    </div>
                </div>

                {/* Answers Summary */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Respostas Fornecidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(userDocument.answers).map(([key, value]) => (
                            <div key={key} className="border-b border-gray-100 pb-2">
                                <div className="text-sm font-medium text-gray-500 capitalize">
                                    {key.replace(/_/g, ' ')}
                                </div>
                                <div className="text-gray-900">{String(value)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}