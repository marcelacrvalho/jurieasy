"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col justify-center">
            {/* Fundo suave com brilho */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_60%)]" />

            {/* Container principal */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-8 pt-24 sm:pt-32">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 max-w-4xl leading-tight"
                >
                    Crie contratos jurídicos{" "}
                    <span className="text-blue-600">em minutos</span> com total segurança
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-gray-600 text-lg sm:text-xl mt-6 max-w-2xl"
                >
                    A Jurieasy combina tecnologia e expertise jurídica para gerar documentos
                    impecáveis — rápido, fácil e 100% confiável.
                </motion.p>

                {/* Botões */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 mt-8"
                >
                    <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all shadow-md">
                        Criar meu primeiro contrato
                    </button>
                    <button
                        onClick={() => (window.location.href = "/demonstration")}
                        className="border border-gray-300 text-gray-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all"
                    >
                        Ver demonstração
                    </button>
                </motion.div>

                {/* Mockup central (pode substituir pelo vídeo futuramente) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-16 w-full max-w-5xl flex justify-center"
                >
                    <Image
                        src="/slide-1.svg"
                        alt="Exemplo da plataforma Jurieasy"
                        width={1000}
                        height={600}
                        className="rounded-2xl shadow-2xl w-full h-auto"
                    />
                </motion.div>
            </div>
        </section>
    );
}
