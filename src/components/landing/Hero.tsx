import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Deixe a burocracia com a gente. Crie contratos inteligentes em minutos",
            description: "Automatize seus documentos jurídicos com modelos prontos, sempre atualizados e revisados por especialistas",
            cta: "Ver demonstração",
            image: "/slide-1.svg",
            mobileImage: "/slide-1.svg",
            onClickPath: "/demonstration"
        },
        {
            title: "Assine com validade jurídica, onde estiver",
            description: "Envie, assine e compartilhe contratos de forma 100% digital — segura, rápida e integrada à sua rotina",
            cta: "Experimentar agora",
            image: "/landing-message.svg",
            mobileImage: "/landing-message.svg",
            onClickPath: "/signup" //TODO: adicionar as outras imagens do slide

        },
        {
            title: "Modelos Profissionais para todo tipo de negócio",
            description: "Tenha acesso a uma biblioteca completa de contratos e documentos prontos para uso — do freelancer à grande empresa",
            cta: "Explorar Modelos",
            image: "/landing-rocket.svg",
            mobileImage: "/landing-rocket.svg",
            onClickPath: "/signup"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <section className="relative h-screen min-h-[600px] bg-grey overflow-hidden">
            {/* Slides */}
            <div className="relative h-full w-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                    >
                        <div className="max-w-6xl mx-auto px-4 h-full flex items-center">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center w-full">
                                {/* Conteúdo do texto - ORDEM INVERTIDA PARA MOBILE */}
                                <div className="order-2 lg:order-1 text-center lg:text-left mt-8 lg:mt-0">
                                    <h1 className="text-2xl font-bold text-white mb-3 sm:text-3xl sm:mb-4 md:text-4xl">
                                        {slide.title}
                                    </h1>
                                    <p className="text-white mb-6 max-w-2xl sm:text-lg sm:mb-8 md:text-xl">
                                        {slide.description}
                                    </p>
                                    <button onClick={() => window.location.href = slide.onClickPath!} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full text-base transition-colors duration-200 w-full sm:w-auto sm:py-4 sm:px-8 sm:text-lg">
                                        {slide.cta}
                                    </button>
                                    <p className="text-sm text-gray-400 mt-4">
                                        +5000 contratos criados automaticamente por profissionais e empresas.
                                    </p>
                                </div>

                                {/* Imagem - ORDEM PRIMEIRA PARA MOBILE */}
                                <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        width={450}
                                        height={400}
                                        className="w-4/5 h-auto max-w-[450px] sm:max-w-[400px] lg:w-full lg:max-w-[500px] rounded-2xl border border-white/40 shadow-xl"
                                        priority={index === 0}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controles de navegação - OCULTOS NO MOBILE */}
            <button
                onClick={prevSlide}
                className="hidden sm:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 z-10"
                aria-label="Slide anterior"
            >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="hidden sm:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 z-10"
                aria-label="Próximo slide"
            >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Indicadores - MAIORES NO MOBILE */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-200 ${index === currentSlide
                            ? 'bg-blue-600 scale-110 w-4 h-4 sm:w-3 sm:h-3'
                            : 'bg-gray-300 hover:bg-gray-400 w-3 h-3 sm:w-2 sm:h-2'
                            } rounded-full`}
                        aria-label={`Ir para slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Botões de navegação para mobile - NA PARTE INFERIOR */}
            <div className="sm:hidden absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
                <button
                    onClick={prevSlide}
                    className="bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200"
                    aria-label="Slide anterior"
                >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200"
                    aria-label="Próximo slide"
                >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Gradiente decorativo - MAIS SUAVE NO MOBILE */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 sm:w-1/3 sm:h-1/3 bg-blue-200/10 sm:bg-blue-200/20 rounded-full blur-2xl sm:blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 sm:w-1/3 sm:h-1/3 bg-blue-100/20 sm:bg-blue-100/30 rounded-full blur-2xl sm:blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </section>
    );
}