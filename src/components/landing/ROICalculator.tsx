"use client";

import { useState, useEffect } from 'react';
import { Calculator, Clock, FileText, DollarSign } from 'lucide-react';

const ROICalculator = () => {
    const [contractsPerMonth, setContractsPerMonth] = useState<number>(10);
    const [timePerContract, setTimePerContract] = useState<number>(30);
    const [hourlyRate, setHourlyRate] = useState<string>('50'); // Agora como string
    const [hourlyRateNumber, setHourlyRateNumber] = useState<number>(50); // Versão numérica para cálculos

    // Efeito para sincronizar o valor numérico quando a string muda
    useEffect(() => {
        const numValue = parseInt(hourlyRate);
        if (!isNaN(numValue) && numValue > 0) {
            setHourlyRateNumber(numValue);
        } else {
            // Se estiver vazio ou inválido, usa 1 para evitar erros nos cálculos
            setHourlyRateNumber(1);
        }
    }, [hourlyRate]);

    // Cálculos usando hourlyRateNumber
    const totalMonthlyTime = (contractsPerMonth * timePerContract) / 60; // em horas
    const currentMonthlyCost = totalMonthlyTime * hourlyRateNumber;

    // Supondo que a Jurieasy reduza 80% do tempo
    const timeSavedPercentage = 0.8;
    const timeSavedHours = totalMonthlyTime * timeSavedPercentage;
    const moneySaved = currentMonthlyCost * timeSavedPercentage;

    // Plano mensal
    const monthlyPlanPrice = 47;
    const daysToPayback = Math.ceil(monthlyPlanPrice / (moneySaved / 30));

    // Estimativa baseada na economia
    const estimatedROI = ((moneySaved - monthlyPlanPrice) / monthlyPlanPrice) * 100;

    // Função para tratar mudança no valor da hora
    const handleHourlyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Permite apagar completamente
        if (value === '') {
            setHourlyRate('');
            return;
        }

        // Permite apenas números
        if (/^\d+$/.test(value)) {
            const numValue = parseInt(value);
            // Opcional: limita o máximo se quiser
            if (numValue <= 9999) { // Limite alto para permitir valores realistas
                setHourlyRate(value);
            }
        }
    };

    // Função para tratar quando o campo perde o foco
    const handleHourlyRateBlur = () => {
        // Se estiver vazio, volta para o valor padrão
        if (hourlyRate === '') {
            setHourlyRate('50');
        } else {
            // Garante que é um número válido
            const numValue = parseInt(hourlyRate);
            if (isNaN(numValue) || numValue <= 0) {
                setHourlyRate('50');
            }
        }
    };

    return (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Calcule o impacto da Jurieasy para você
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Descubra quanto tempo e dinheiro você pode economizar automatizando seus contratos
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Painel de Entrada */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                            Configure sua situação atual
                        </h3>

                        <div className="space-y-6">
                            {/* Contratos por mês */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <FileText className="w-4 h-4" />
                                    Quantos contratos você gera por mês?
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={contractsPerMonth}
                                        onChange={(e) => setContractsPerMonth(parseInt(e.target.value))}
                                        className="flex-1 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-lg font-bold text-blue-600 min-w-[60px]">
                                        {contractsPerMonth}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>1</span>
                                    <span>25</span>
                                    <span>50</span>
                                    <span>75</span>
                                    <span>100+</span>
                                </div>
                            </div>

                            {/* Tempo por contrato */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <Clock className="w-4 h-4" />
                                    Quanto tempo você gasta em cada um (minutos)?
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="5"
                                        max="120"
                                        step="5"
                                        value={timePerContract}
                                        onChange={(e) => setTimePerContract(parseInt(e.target.value))}
                                        className="flex-1 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-lg font-bold text-blue-600 min-w-[60px]">
                                        {timePerContract} min
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>5 min</span>
                                    <span>45 min</span>
                                    <span>90 min</span>
                                    <span>120 min</span>
                                </div>
                            </div>

                            {/* VALOR DA HORA - AGORA COMPLETAMENTE EDITÁVEL */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <DollarSign className="w-4 h-4" />
                                    Qual o valor da sua hora (ou do seu funcionário)?
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-700">R$</span>
                                    </div>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={hourlyRate}
                                        onChange={handleHourlyRateChange}
                                        onBlur={handleHourlyRateBlur}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                        placeholder="50"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500">/hora</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>R$ 1</span>
                                    <span>R$ 100</span>
                                    <span>R$ 500</span>
                                    <span>R$ 1000+</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <strong>Nota:</strong> Consideramos que a Jurieasy reduz em 80% o tempo gasto na criação e revisão de contratos.
                            </p>
                        </div>
                    </div>

                    {/* Painel de Resultados */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 md:p-8 text-white">
                        <h3 className="text-xl font-semibold mb-6">Sua economia com a Jurieasy</h3>

                        <div className="space-y-6">
                            {/* Economia Mensal */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                                <div className="text-sm text-blue-100 mb-1">Economia mensal estimada</div>
                                <div className="text-3xl md:text-4xl font-bold">
                                    R$ {moneySaved.toFixed(0).replace('.', ',')}
                                </div>
                                <div className="text-sm text-blue-200 mt-2">
                                    Isso significa <span className="font-bold">{timeSavedHours.toFixed(1)} horas</span> economizadas por mês
                                </div>
                            </div>

                            {/* ROI */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                                <div className="text-sm text-blue-100 mb-1">Retorno sobre o Investimento</div>
                                <div className="text-3xl md:text-4xl font-bold text-white">
                                    {estimatedROI.toFixed(0)}%
                                </div>
                                <div className="text-sm text-blue-200 mt-2">
                                    Para cada R$ 1 investido, você recebe R$ {(estimatedROI / 100 + 1).toFixed(2)} de volta
                                </div>
                            </div>

                            {/* Tempo de Payback */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                                <div className="text-sm text-blue-100 mb-1">Seu investimento se paga em</div>
                                <div className="text-3xl md:text-4xl font-bold text-white">
                                    {daysToPayback} {daysToPayback === 1 ? 'dia' : 'dias'}
                                </div>
                                <div className="text-sm text-blue-200 mt-2">
                                    Com o plano de <span className="font-bold">R$ {monthlyPlanPrice}/mês</span>
                                </div>
                            </div>

                            {/* Resumo */}
                            <div className="mt-8 p-5 bg-white/5 rounded-xl border border-white/10">
                                <h4 className="font-semibold text-lg mb-3">Resumo</h4>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex justify-between">
                                        <span className="text-blue-200">Tempo atual gasto:</span>
                                        <span className="font-bold">{totalMonthlyTime.toFixed(1)} horas/mês</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-blue-200">Tempo com Jurieasy:</span>
                                        <span className="font-bold">{(totalMonthlyTime * 0.2).toFixed(1)} horas/mês</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-blue-200">Custo atual:</span>
                                        <span className="font-bold">R$ {currentMonthlyCost.toFixed(0).replace('.', ',')}/mês</span>
                                    </li>
                                    <li className="flex justify-between border-t border-white/20 pt-3">
                                        <span className="text-green-300 font-semibold">Economia líquida:</span>
                                        <span className="text-green-300 font-bold text-lg">
                                            R$ {(moneySaved - monthlyPlanPrice).toFixed(0).replace('.', ',')}/mês
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* CTA */}
                            <div className="text-center mt-8">
                                <p className="text-lg mb-4">
                                    <span className="font-bold">Você está perdendo R$ {currentMonthlyCost.toFixed(0).replace('.', ',')}/mês em burocracia</span>
                                    <br />
                                    <span className="text-blue-300">Economize isso por apenas R$ {monthlyPlanPrice}/mês</span>
                                </p>
                                <button
                                    onClick={() => {
                                        // Salva o plano escolhido e redireciona para /auth
                                        localStorage.setItem("selectedPlan", "pro");
                                        window.location.href = "/auth";
                                    }}
                                    className="w-full bg-white text-blue-600 font-bold py-4 px-6 rounded-full hover:bg-gray-100 transition-all duration-300 text-lg shadow-lg">
                                    Começar a economizar agora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Destaque de economia */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 text-gray-700 px-6 py-3 rounded-full">
                        <span>
                            Em média, nossos clientes economizam R$ 1.200/mês e ganham 20 horas de produtividade
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ROICalculator;