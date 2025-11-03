"use client";
import { motion } from "framer-motion";

export default function Testimonial() {
    const testimonials = [
        {
            quote: "A Jurieasy reduziu em 80% o tempo que gastava com contratos padrão para meus clientes. Agora consigo focar na área em que sou especialista.",
            author: "Ana Carolina Silva Souza",
            role: "Sócia da Construtora Souza Engenharia",
            rating: 5,
        },
        {
            quote: "A precisão dos modelos e a facilidade de customização são impressionantes. Minha produtividade nunca foi tão alta.",
            author: "Dr. Roberto Mendes",
            role: "Advogado Autônomo — Direito Digital",
            rating: 5,
        },
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* brilho de fundo suave */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.1),transparent_70%)]" />

            <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">
                {/* Cabeçalho */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        O que nossos clientes dizem
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                        Profissionais que transformaram sua rotina jurídica com a Jurieasy
                    </p>
                </motion.div>

                {/* Depoimentos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all border border-gray-100"
                        >
                            {/* Estrelas */}
                            <div className="flex mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-2xl leading-none">★</span>
                                ))}
                            </div>

                            {/* Citação */}
                            <p className="text-gray-700 text-base sm:text-lg mb-6 leading-relaxed">
                                “{testimonial.quote}”
                            </p>

                            {/* Autor */}
                            <div>
                                <div className="font-semibold text-gray-900 text-lg">
                                    {testimonial.author}
                                </div>
                                <div className="text-gray-500 text-sm mt-1">
                                    {testimonial.role}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
