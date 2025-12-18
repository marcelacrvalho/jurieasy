// components/landing/LegalSections.tsx
"use client";

interface LegalSectionsProps {
    activeSection: string | null;
    onClose: () => void;
}

const LegalSections = ({ activeSection, onClose }: LegalSectionsProps) => {
    if (!activeSection) return null;

    const sections = {
        "termos-de-uso": {
            title: "Termos de Uso",
            content: [
                {
                    subtitle: "1. Aceitação dos Termos",
                    text: "Ao acessar e usar a Jurieasy, você concorda em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis."
                },
                {
                    subtitle: "2. Uso do Serviço",
                    text: "Nossos serviços são destinados para uso profissional jurídico. Você é responsável por manter a confidencialidade de sua conta."
                },
                {
                    subtitle: "3. Limitações",
                    text: "Não use nossos serviços para atividades ilegais ou não autorizadas."
                }
            ]
        },
        "politica-privacidade": {
            title: "Política de Privacidade",
            content: [
                {
                    subtitle: "Coleta de Informações",
                    text: "Coletamos informações necessárias para fornecer nossos serviços, incluindo dados de cadastro e uso da plataforma."
                },
                {
                    subtitle: "Uso das Informações",
                    text: "Utilizamos seus dados para personalizar sua experiência, melhorar nossos serviços e cumprir obrigações legais."
                },
                {
                    subtitle: "Compartilhamento",
                    text: "Não vendemos seus dados pessoais. Compartilhamos informações apenas quando necessário por exigência legal."
                },
                {
                    subtitle: "Uso justo para o plano PRO",
                    text: "Para que nenhum tipo de usuário seja prejudicado com possíveis falhas pelo excesso de uso, limitamos a quantidade de documentos geradas por dia por usuário para 500."
                }
            ]
        },
        "lgpd": {
            title: "LGPD - Lei Geral de Proteção de Dados",
            content: [
                {
                    subtitle: "Conformidade",
                    text: "A Jurieasy está em total conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018)."
                }
            ]
        },
        "cookies": {
            title: "Política de Cookies",
            content: [
                {
                    subtitle: "O que são Cookies?",
                    text: "Cookies são pequenos arquivos de texto armazenados em seu dispositivo para melhorar sua experiência de navegação."
                },
                {
                    subtitle: "Cookies Essenciais",
                    text: "Necessários para o funcionamento do site."
                },
                {
                    subtitle: "Cookies de Desempenho",

                    text: "Analisam como você usa o nosso site."
                },
                {
                    subtitle: "Cookies de Funcionalidade",
                    text: "Lembram suas preferências."
                }
            ]

        },
        "seguranca": {
            "title": "Política de Segurança",
            "content": [
                {
                    "subtitle": "Proteção de Dados",
                    "text": "Implementamos criptografia de ponta a ponta (TLS/SSL 256-bit e AES-256) para garantir a confidencialidade de todas as informações."
                },
                {
                    "subtitle": "Controles de Acesso",
                    "text": "Autenticação multifator obrigatória, controle de acesso baseado em função e monitoramento contínuo de todas as atividades."
                },
                {
                    "subtitle": "Infraestrutura",
                    "text": "Hospedagem em data centers Tier III certificados ISO 27001 e SOC 2, com redundância completa e backups automatizados."
                },
                {
                    "subtitle": "Conformidade",
                    "text": "Total aderência à LGPD, com políticas claras de tratamento de dados e registro de atividades."
                },
                {
                    "subtitle": "Monitoramento",
                    "text": "Sistemas de detecção de intrusões, firewall de última geração e varreduras regulares de vulnerabilidades."
                },
                {
                    "subtitle": "Gestão de Incidentes",
                    "text": "Plano de resposta a incidentes documentado com notificação obrigatória em até 72 horas se necessário."
                },
                {
                    "subtitle": "Continuidade",
                    "text": "Plano de recuperação de desastres testado regularmente para garantir disponibilidade contínua."
                }
            ]
        }
    };

    const section = sections[activeSection as keyof typeof sections];

    if (!section) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-white z-10 text-2xl p-2"
                    >
                        ✕
                    </button>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        <div className="scroll-mt-20">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                {section.title}
                            </h2>
                            <div className="space-y-6">
                                {section.content.map((item, index) => (
                                    <div key={index}>
                                        <h3 className="text-xl font-semibold text-white mb-3">
                                            {item.subtitle}
                                        </h3>
                                        <p className="text-gray-300">
                                            {item.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalSections;