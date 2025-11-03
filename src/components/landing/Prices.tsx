"use client";
import { motion } from "framer-motion";

export default function Prices() {
    const plans = [
        {
            name: "Individual",
            price: "Grátis",
            description: "Para avaliação da plataforma",
            features: ["1 documento/mês", "Suporte por e-mail"],
            button: "Começar agora",
            popular: false,
        },
        {
            name: "Profissional",
            price: "R$ 97",
            description: "Para uso regular",
            features: [
                "15 documentos/mês",
                "Sua logo personalizada",
                "Suporte prioritário",
            ],
            button: "Assinar plano",
            popular: true,
        },
        {
            name: "Escritório",
            price: "R$ 197",
            description: "Para equipes jurídicas",
            features: [
                "Documentos ilimitados",
                "Logo personalizada",
                "Múltiplos usuários",
                "Integração com DocuSign e GOV BR",
                "Documentos salvos na nuvem",
                "Suporte dedicado",
            ],
            button: "Assinar plano",
            popular: false,
        },
    ];

    return (
        <section className="relative py-24 bg-white overflow-hidden">
            {/* Glow de fundo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_70%)]" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
                {/* Título e subtítulo */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Planos transparentes
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Soluções sob medida para o seu volume de contratos jurídicos
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                            viewport={{ once: true }}
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
                                </div>
                                <p className="text-gray-500 text-sm">{plan.description}</p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-10 flex-grow">
                                {plan.features.map((feature, featureIndex) => (
                                    <li
                                        key={featureIndex}
                                        className="flex items-center gap-3 text-gray-700"
                                    >
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Botão */}
                            <button
                                className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${plan.popular
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {plan.button}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Nota de rodapé */}
                <div className="text-center mt-14">
                    <p className="text-gray-500 text-sm">
                        * Todos os planos incluem atualizações automáticas, compliance LGPD e
                        segurança SSL 256-bit.
                    </p>
                </div>
            </div>
        </section>
    );
}
