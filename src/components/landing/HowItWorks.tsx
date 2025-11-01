import Image from "next/image";

export default function HowItWorks() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Como a Jurieasy transforma seu trabalho
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Do documento complicado ao contrato perfeito em 3 passos simples
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {

                            title: "Responda perguntas simples",
                            description: "Nosso assistente conversa com você para entender suas necessidades",
                            icon: "/landing-message.svg"
                        },
                        {

                            title: "Revise o contrato gerado",
                            description: "Visualize e edite o contrato personalizado em tempo real",
                            icon: "/landing-document.svg"
                        },
                        {

                            title: "Assine e utilize",
                            description: "Baixe o PDF profissional ou compartilhe para assinatura digital",
                            icon: "/landing-check.svg"
                        }
                    ].map((item, index) => (
                        <div key={index} className="text-center p-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                                <Image
                                    src={item.icon}
                                    alt={item.title}
                                    width={34}
                                    height={34}
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}