"use client";

import Image from 'next/image';
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

      {/* Seção de Benefícios com Animação */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-16">
              Por que <span className="text-blue-500">milhares de profissionais</span>
              <br className="hidden sm:block" />
              confiam na JuriEasy?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  icon: '⚡',
                  title: 'Velocidade Impressionante',
                  description: 'De horas para minutos. Gere contratos profissionais em menos de 2 minutos',
                  gradient: 'from-yellow-50 to-orange-50',
                  border: 'hover:border-yellow-300'
                },
                {
                  icon: '🔒',
                  title: 'Segurança de Verdade',
                  description: 'Criptografia nível bancário. Auditado trimestralmente por especialistas',
                  gradient: 'from-blue-50 to-cyan-50',
                  border: 'hover:border-blue-300'
                },
                {
                  icon: '🎯',
                  title: 'Precisão Jurídica',
                  description: 'Modelos criados e revisados por advogados especialistas',
                  gradient: 'from-green-50 to-emerald-50',
                  border: 'hover:border-green-300'
                },
                {
                  icon: '🔄',
                  title: 'Sempre Atualizado',
                  description: 'Monitoramos mudanças na lei e atualizamos automaticamente',
                  gradient: 'from-purple-50 to-violet-50',
                  border: 'hover:border-purple-300'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${feature.gradient} p-6 sm:p-8 rounded-2xl border-2 border-transparent ${feature.border} transition-all duration-500 group hover:shadow-xl hover:scale-105 backdrop-blur-sm`}
                >
                  <div className="text-3xl sm:text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
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

      {/* Seção de Preços com Destaque */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
        {/* Elementos de fundo decorativos */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planos transparentes para necessidades específicas
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Escolha a solução que melhor se adapta ao seu volume de trabalho
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Individual',
                price: 'Grátis',
                description: 'Para avaliação da plataforma',
                features: ['1 documento/mês', 'Suporte por email'],
                button: 'Começar Agora',
                color: 'gray',
                popular: false
              },
              {
                name: 'Profissional',
                price: 'R$ 97',
                description: 'Para uso regular',
                features: ['15 documentos/mês', 'Logo personalizada', 'Suporte prioritário'],
                button: 'Assinar Plano',
                color: 'blue',
                popular: true
              },
              {
                name: 'Escritório',
                price: 'R$ 197',
                description: 'Para times jurídicos',
                features: ['Documentos ilimitados', 'Logo personalizada', 'Documentos na nuvem', 'Múltiplos usuários', 'DocuSign e GOVBR', 'Suporte dedicado'],
                button: 'Assinar Plano',
                color: 'purple',
                popular: false
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl border-2 ${plan.popular
                  ? 'border-blue-500 shadow-2xl scale-105'
                  : 'border-gray-200 hover:border-gray-300'
                  } p-8 transition-all duration-500 hover:shadow-xl group backdrop-blur-sm bg-white/80`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      MAIS POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-1">{plan.price}</div>
                  <p className="text-gray-500">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-gray-700">
                      <div className={`w-5 h-5 bg-${plan.color}-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <div className={`w-2 h-2 bg-${plan.color}-500 rounded-full`}></div>
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full bg-${plan.color}-500 text-white py-4 rounded-xl font-bold hover:bg-${plan.color}-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}>
                  {plan.button}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">
              💫 Todos os planos incluem atualizações automáticas e segurança SSL 256-bit
            </p>
          </div>
        </div>
      </section>

      {/* Nova Seção: Social Proof */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-8">
            Confiado por mais de <span className="text-blue-500">5.000 profissionais</span> do direito
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60">
            <div className="text-2xl font-bold text-gray-400">ADVOGADOS AUTONÔMOS</div>
            <div className="text-2xl font-bold text-gray-400">ESCRITÓRIOS DE MARKETING</div>
            <div className="text-2xl font-bold text-gray-400">ESCRITÓRIOS DE ADVOCACIA</div>
            <div className="text-2xl font-bold text-gray-400">STARTUPS</div>
            <div className="text-2xl font-bold text-gray-400">CLÍNICAS DE ESTÉTICA</div>
          </div>
        </div>
      </section>
    </>
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
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#0E1A2B] backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="flex justify-between items-center">
          <div className={`text-xl font-bold transition-colors text-green-400'
            }`}>jurieasy</div>
          <button className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${scrolled
            ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'
            : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 border border-white/30'
            }`}>
            Começar agora
          </button>
        </nav>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0E1A2B] to-[#1a2d4d] flex flex-col relative overflow-hidden pt-20 sm:pt-24">
      {/* Elementos de fundo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 flex items-center py-8 sm:py-16 relative z-10">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 w-full">
          <h1 className="text-[28px] sm:text-[42px] md:text-[56px] lg:text-[64px] font-bold text-white mb-6 sm:mb-8 leading-tight animate-fade-in-up">
            Unimos a <span className="text-blue-400">agilidade</span> de um app <br className="hidden sm:block" />
            e a <span className="text-green-400">segurança</span> de um escritório
          </h1>

          <p className="text-[16px] sm:text-[20px] text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2 sm:px-4 animate-fade-in-up delay-200">
            Do documento complicado ao contrato impecável em minutos,
            com a segurança jurídica que seu negócio merece
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-16 animate-fade-in-up delay-400">
            <button className="bg-blue-500 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-[16px] sm:text-[18px] hover:bg-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1">
              Criar meu primeiro contrato
            </button>
            <button className="border-2 border-white/30 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-[14px] sm:text-[16px] hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              Ver demonstração
            </button>
          </div>

        </div>
      </div>


    </section>
  );
}