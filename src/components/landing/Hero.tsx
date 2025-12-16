"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white min-h-screen flex flex-col justify-center p-4">
            {/* Fundo com leve brilho azul no topo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_70%)]" />

            {/* Conteúdo principal */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-8 pt-28 sm:pt-36">
                {/* Título */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 max-w-4xl leading-tight tracking-tight"
                >
                    Crie contratos jurídicos{" "}
                    <span className="text-blue-600">em minutos</span> com total segurança
                </motion.h1>

                {/* Subtítulo */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-gray-600 text-lg sm:text-xl mt-6 max-w-2xl"
                >
                    A Jurieasy combina tecnologia e expertise jurídica para gerar documentos
                    impecáveis — rápido, fácil e 100% confiável
                </motion.p>

                {/* Botões */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 mt-8"
                >
                    <button
                        onClick={() => (window.location.href = "/auth")}
                        className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                        Criar meu primeiro contrato grátis
                    </button>
                </motion.div>

                {/* Seção do Vídeo */}
                <section className="w-full py-12 md:py-16">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl mx-auto">

                            <div className="relative w-full rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl">
                                <video
                                    className="w-full h-auto"
                                    controls
                                    autoPlay={true}
                                    muted
                                    playsInline
                                >
                                    <source src="/landing-video.mp4" type="video/mp4" />
                                    Seu navegador não suporta a tag de vídeo.
                                </video>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </section>
    );
}