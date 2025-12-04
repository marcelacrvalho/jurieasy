// components/LogoUploadSimple.tsx
"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";

interface LogoUploadSimpleProps {
    position: 'left' | 'right';
    onLogoChange: (logoBase64: string | null, position: 'left' | 'right') => void;
}

export default function LogoUploadSimple({ position, onLogoChange }: LogoUploadSimpleProps) {
    const [logo, setLogo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validações
        if (file.size > 2 * 1024 * 1024) {
            setError("A imagem deve ter no máximo 2MB");
            return;
        }

        if (!file.type.startsWith('image/')) {
            setError("Por favor, selecione uma imagem válida");
            return;
        }

        setError(null);

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setLogo(base64);
            onLogoChange(base64, position);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveLogo = () => {
        setLogo(null);
        onLogoChange(null, position);
    };

    const positionLabel = position === 'left' ? 'Esquerda' : 'Direita';

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                    Logo {positionLabel}
                </span>
                {logo && (
                    <button
                        onClick={handleRemoveLogo}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {!logo ? (
                <label className={`block w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors hover:border-blue-400 ${position === 'left' ? 'border-blue-200 bg-blue-50/50' : 'border-green-200 bg-green-50/50'
                    }`}>
                    <div className="flex flex-col items-center justify-center h-full p-4">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 text-center">
                            Clique para adicionar logo
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG (máx. 2MB)
                        </p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            ) : (
                <div className="relative">
                    <div className="w-full h-32 border-2 border-dashed rounded-xl overflow-hidden bg-white">
                        <img
                            src={logo}
                            alt={`Logo ${positionLabel}`}
                            className="w-full h-full object-contain p-2"
                        />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {positionLabel}
                    </div>
                </div>
            )}

            {error && (
                <p className="text-red-600 text-xs">{error}</p>
            )}
        </div>
    );
}