export interface Question {
    id: string;
    type: 'text' | 'textarea' | 'select' | 'radio';
    title: string;
    description?: string;
    placeholder?: string;
    helpText?: string;
    options?: Array<{
        value: string;
        label: string;
        description?: string;
    }>;
}

export const contractQuestions: Question[] = [
    {
        id: 'contractor_name',
        type: 'text',
        title: 'Pra começar, me conta seu nome completo?',
        description: 'Pode ser seu nome pessoal ou da sua empresa',
        placeholder: 'Ex: João Silva ou Silva & Associados LTDA',
        helpText: 'Vai ser assim que você vai assinar o contrato 😊'
    },
    {
        id: 'contractor_type',
        type: 'select',
        title: 'Você tá contratando como pessoa física ou tem uma empresa?',
        description: 'Só pra gente saber se vai usar CPF ou CNPJ',
        options: [
            {
                value: 'physical',
                label: '👤 Pessoa Física',
                description: 'To contratando no meu nome mesmo'
            },
            {
                value: 'legal',
                label: '🏢 Pessoa Jurídica',
                description: 'To contratando pelo CNPJ da empresa'
            }
        ]
    },
    {
        id: 'contractor_document',
        type: 'text',
        title: 'Beleza! Qual seu CPF ou CNPJ?',
        description: 'Só os números, que a gente formata pra você',
        placeholder: 'Ex: 12345678900 ou 12345678000190',
        helpText: 'Pode ficar tranquilo, seus dados estão seguros conosco 🔒'
    },
    {
        id: 'service_provider_name',
        type: 'text',
        title: 'Agora, quem vai te ajudar com o serviço?',
        description: 'Qual o nome da pessoa ou empresa que vai trabalhar com você',
        placeholder: 'Ex: Maria Santos ou Tech Solutions LTDA'
    },
    {
        id: 'service_description',
        type: 'textarea',
        title: 'Me explica direitinho: o que essa pessoa/empresa vai fazer pra você?',
        description: 'Descreve com suas palavras o serviço que você precisa',
        placeholder: 'Ex: Preciso que desenvolva um aplicativo pro meu negócio, incluindo design e programação...',
        helpText: 'Quanto mais detalhes você der, melhor vai ficar o contrato! ✨'
    },
    {
        id: 'service_value',
        type: 'text',
        title: 'Show! E qual o combinado sobre o valor?',
        description: 'Pode ser um valor fixo, por hora, ou outra forma que acertaram',
        placeholder: 'Ex: R$ 5.000,00 ou R$ 100,00 por hora',
        helpText: 'Se combinou parcelado, pode colocar aqui também 💰'
    },
    {
        id: 'payment_method',
        type: 'radio',
        title: 'Como vocês vão fazer os pagamentos?',
        options: [
            {
                value: 'single',
                label: '💵 Pagamento único',
                description: 'Vou pagar tudo de uma vez'
            },
            {
                value: 'installments',
                label: '📅 Parcelado',
                description: 'Vou dividir em várias vezes'
            },
            {
                value: 'hourly',
                label: '⏰ Por hora trabalhada',
                description: 'Vou pagar conforme as horas'
            },
            {
                value: 'milestone',
                label: '🎯 Por etapa',
                description: 'Vou pagar conforme for entregando'
            }
        ]
    },
    {
        id: 'deadline',
        type: 'text',
        title: 'E tem um prazo em mente?',
        description: 'Quando você espera que tudo esteja pronto?',
        placeholder: 'Ex: em 30 dias ou até 31/12/2024',
        helpText: 'Pode ser em dias, meses ou uma data específica 📅'
    },
    {
        id: 'confidentiality',
        type: 'radio',
        title: 'Tem alguma informação secreta envolvida? 🤫',
        description: 'Algo que não pode vazar pra concorrência, por exemplo',
        options: [
            {
                value: 'yes',
                label: 'Sim, tem segredinhos',
                description: 'Quero uma cláusula de confidencialidade'
            },
            {
                value: 'no',
                label: 'Não, tudo tranquilo',
                description: 'Não precisa de nada especial'
            }
        ]
    },
    {
        id: 'jurisdiction',
        type: 'text',
        title: 'Última pergunta! Se der algum pepino, onde resolve?',
        description: 'Geralmente é a cidade onde você mora/trabalha',
        placeholder: 'Ex: São Paulo/SP',
        helpText: 'Isso é padrão em todo contrato, fica tranquilo! ⚖️'
    },
    {
        id: 'anything_else',
        type: 'textarea',
        title: 'Antes de gerar seu contrato, tem mais alguma coisa que quer incluir?',
        description: 'Algum detalhe especial que a gente não conversou ainda?',
        placeholder: 'Ex: Quero que inclua que o prestador vai dar suporte por 3 meses após a entrega...',
        helpText: 'Se não tiver nada, pode pular essa! 😉'
    }
];