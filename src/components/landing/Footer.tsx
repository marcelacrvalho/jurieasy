"use client";

import { Mail, MessageCircleQuestionMark, Building, Phone } from 'lucide-react';
import Image from "next/image";

interface FooterProps {
    onLegalClick?: (sectionId: string) => void;
}

export default function Footer({ onLegalClick }: FooterProps) {
    const handleLegalClick = (sectionId: string) => {
        if (onLegalClick) {
            onLegalClick(sectionId);
            return;
        }

        // Fallback: rolar para a seção se o modal não estiver disponível
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <div className="text-2xl font-bold text-white mb-4">Jurieasy</div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Tecnologia e segurança jurídica para simplificar a criação de contratos e documentos legais.
                        </p>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-lg">Jurídico</h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Termos de Uso', id: 'termos-de-uso' },
                                { name: 'Política de Privacidade', id: 'politica-privacidade' },
                                { name: 'LGPD', id: 'lgpd' },
                                { name: 'Cookies', id: 'cookies' },
                                { name: 'Segurança', id: 'seguranca' }
                            ].map((item) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => handleLegalClick(item.id)}
                                        className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column - mantido igual */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-lg">Contato</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex items-center gap-3">
                                <Mail className="h-3 w-3 text-gray-500" />
                                <div>
                                    <div>comercial@jurieasy.com</div>
                                    <div className="text-gray-500 text-xs">Comercial</div>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <MessageCircleQuestionMark className="h-3 w-3 text-gray-500" />
                                <div>
                                    <div>suporte@jurieasy.com</div>
                                    <div className="text-gray-500 text-xs">Suporte</div>
                                </div>
                            </li>
                            <li className="flex items-center gap-2">
                                <Building className="h-3 w-3 text-gray-500" />
                                <div>
                                    <div>Avenida Benjamin Constant, 113</div>
                                    <div className="text-gray-500 text-xs">Varginha - Minas Gerais</div>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-3 w-3 text-gray-500" />
                                <div>
                                    <div>(35) 99938-5136</div>
                                    <div className="text-gray-500 text-xs">Segunda à Sexta, 09:00-18:00</div>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Newsletter Section - mantido igual */}
            <div className="border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex-1">
                            <h4 className="font-semibold text-white mb-2">Receba insights jurídicos</h4>
                            <p className="text-gray-400 text-sm">
                                Novidades sobre legislação, modelos de contrato e dicas práticas
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="seu.email@exemplo.com"
                                className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 flex-1 min-w-64"
                            />
                            <button className="bg-red border-gray-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap">
                                Assinar Newsletter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer - mantido igual */}
            <div className="border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Jurieasy. Todos os direitos reservados.
                        </div>

                        <div className="flex items-center gap-2 md:gap-4"> {/* Container para as imagens */}
                            <Image
                                src="/lgpd-certified.png"
                                alt="Certificado LGPD"
                                width={80}
                                height={80}
                                className="text-blue-600"
                            />
                            <Image
                                src="/ssl-certified.png"
                                alt="Certificado SSL"
                                width={60}
                                height={60}
                                className="text-blue-600"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}