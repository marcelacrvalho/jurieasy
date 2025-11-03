"use client";
import { motion } from "framer-motion";

export default function SocialProof() {
    const stats = [
        { number: "5000+", label: "Contratos gerados" },
        { number: "85%", label: "Tempo economizado" },
        { number: "4.9/5", label: "Avaliação dos usuários" },
        { number: "24/7", label: "Disponibilidade" },
    ];

    return (
        <section className="relative py-20 bg-white overflow-hidden">
            {/* Efeito de fundo com brilho suave */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_70%)]" />

            <div className="relative max-w-6xl mx-auto px-6 sm:px-8 text-center z-10">
                {/* Cabeçalho */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-14"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Confiado por advogados e empresas que inovam
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        De profissionais independentes a grandes corporações, todos economizam tempo e ganham segurança com a Jurieasy
                    </p>
                </motion.div>

                {/* Estatísticas */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-16 mt-12"
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-gray-700 text-base sm:text-lg font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
