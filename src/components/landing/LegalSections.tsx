const LegalSections = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-12 bg-gray-900">
            {/* Termos de Uso */}
            <section id="termos-de-uso" className="mb-16 scroll-mt-20">
                <h2 className="text-2xl font-bold text-white mb-6">Termos de Uso</h2>
                <div className="bg-gray-900 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">1. Aceitação dos Termos</h3>
                    <p className="text-gray-300 mb-4">
                        Ao acessar e usar a Jurieasy, você concorda em cumprir estes Termos de Uso
                        e todas as leis e regulamentos aplicáveis.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">2. Uso do Serviço</h3>
                    <p className="text-gray-300 mb-4">
                        Nossos serviços são destinados para uso profissional jurídico.
                        Você é responsável por manter a confidencialidade de sua conta.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">3. Limitações</h3>
                    <p className="text-gray-300">
                        Não use nossos serviços para atividades ilegais ou não autorizadas.
                    </p>
                </div>
            </section>

            {/* Política de Privacidade */}
            <section id="politica-privacidade" className="mb-16 scroll-mt-20">
                <h2 className="text-2xl font-bold text-white mb-6">Política de Privacidade</h2>
                <div className="bg-gray-900 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Coleta de Informações</h3>
                    <p className="text-gray-300 mb-4">
                        Coletamos informações necessárias para fornecer nossos serviços,
                        incluindo dados de cadastro e uso da plataforma.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">Uso das Informações</h3>
                    <p className="text-gray-300 mb-4">
                        Utilizamos seus dados para personalizar sua experiência,
                        melhorar nossos serviços e cumprir obrigações legais.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">Compartilhamento</h3>
                    <p className="text-gray-300">
                        Não vendemos seus dados pessoais. Compartilhamos informações apenas
                        quando necessário por exigência legal.
                    </p>
                </div>
            </section>

            {/* LGPD */}
            <section id="lgpd" className="mb-16 scroll-mt-20">
                <h2 className="text-2xl font-bold text-white mb-6">LGPD - Lei Geral de Proteção de Dados</h2>
                <div className="bg-gray-900 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Conformidade</h3>
                    <p className="text-gray-300 mb-4">
                        A Jurieasy está em total conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">Direitos do Titular</h3>
                    <ul className="text-gray-300 list-disc list-inside space-y-2 mb-4">
                        <li>Confirmação da existência de tratamento</li>
                        <li>Acesso aos dados</li>
                        <li>Correção de dados incompletos ou inexatos</li>
                        <li>Eliminação de dados desnecessários</li>
                        <li>Revogação do consentimento</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mb-4">Encarregado de Dados (DPO)</h3>
                    <p className="text-gray-300">
                        Para exercer seus direitos, entre em contato com nosso Encarregado de Dados:
                        <a href="mailto:suporte@jurieasy.com" className="text-blue-400 hover:text-blue-300 ml-1">
                            suporte@jurieasy.com
                        </a>
                    </p>
                </div>
            </section>

            {/* Cookies */}
            <section id="cookies" className="mb-16 scroll-mt-20">
                <h2 className="text-2xl font-bold text-white mb-6">Política de Cookies</h2>
                <div className="bg-gray-900 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">O que são Cookies?</h3>
                    <p className="text-gray-300 mb-4">
                        Cookies são pequenos arquivos de texto armazenados em seu dispositivo
                        para melhorar sua experiência de navegação.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">Tipos de Cookies Utilizados</h3>
                    <ul className="text-gray-300 list-disc list-inside space-y-2 mb-4">
                        <li>Cookies Essenciais: necessários para o funcionamento do site</li>
                        <li>Cookies de Desempenho: analisam como você usa nosso site</li>
                        <li>Cookies de Funcionalidade: lembram suas preferências</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mb-4">Controle de Cookies</h3>
                    <p className="text-gray-300">
                        Você pode controlar ou excluir cookies através das configurações do seu navegador.
                    </p>
                </div>
            </section>

            {/* Segurança */}
            <section id="seguranca" className="mb-16 scroll-mt-20">
                <h2 className="text-2xl font-bold text-white mb-6">Política de Segurança</h2>
                <div className="bg-gray-900 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Medidas de Segurança</h3>
                    <p className="text-gray-300 mb-4">
                        Implementamos medidas técnicas e organizacionais robustas para proteger seus dados:
                    </p>

                    <ul className="text-gray-300 list-disc list-inside space-y-2 mb-4">
                        <li>Criptografia de dados em repouso e em trânsito</li>
                        <li>Autenticação multifator</li>
                        <li>Monitoramento contínuo de segurança</li>
                        <li>Backups regulares</li>
                        <li>Controles de acesso baseados em função</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mb-4">Conformidade e Certificações</h3>
                    <p className="text-gray-300">
                        Nossa infraestrutura atende aos mais altos padrões de segurança
                        e estamos em conformidade com as melhores práticas do setor.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default LegalSections;