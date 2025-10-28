"use client";

import Image from "next/image";
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <Header />
      <HeroSection />

      {/* Seção de Benefícios - Cores Profissionais */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-16">
              Por que <span className="text-primary-600">milhares de profissionais</span>
              <br className="hidden sm:block" />
              confiam na Jurieasy?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  icon: './landing-rocket.svg',
                  title: 'Velocidade Impressionante',
                  description: 'De horas para minutos. Gere contratos profissionais em menos de 2 minutos'
                },
                {
                  icon: './landing-lock.svg',
                  title: 'Segurança Jurídica',
                  description: 'Criptografia avançada e compliance com LGPD'
                },
                {
                  icon: './landing-layers.svg',
                  title: 'Precisão Técnica',
                  description: 'Modelos elaborados por especialistas em direito de diversas áreas'
                },
                {
                  icon: './landing-sync.svg',
                  title: 'Atualizações Constantes',
                  description: 'Adequação automática às mudanças legislativas'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-200 hover:border-primary-300 transition-all duration-300 group hover:shadow-lg"
                >
                  <div className="text-2xl sm:text-3xl mb-4 text-gray-700">
                    <Image
                      src={feature.icon}
                      alt="Ícone de um foguete"
                      width={44}
                      height={44}
                    />

                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Preços - Design Sóbrio */}
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

      <section className="video-section">
        <div className="max-w-4xl mx-auto">
          <video
            src="/ui-questions.mp4"
            width={800}
            height={450}
            controls
            autoPlay
            muted
            loop
            className="w-full"
          >
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>
      </section>

      <TestimonialsSection />

      {/* Seção Social Proof */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-8">
            Confiado por mais de <span className="text-blue-500">5.000 profissionais</span> de diversas áreas
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60">
            <div className="text-2xl font-bold text-gray-400">ADVOGADOS AUTONÔMOS</div>
            <div className="text-2xl font-bold text-gray-400">AGÊNCIAS DE MARKETING</div>
            <div className="text-2xl font-bold text-gray-400">ESCRITÓRIOS DE ADVOCACIA</div>
            <div className="text-2xl font-bold text-gray-400">STARTUPS</div>
            <div className="text-2xl font-bold text-gray-400">CLÍNICAS DE ESTÉTICA</div>
            <div className="text-2xl font-bold text-gray-400">FILMAKERS</div>
          </div>
        </div>
      </section>

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

      <Footer /> </>
  )
}

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="flex justify-between items-center">
          <div className={`text-xl font-bold transition-colors text-[#108D2B]'
            }`}>jurieasy</div>
          <button className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${scrolled
            ? 'bg-blue-600 text-white hover:bg-primary-700'
            : 'bg-white text-gray-900 hover:bg-gray-100'
            }`}>
            Acessar Plataforma
          </button>
        </nav>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col relative overflow-hidden">
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
            <button className="bg-blue-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-semibold text-[16px] sm:text-[18px] hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl">
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

function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-gray-600">
            Profissionais que transformaram sua rotina jurídica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              quote: "A Jurieasy reduziu em 80% o tempo que gastava com contratos padrão. Agora consigo focar em casos mais complexos.",
              author: "Dra. Ana Carolina Silva",
              role: "Sócia do escritório Silva & Advogados",
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
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-600 text-lg italic mb-6">"{testimonial.quote}"</p>
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

function Footer() {
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
              © {new Date().getFullYear()} JuriEasy. Todos os direitos reservados.
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