"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Benefits() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
    };

    const features = [
        {
            icon: "/landing-rocket.svg",
            title: "Velocidade impressionante",
            description:
                "De horas para minutos. Gere contratos profissionais em menos de 2 minutos",
        },
        {
            icon: "/landing-lock.svg",
            title: "Segurança jurídica",
            description:
                "Criptografia avançada e total conformidade com a LGPD",
        },
        {
            icon: "/landing-layers.svg",
            title: "Precisão técnica",
            description:
                "Modelos revisados por especialistas jurídicos de diversas áreas",
        },
        {
            icon: "/landing-sync.svg",
            title: "Atualizações automáticas",
            description:
                "Sempre em dia com as últimas mudanças legais e regulatórias",
        },
    ];

    return (
        <section className="relative overflow-hidden bg-white py-24 sm:py-32">
            {/* Brilho suave de fundo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_60%)]" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
                {/* Título */}
                <motion.div
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    variants={fadeInUp}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        Por que milhares de profissionais{" "}
                        <span className="text-blue-600">confiam na Jurieasy?</span>
                    </h2>
                    <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">
                        Nossa tecnologia transforma a criação de contratos em uma
                        experiência rápida, segura e confiável.
                    </p>
                </motion.div>

                {/* Grid de benefícios */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                            className="group bg-white border border-gray-200 hover:border-blue-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center text-center"
                        >
                            {/* Ícone */}
                            <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="mb-6"
                            >
                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        width={36}
                                        height={36}
                                        className="opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            </motion.div>

                            {/* Título e descrição */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
