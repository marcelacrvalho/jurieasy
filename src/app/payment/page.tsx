'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserContext } from '@/contexts/UserContext';
import { plans } from '@/data/pricesAndPlans';

export default function PaymentPage() {
    const router = useRouter();
    const { upgradePlan, user, isLoading } = useUserContext();
    const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'escritorio' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filtra apenas planos pagos (remove o free)
    const paidPlans = plans.filter(plan => plan.label !== 'free');

    // Se usuário já tem plano pago, redireciona
    useEffect(() => {
        if (user?.plan && user.plan !== 'free') {
            router.push('/dashboard');
        }
    }, [user, router]);

    // Função que processa o plano selecionado imediatamente
    const handlePlanSelection = async (plan: 'free' | 'pro' | 'escritorio') => {
        setSelectedPlan(plan);

        // Se for plano FREE, redireciona direto para dashboard
        if (plan === 'free') {
            try {
                const result = await upgradePlan('free');
                if (result.success) {
                    router.push('/dashboard');
                } else {
                    setError(result.message || 'Erro ao selecionar plano FREE');
                }
            } catch (err) {
                console.error('Erro:', err);
                setError('Erro ao processar');
            }
            return;
        }

        // Se for plano PAGO, processa pagamento imediatamente
        setIsProcessing(true);
        setError(null);

        try {
            const result = await upgradePlan(plan);

            if (!result.success) {
                setError(result.message || 'Erro ao processar pagamento');
                setIsProcessing(false);
                return;
            }

            // Se for plano PAGO, redireciona para Stripe
            if (result.data?.paymentUrl) {
                // Abre o Stripe em nova janela
                const stripeWindow = window.open(
                    result.data.paymentUrl,
                    '_blank',
                    'noopener,noreferrer'
                );

                if (!stripeWindow) {
                    alert('Permita popups para abrir a página de pagamento');
                    setIsProcessing(false);
                    return;
                }

                // Mostra mensagem informativa
                alert(`✅ Redirecionado para pagamento!\n\nPlano: ${plan.toUpperCase()}\nValor: ${result.data.price}\n\nApós concluir o pagamento, seu plano será ativado automaticamente em até 2 minutos.`);

                // Redireciona para dashboard após alguns segundos
                setTimeout(() => {
                    router.push('/dashboard');
                }, 3000);
            }

        } catch (err) {
            console.error('Erro:', err);
            setError('Erro inesperado. Tente novamente.');
            setIsProcessing(false);
        }
    };

    const handleBackToFree = async () => {
        try {
            const result = await upgradePlan('free');
            if (result.success) {
                router.push('/dashboard');
            } else {
                setError(result.message || 'Erro ao voltar para plano FREE');
            }
        } catch (err) {
            console.error('Erro:', err);
            setError('Erro ao processar');
        }
    };

    return (
        <section className="relative py-24 bg-white overflow-hidden min-h-screen">
            {/* Glow de fundo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_70%)]" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
                {/* Cabeçalho */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Você está a um clique de melhorar a sua vida jurídica
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Escolha o plano ideal para sua produtividade e necessidade
                    </p>
                </motion.div>

                {/* Erro */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 max-w-md mx-auto"
                    >
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-red-700 text-center">❌ {error}</p>
                        </div>
                    </motion.div>
                )}

                {/* Cards de Todos os Planos (3 cards lado a lado) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Card do Plano FREE */}
                    {user?.plan === 'free' && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                            className="relative flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 p-8"
                        >
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Seu Plano Atual
                                </h3>
                                <div className="text-4xl font-bold text-gray-900 mb-1">
                                    FREE
                                </div>
                                <p className="text-gray-500 text-sm">Para conhecer a plataforma</p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-10 flex-grow">
                                {plans.find(p => p.label === 'free')?.features.map((feature, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-3 text-gray-700"
                                    >
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                                        <span className="text-sm leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Botão de Seleção */}
                            <div className="mt-auto">
                                <button
                                    onClick={() => handlePlanSelection('free')}
                                    disabled={isProcessing}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${selectedPlan === 'free'
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isProcessing && selectedPlan === 'free' ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processando...
                                        </span>
                                    ) : selectedPlan === 'free' ? '✓ Selecionado' : 'Selecionar este plano'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Cards dos Planos Pagos */}
                    {paidPlans.map((plan, index) => (
                        <motion.div
                            key={plan.label}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (index + 1) * 0.15, duration: 0.6 }}
                            className={`relative flex flex-col bg-white rounded-2xl border transition-all duration-300 ${plan.popular
                                ? "border-blue-500 shadow-2xl scale-105"
                                : "border-gray-200 hover:border-blue-200 hover:shadow-lg"
                                } p-8`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        MAIS POPULAR
                                    </span>
                                </div>
                            )}

                            {/* Header */}
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {plan.name}
                                </h3>
                                <div className="text-4xl font-bold text-gray-900 mb-1">
                                    {plan.price}
                                    <span className="text-lg text-gray-500">/mês</span>
                                </div>
                                <p className="text-gray-500 text-sm">{plan.description}</p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-10 flex-grow">
                                {plan.features.map((feature, featureIndex) => (
                                    <li
                                        key={featureIndex}
                                        className="flex items-start gap-3 text-gray-700"
                                    >
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                                        <span className="text-sm leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Botão de Seleção */}
                            <div className="mt-auto">
                                <button
                                    onClick={() => handlePlanSelection(plan.label as 'pro' | 'escritorio')}
                                    disabled={isProcessing}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${selectedPlan === plan.label
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isProcessing && selectedPlan === plan.label ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processando...
                                        </span>
                                    ) : selectedPlan === plan.label ? '✓ Selecionado' : 'Selecionar este plano'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Botão para Continuar de Forma Gratuita */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 max-w-md mx-auto"
                >
                    <button
                        onClick={handleBackToFree}
                        className="w-full py-4 px-6 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                    >
                        Continuar usando de forma gratuita
                    </button>
                    <p className="text-gray-500 text-sm text-center mt-3">
                        Você pode experimentar todas as funcionalidades básicas gratuitamente
                    </p>
                </motion.div>

                {/* Seção de Instruções (apenas quando um plano pago está sendo processado) */}
                {isProcessing && selectedPlan && selectedPlan !== 'free' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12 max-w-2xl mx-auto"
                    >
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Processando seu pagamento...
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {/* Instruções de Pagamento */}
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                                    <h4 className="font-semibold text-blue-800 mb-3 text-lg">
                                        💡 Aguarde enquanto abrimos a página de pagamento
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-100 text-blue-700 rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0">
                                                1
                                            </div>
                                            <div>
                                                <p className="font-medium text-blue-800">Página segura do Stripe</p>
                                                <p className="text-blue-700 text-sm mt-1">Em instantes você será redirecionado para uma página 100% segura de pagamento.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-100 text-blue-700 rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0">
                                                2
                                            </div>
                                            <div>
                                                <p className="font-medium text-blue-800">Múltiplas formas de pagamento</p>
                                                <p className="text-blue-700 text-sm mt-1">Cartão de crédito, débito ou PIX. Use cartão teste: <code className="bg-blue-100 px-2 py-1 rounded text-xs">4242 4242 4242 4242</code></p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-100 text-blue-700 rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0">
                                                3
                                            </div>
                                            <div>
                                                <p className="font-medium text-blue-800">Ativação automática</p>
                                                <p className="text-blue-700 text-sm mt-1">Após a confirmação do pagamento, seu plano será ativado automaticamente em até 2 minutos.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Garantia */}
                                <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-green-800">Garantia de 7 dias</h4>
                                            <p className="text-green-700 text-sm">Se não gostar, devolvemos seu dinheiro sem burocracia.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Botão para cancelar */}
                                <div className="text-center">
                                    <button
                                        onClick={() => {
                                            setIsProcessing(false);
                                            setSelectedPlan(null);
                                        }}
                                        className="py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar e escolher outro plano
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}