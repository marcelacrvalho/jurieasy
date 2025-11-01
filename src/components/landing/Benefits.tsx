"use client";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";

export default function Benefits() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    variants={fadeInUp}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-16">
                        Por que milhares de profissionais confiam na Jurieasy?
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {[
                            {
                                icon: './landing-rocket.svg',
                                title: 'Velocidade Impressionante',
                                description: 'De horas para minutos. Gere contratos profissionais em menos de 2 minutos'
                            },
                            {
                                icon: './landing-lock.svg',
                                title: 'Segurança Jurídica',
                                description: 'Criptografia avançada e compliance com LGPD'
                            },
                            {
                                icon: './landing-layers.svg',
                                title: 'Precisão Técnica',
                                description: 'Modelos elaborados por especialistas em direito de diversas áreas'
                            },
                            {
                                icon: './landing-sync.svg',
                                title: 'Atualizações Constantes',
                                description: 'Adequação automática às mudanças legislativas'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-200 hover:border-primary-300 transition-all duration-300 group hover:shadow-lg"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                            >
                                {/* Ícone flutuante */}
                                <motion.div
                                    className="text-2xl sm:text-3xl mb-4 text-gray-700"
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        width={44}
                                        height={44}
                                    />
                                </motion.div>

                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
