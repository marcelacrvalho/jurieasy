"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUserContext } from '@/contexts/UserContext';
import LoadingAnimation from "@/components/shared/LoadingAnimation";

export default function PaymentPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const { upgradePlan, error: apiError, clearError } = useUserContext();

    useEffect(() => {
        const plan = localStorage.getItem("selectedPlan");
        if (plan) {
            setSelectedPlan(plan);
        }
    }, []);

    const clearSelectedPlan = () => {
        localStorage.removeItem("selectedPlan");
        setSelectedPlan(null);
    };

    const redirectToDashboard = () => {
        clearSelectedPlan();
        window.location.href = "/dashboard";
    };

    // TODO:processar pagamento com stripe
    const handlePayment = async () => {
        if (!selectedPlan) {
            alert("Nenhum plano selecionado");
            return;
        }

        setIsProcessing(true);
        clearError();

        try {
            console.log("🔄 Iniciando processamento do pagamento...");
            console.log("📋 Plano selecionado:", selectedPlan);
            const token = localStorage.getItem('token');
            console.log('🔐 Token no PaymentPage:', token);

            // SIMULA PAGAMENTO BEM-SUCEDIDO
            await new Promise(resolve => setTimeout(resolve, 2000));

            const success = await upgradePlan(selectedPlan as 'free' | 'pro' | 'escritorio');

            console.log("📊 Resultado do upgradePlan:", success);

            if (success) {
                clearSelectedPlan();
                window.location.href = "/dashboard";
            } else {
                console.log("Erro ao atualizar plano:", apiError);
                alert("Erro ao atualizar plano. Envie um e-mail para suporte@jurieasy.com ");
            }

        } catch (error) {
            alert("Erro ao processar pagamento. Envie um e-mail para suporte@jurieasy.com");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            {isProcessing && <LoadingAnimation />}

            <div className="inset-0 z-0 bg-blue-300">
                <Image
                    src="/bg-question-1.svg"
                    alt="Background em formato wireframe"
                    fill
                    className="object-cover object-center mix-blend-multiply opacity-5"
                    priority
                />
            </div>

            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 relative"
                >
                    {/* Voltar */}
                    <Link
                        href="/auth"
                        className="absolute top-5 left-5 text-gray-500 hover:text-blue-600 transition"
                        onClick={clearSelectedPlan}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="mx-auto mb-4 bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center"
                        >
                            <CreditCard className="w-7 h-7 text-blue-700" />
                        </motion.div>

                        <h1 className="text-2xl font-semibold text-gray-800">Pagamento</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Complete seu pagamento para ativar o plano
                        </p>
                    </div>

                    {/* Plano */}
                    {selectedPlan && (
                        <div className="border border-blue-100 bg-blue-50 rounded-xl p-4 mb-6 text-center">
                            <p className="text-gray-700 text-sm">Plano selecionado</p>
                            <p className="text-blue-700 font-semibold text-lg capitalize">{selectedPlan == 'pro' ? 'Profissional' : 'Escritório'}</p>
                        </div>
                    )}

                    {/* Campos de pagamento */}
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome no cartão
                            </label>
                            <input
                                type="text"
                                placeholder="Como aparece no cartão"
                                className="w-full text-gray-800 border border-gray-300 rounded-full px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                disabled={isProcessing}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Número do cartão
                            </label>
                            <input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                maxLength={19}
                                className="w-full text-gray-800 border border-gray-300 rounded-full px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                disabled={isProcessing}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Validade
                                </label>
                                <input
                                    type="text"
                                    placeholder="MM/AA"
                                    maxLength={5}
                                    className="w-full text-gray-800 border border-gray-300 rounded-full px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                    disabled={isProcessing}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CVC
                                </label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    maxLength={4}
                                    className="w-full text-gray-800 border border-gray-300 rounded-full px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                    disabled={isProcessing}
                                />
                            </div>
                        </div>

                        {/* Botão principal */}
                        <motion.button
                            whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                            whileTap={{ scale: isProcessing ? 1 : 0.97 }}
                            transition={{ duration: 0.1 }}
                            onClick={handlePayment}
                            disabled={isProcessing || !selectedPlan}
                            className="w-full bg-blue-700 text-white py-3 rounded-full font-medium shadow-sm hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed transition relative"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="text-center">
                                        <LoadingAnimation />

                                        <p>Processando pagamento...</p>
                                    </div>
                                </>
                            ) : (
                                'Confirmar pagamento'
                            )}
                        </motion.button>

                        <button
                            type="button"
                            onClick={redirectToDashboard}
                            disabled={isProcessing}
                            className="w-full border border-gray-300 text-gray-600 py-3 rounded-full font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Pagar depois
                        </button>
                    </form>

                    {/* Segurança */}
                    <p className="text-xs text-gray-400 text-center mt-6">
                        Pagamento 100% seguro com criptografia SSL 256-bit
                    </p>
                </motion.div>
            </div>
        </>
    );
}