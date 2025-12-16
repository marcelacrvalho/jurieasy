"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HowItWorks() {
    const steps = [
        {
            title: "Responda perguntas simples",
            description: "Nosso assistente entende suas necessidades de forma rápida e intuitiva",
            icon: "/landing-message.svg",
        },
        {
            title: "Revise o contrato gerado",
            description: "Visualize e edite seu contrato personalizado em tempo real, com total controle",
            icon: "/landing-document.svg",
        },
        {
            title: "Assine e utilize",
            description: "Baixe o PDF profissional ou compartilhe para assinatura digital segura",
            icon: "/landing-check.svg",
        },
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* brilho decorativo */}
            <div className="inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_70%)]" />

            <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
                {/* Cabeçalho */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Como a <span className="text-blue-600">Jurieasy</span> transforma seu trabalho
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                        Do documento complicado ao contrato perfeito em 3 passos simples
                    </p>
                </motion.div>

                {/* Container principal com flex para espaçamento igual */}
                <div className="flex flex-col">
                    {/* Etapas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
                        {steps.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="text-center bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                            >
                                {/* Ícone animado */}
                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
                                >
                                    <Image
                                        src={item.icon}
                                        alt={item.title}
                                        width={34}
                                        height={34}
                                        className="group-hover:scale-110 transition-transform"
                                    />
                                </motion.div>

                                {/* Título e descrição */}
                                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-base leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Espaço flexível + Botão */}
                    {/* Espaço flexível + Botão com margem */}
                    <div className="mt-16 md:mt-24 flex items-center justify-center"> {/* Margem grande */}
                        <button
                            onClick={() => (window.location.href = "/auth")}
                            className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                        >
                            Gerar meu primeiro contrato agora
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}