export interface ContractData {
    contractor_name: string;
    contractor_type: string;
    contractor_document: string;
    service_provider_name: string;
    service_description: string;
    service_value: string;
    payment_method: string;
    deadline: string;
    confidentiality: string;
    jurisdiction: string;
    anything_else?: string;
}

export const generateContractText = (data: ContractData): string => {
    const isPhysicalPerson = data.contractor_type === 'physical';
    const documentType = isPhysicalPerson ? 'CPF' : 'CNPJ';
    const personType = isPhysicalPerson ? 'pessoa física' : 'pessoa jurídica';

    const paymentMethodText = getPaymentMethodText(data.payment_method);
    const confidentialityText = data.confidentiality === 'yes'
        ? `\n3.2 A CONTRATADA se obriga a manter absoluto sigilo sobre as operações, dados, estratégias, materiais, informações e documentos da CONTRATANTE, mesmo após a conclusão dos serviços ou do término da relação contratual.`
        : '';

    return `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS

DAS PARTES

CONTRATADA: ${data.service_provider_name}, pessoa jurídica de direito privado, inscrita no CNPJ n° [CNPJ DA CONTRATADA], com sede em [ENDEREÇO DA CONTRATADA], doravante denominada CONTRATADA.

CONTRATANTE: ${data.contractor_name}, ${personType} de direito privado, inscrita no ${documentType} n° ${data.contractor_document}, com sede em [ENDEREÇO DO CONTRATANTE], doravante denominada CONTRATANTE.

As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas seguintes:

CLÁUSULA PRIMEIRA - DO OBJETO

1.1. O presente contrato tem por objeto a prestação de serviços de ${data.service_description} pela CONTRATADA em favor da CONTRATANTE.

CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES DA CONTRATADA

2.1. A CONTRATADA obriga-se a executar os serviços objeto deste contrato com toda a diligência, capacidade e eficiência, observando as normas técnicas aplicáveis.

2.2. A CONTRATADA responderá pelos danos que causar à CONTRATANTE, em virtude de culpa ou dolo na execução dos serviços.${confidentialityText}

CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DA CONTRATANTE

3.1. A CONTRATANTE obriga-se a fornecer todas as informações necessárias à perfeita execução dos serviços.

3.2. A CONTRATANTE deverá efetuar o pagamento dos serviços na forma estabelecida na Cláusula Quarta.

CLÁUSULA QUARTA - DO VALOR E FORMA DE PAGAMENTO

4.1. Pela execução dos serviços objeto deste contrato, a CONTRATANTE pagará à CONTRATADA o valor de ${data.service_value}.

4.2. O pagamento será realizado da seguinte forma: ${paymentMethodText}

CLÁUSULA QUINTA - DO PRAZO

5.1. Os serviços serão executados no prazo de ${data.deadline}, contados a partir da assinatura deste instrumento.

CLÁUSULA SEXTA - DA RESCISÃO

6.1. O presente contrato poderá ser rescindido por qualquer das partes, mediante aviso prévio de 30 (trinta) dias.

6.2. Em caso de descumprimento de qualquer obrigação aqui estabelecida, a parte inadimplente pagará à outra multa contratual no valor de 10% (dez por cento) do valor total do contrato.

CLÁUSULA SÉTIMA - DO FORO

7.1. Para dirimir quaisquer controvérsias oriundas deste contrato, as partes elegem o foro da comarca de ${data.jurisdiction}.

${data.anything_else ? `
CLÁUSULA OITAVA - DAS DISPOSIÇÕES GERAIS

8.1. ${data.anything_else}
` : ''}

E, por estarem assim justas e contratadas, firmam o presente instrumento em duas vias de igual teor e forma, para um só efeito.

${getCurrentDate()}

_________________________________________________
${data.service_provider_name}
CONTRATADA

_________________________________________________
${data.contractor_name}
CONTRATANTE

Testemunhas:

1. _________________________________________________
   Nome: [NOME DA TESTEMUNHA 1]
   RG: [RG DA TESTEMUNHA 1]
   CPF: [CPF DA TESTEMUNHA 1]

2. _________________________________________________
   Nome: [NOME DA TESTEMUNHA 2]
   RG: [RG DA TESTEMUNHA 2]
   CPF: [CPF DA TESTEMUNHA 2]
`.trim();
};

const getPaymentMethodText = (paymentMethod: string): string => {
    switch (paymentMethod) {
        case 'single':
            return 'Pagamento único à vista';
        case 'installments':
            return 'Parcelado em até 12x';
        case 'hourly':
            return 'Por hora trabalhada';
        case 'milestone':
            return 'Por etapa/marco de entrega';
        default:
            return 'A combinar entre as partes';
    }
};

const getCurrentDate = (): string => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};