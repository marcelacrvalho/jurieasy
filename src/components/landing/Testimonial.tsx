export default function Testimonial() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        O que nossos clientes dizem
                    </h2>
                    <p className="text-lg text-gray-600text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        Profissionais que transformaram sua rotina jurídica
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        {
                            quote: "A Jurieasy reduziu em 80% o tempo que gastava com contratos padrão para meus clientes. Agora consigo focar na área em que sou especialista",
                            author: "Ana Carolina Silva Souza",
                            role: "Sócia da construtora Souza Engenharia",
                            rating: 5
                        },
                        {
                            quote: "A precisão dos modelos e a facilidade de customização são impressionantes. Minha produtividade nunca foi tão alta.",
                            author: "Dr. Roberto Mendes",
                            role: "Advogado Autônomo - Direito Digital",
                            rating: 5
                        }
                    ].map((testimonial, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-3x1">⭐</span>
                                ))}
                            </div>
                            <p className="text-gray-600 text-3x1 mb-6">"{testimonial.quote}"</p>
                            <div>
                                <div className="font-semibold text-gray-900">{testimonial.author}</div>
                                <div className="text-gray-500 text-sm">{testimonial.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
