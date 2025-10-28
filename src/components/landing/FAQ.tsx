import { useEffect, useState } from 'react';

export default function FAQ() {
    return (
        <>
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Perguntas Frequentes
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            Tire suas dúvidas sobre a plataforma e nossos serviços
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                question: "Os contratos gerados são juridicamente válidos?",
                                answer: "Sim, todos os nossos modelos são elaborados e revisados por advogados especialistas, seguindo a legislação brasileira vigente. Os documentos gerados possuem validade jurídica plena."
                            },
                            {
                                question: "Como é garantida a segurança dos meus dados?",
                                answer: "Utilizamos criptografia de ponta a ponta, servidores localizados no Brasil em compliance com a LGPD, e realizamos auditorias regulares de segurança. Seus dados estão sempre protegidos."
                            },
                            {
                                question: "Posso personalizar os contratos com minhas cláusulas?",
                                answer: "Sim, a plataforma permite total personalização. Você pode editar cláusulas, adicionar novas disposições e adaptar os documentos às necessidades específicas de cada caso."
                            },
                            {
                                question: "Qual é a política de cancelamento?",
                                answer: "O cancelamento pode ser feito a qualquer momento pelo painel do usuário. Não cobramos taxas de cancelamento e você pode continuar utilizando a Jurieasy até o vencimento do período contratado."
                            },
                            {
                                question: "Preciso ter conhecimento jurídico para usar a plataforma?",
                                answer: "Não é necessário. A plataforma foi desenvolvida para ser intuitiva, com orientações claras em cada etapa. No entanto, para casos complexos, recomendamos consultar um advogado."
                            },
                            {
                                question: "Como funcionam as atualizações dos modelos?",
                                answer: "Monitoramos constantemente as mudanças legislativas e jurisprudenciais. Todas as alterações relevantes são automaticamente incorporadas aos modelos, mantendo seus documentos sempre atualizados."
                            },
                            {
                                question: "É possível integrar com outros sistemas?",
                                answer: "Sim, oferecemos APIs para integração com sistemas de assinatura digital e estamos trabalhando para implementar outras ferramentas e integrações. Consulte nosso time comercial para detalhes sobre integrações personalizadas."
                            },
                            {
                                question: "Há limite de downloads ou impressões?",
                                answer: "Não há limites. Você pode gerar, baixar e imprimir quantas versões necessitar dos documentos criados na plataforma, de acordo com o plano contratado."
                            }
                        ].map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                            />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <div className="bg-gray-50 rounded-2xl p-8 sm:p-10">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Ainda tem dúvidas?
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Nossa equipe de especialistas está pronta para ajudar
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-white text-gray-300 px-10 py-3 rounded-full hover:bg-primary-700 transition-colors">
                                    Falar com Especialista
                                </button>
                                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors">
                                    Enviar Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
            <button
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 rounded-xl transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold text-gray-900 text-lg pr-4">
                    {question}
                </span>
                <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
}