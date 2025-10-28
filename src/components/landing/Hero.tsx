import Image from "next/image";

export default function Hero() {
    return (
        <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col relative overflow-hidden">

            <div className="absolute right-0 bottom-0 z-0 h-screen opacity-20 md:opacity-100">
                <Image
                    src='/landing-vector.svg'
                    alt="Ilustração de um globo"
                    width={600}
                    height={800}
                    className="w-auto h-full object-cover object-right"
                    priority
                />
            </div>

            {/* Conteúdo principal acima da imagem */}
            <div className="flex-1 flex items-center py-8 sm:py-16 relative z-10 pt-20 sm:pt-24">
                <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 w-full">
                    <h1 className="text-[28px] sm:text-[42px] md:text-[56px] lg:text-[64px] font-bold text-white mb-6 sm:mb-8 leading-tight">
                        Unimos a agilidade da tecnologia
                        com a segurança de um escritório
                    </h1>

                    <p className="text-[16px] sm:text-[20px] text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
                        Transforme documentos complexos em contratos impecáveis em minutos,
                        com a confiabilidade que seu negócio exige
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-16">
                        <button className="bg-blue-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-semibold text-[16px] sm:text-[18px] hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                            Criar meu primeiro contrato
                        </button>
                        <button className="border-2 border-gray-400 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-[14px] sm:text-[16px] hover:bg-white/10 transition-all duration-300">
                            Ver demonstração
                        </button>
                    </div>
                </div>
            </div>

        </section>
    );
}