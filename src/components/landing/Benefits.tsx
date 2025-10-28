import Image from "next/image";
import { useEffect, useState } from 'react';

export default function Benefits() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <>
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-16">
                            Por que <span className="text-primary-600">milhares de profissionais</span>
                            <br className="hidden sm:block" />
                            confiam na Jurieasy?
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
                                <div
                                    key={index}
                                    className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-200 hover:border-primary-300 transition-all duration-300 group hover:shadow-lg"
                                >
                                    <div className="text-2xl sm:text-3xl mb-4 text-gray-700">
                                        <Image
                                            src={feature.icon}
                                            alt="Ícone de um foguete"
                                            width={44}
                                            height={44}
                                        />

                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}