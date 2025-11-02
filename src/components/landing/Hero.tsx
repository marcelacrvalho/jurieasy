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
                    <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                        Criar meu primeiro contrato
                    </button>
                    <button
                        onClick={() => (window.location.href = "/demonstration")}
                        className="border border-gray-300 text-gray-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all"
                    >
                        Ver demonstração
                    </button>
                </motion.div>

                {/* Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="relative mt-20 sm:mt-24 w-full max-w-5xl px-4 flex justify-center"
                >
                    <div className="relative  bg-rgba(59,130,246,0.15),transparent_70%) rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl w-full">
                        <Image
                            src="/slide-1.svg"
                            alt="Exemplo da plataforma Jurieasy"
                            width={1000}
                            height={600}
                            className="rounded-xl w-full h-auto"
                        />

                        {/* Efeito glow sutil */}
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-blue-400/10 shadow-[0_0_40px_rgba(59,130,246,0.2)] pointer-events-none" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
