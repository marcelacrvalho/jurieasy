export default function Prices() {
    return (
        <>
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 md:mb-20">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Planos Transparentes
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            Soluções adaptadas ao seu volume de demanda jurídica
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: 'Individual',
                                price: 'Grátis',
                                description: 'Para avaliação da plataforma',
                                features: ['1 documento/mês', 'Suporte por email'],
                                button: 'Começar Agora',
                                popular: false
                            },
                            {
                                name: 'Profissional',
                                price: 'R$ 97',
                                description: 'Para uso regular',
                                features: ['15 documentos/mês', 'Sua logo personalizada', 'Suporte prioritário'],
                                button: 'Assinar Plano',
                                popular: true
                            },
                            {
                                name: 'Escritório',
                                price: 'R$ 197',
                                description: 'Para equipes jurídicas',
                                features: ['Documentos ilimitados', 'Sua logo personalizada', 'Múltiplos usuários', 'Integração com DocuSign e GOV BR', 'Documentos ficam salvos na nuvem', 'Suporte dedicado'],
                                button: 'Assinar Plano',
                                popular: false
                            }
                        ].map((plan, index) => (
                            <div
                                key={index}
                                className={`relative bg-white rounded-xl border-2 ${plan.popular
                                    ? 'border-[#108D2B] shadow-xl'
                                    : 'border-gray-200 hover:border-gray-300'
                                    } p-8 transition-all duration-300 hover:shadow-lg`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-[#108D2B] text-white px-4 py-1 rounded-full text-sm font-semibold">
                                            MAIS POPULAR
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">{plan.price}</div>
                                    <p className="text-gray-500 text-sm">{plan.description}</p>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center gap-3 text-gray-700">
                                            <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                            </div>
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${plan.popular
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}>
                                    {plan.button}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-gray-500 text-sm">
                            * Todos os planos incluem atualizações automáticas e segurança SSL 256-bit
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}