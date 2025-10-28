
export default function Footer() {
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

                    {/* TODO: criar página para cada item */}

                    {/* Legal Column */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-lg">Jurídico</h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Termos de Uso', url: '#' },
                                { name: 'Política de Privacidade', url: '#' },
                                { name: 'LGPD', url: '#' },
                                { name: 'Cookies', url: '#' },
                                { name: 'Segurança', url: '#' }
                            ].map((item, index) => (
                                <li key={index}>
                                    <a
                                        href={item.url}
                                        className="text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-lg">Contato</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex items-start gap-3">
                                <span>📧</span>
                                <div>
                                    <div>comercial@jurieasy.com</div>
                                    <div className="text-gray-500 text-xs">Comercial</div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span>🛟</span>
                                <div>
                                    <div>suporte@jurieasy.com</div>
                                    <div className="text-gray-500 text-xs">Suporte</div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span>🏢</span>
                                <div>
                                    <div>Av. Paulista, 1000</div>
                                    <div className="text-gray-500 text-xs">São Paulo - SP</div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span>📞</span>
                                <div>
                                    <div>(11) 9999-9999</div>
                                    <div className="text-gray-500 text-xs">Segunda a Sexta, 9h-18h</div>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Newsletter Section */}
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
                                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 flex-1 min-w-64"
                            />
                            <button className="bg-red border-gray-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap">
                                Assinar Newsletter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Jurieasy. Todos os direitos reservados.
                        </div>
                        <div className="flex items-center gap-6 text-gray-400 text-sm">
                            <span>CNPJ: 12.345.678/0001-90</span> {/* TODO: adicionar meu CNPJ */}
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>Sistema operacional</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}