export default function SocialProof() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Confiado por advogados e empresas que inovam
                    </h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 text-center">
                    {[
                        { number: "5000+", label: "Contratos gerados" },
                        { number: "85%", label: "Tempo economizado" },
                        { number: "4.9/5", label: "Avaliação dos usuários" },
                        { number: "24/7", label: "Disponibilidade" }
                    ].map((stat, index) => (
                        <div key={index}>
                            <div className="text-3xl font-bold text-blue-600">{stat.number}</div>
                            <div className="text-gray-600 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}