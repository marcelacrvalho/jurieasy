"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface TemplatePreviewDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    templateText: string;
    documentTitle: string;
}

export default function TemplatePreviewDrawer({
    isOpen,
    onClose,
    templateText,
    documentTitle
}: TemplatePreviewDrawerProps) {

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000]"
                    />

                    {/* Drawer com cantos arredondados */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-2xl z-[10001] flex flex-col"
                    >
                        {/* Container principal com bordas arredondadas */}
                        <div className="flex flex-col h-full bg-white shadow-2xl rounded-tl-2xl rounded-bl-2xl overflow-hidden">

                            {/* Header com borda arredondada no topo */}
                            <div className="flex-shrink-0 border-b border-slate-200 p-6 rounded-tl-2xl bg-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">
                                            Template: {documentTitle}
                                        </h2>
                                        <p className="text-slate-500 text-sm mt-1">
                                            Visualize o template do contrato
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Conteúdo do Template */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                                    <pre className="whitespace-pre-wrap font-mono text-slate-700 text-sm leading-relaxed">
                                        {templateText}
                                    </pre>
                                </div>

                                {/* Informações */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h3 className="font-medium text-blue-900 mb-2">
                                        Sobre este template
                                    </h3>
                                    <ul className="text-blue-700 text-sm space-y-1">
                                        <li>• Este é o template base que será utilizado para gerar seu contrato</li>
                                        <li>• As variáveis entre {`{{ }}`} serão substituídas pelos dados informados</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Footer com borda arredondada na base */}
                            <div className="flex-shrink-0 border-t border-slate-200 p-6 rounded-bl-2xl bg-white">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-slate-500">
                                        Use os campos do formulário para preencher as variáveis do template
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}