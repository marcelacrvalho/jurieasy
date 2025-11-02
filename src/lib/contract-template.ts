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
    const contractorType = isPhysicalPerson ? 'pessoa física' : 'pessoa jurídica';
    const documentType = isPhysicalPerson ? 'CPF' : 'CNPJ';

    return `
DAS PARTES

CONTRATADA: ${data.service_provider_name || '[NOME DA CONTRATADA]'}, pessoa jurídica de direito privado, inscrita no CNPJ n° [CNPJ DA CONTRATADA], com sede em [ENDEREÇO DA CONTRATADA], doravante denominado CONTRATADA e neste ato representada na forma de seus atos constitutivos, por seu representante legal [REPRESENTANTE LEGAL], [NACIONALIDADE], [ESTADO CIVIL], [PROFISSÃO], portador do Documento de Identidade RG nº. [RG DO REPRESENTANTE], inscrito no CPF sob o nº. [CPF DO REPRESENTANTE], residente e domiciliado em [ENDEREÇO DO REPRESENTANTE], e;

CONTRATANTE: ${data.contractor_name || '[NOME DO CONTRATANTE]'}, ${contractorType} de direito privado, inscrita no ${documentType} n° ${data.contractor_document || '[NÚMERO DO DOCUMENTO]'}, com sede em [ENDEREÇO DO CONTRATANTE], doravante denominado CONTRATANTE e neste ato representada na forma de seus atos constitutivos, por seu representante legal [REPRESENTANTE LEGAL], [NACIONALIDADE], [ESTADO CIVIL], [PROFISSÃO], portador do Documento de Identidade RG nº. [RG DO REPRESENTANTE], inscrito no CPF sob o nº. [CPF DO REPRESENTANTE], residente e domiciliado em [ENDEREÇO DO REPRESENTANTE].

Decidem as partes, na melhor forma de direito, celebrar o presente CONTRATO DE PRESTAÇÃO DE SERVIÇOS, que reger-se-á mediante as cláusulas e condições adiante estipuladas. 

CLÁUSULA PRIMEIRA - DO OBJETO

1.1 O presente contrato tem por objeto a prestação de serviços profissionais especializados em ${data.service_description || '[DESCRIÇÃO DOS SERVIÇOS]'} por parte da CONTRATADA de acordo com os termos e condições detalhados neste contrato.

CLÁUSULA SEGUNDA - OBRIGAÇÕES DA CONTRATANTE

2.1 A CONTRATANTE deverá fornecer à CONTRATADA todas as informações necessárias à realização do serviço, devendo especificar os detalhes necessários à perfeita consecução do mesmo.

2.2 A CONTRATANTE é obrigada ainda a disponibilizar:  
[RECURSOS NECESSÁRIOS]

2.3 A CONTRATANTE deverá efetuar o pagamento na forma e condições estabelecidas na cláusula quinta.

CLÁUSULA TERCEIRA - OBRIGAÇÕES DA CONTRATADA

3.1 A CONTRATADA deverá prestar os serviços de ${data.service_description || '[DESCRIÇÃO DOS SERVIÇOS]'}.

3.2 A CONTRATADA se obriga a manter absoluto sigilo sobre as operações, dados, estratégias, materiais, informações e documentos da CONTRATANTE, mesmo após a conclusão dos serviços ou do término da relação contratual.

3.3 Os contratos, informações, dados, materiais e documentos inerentes à CONTRATANTE ou a seus clientes deverão ser utilizados, pela CONTRATADA, por seus funcionários ou contratados, estritamente para cumprimento dos serviços solicitados pela CONTRATANTE, sendo VEDADO a comercialização ou utilização para outros fins. 

3.4 Será de responsabilidade da CONTRATADA todo o ônus trabalhista ou tributário referente aos funcionários utilizados para a prestação do serviço objeto deste instrumento, ficando a CONTRATANTE isenta de qualquer obrigação em relação a eles.

3.5 A CONTRATADA deverá fornecer os respectivos documentos fiscais, referente ao(s) pagamento(s) do presente instrumento.

CLÁUSULA QUARTA - DOS SERVIÇOS

4.1 A CONTRATADA prestará os serviços contratados para fins de ${data.service_description || '[FINALIDADE DOS SERVIÇOS]'}.

4.2 Os serviços terão início em [NÚMERO] dias corridos da assinatura do presente contrato, com prazo para término de ${data.deadline || '[PRAZO DE CONCLUSÃO]'}.

CLÁUSULA QUINTA - DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO

5.1 Pelo objeto deste contrato, a CONTRATANTE pagará à CONTRATADA o valor total de ${data.service_value || '[VALOR DO SERVIÇO]'}, que será pago da seguinte forma:
${getPaymentMethodText(data.payment_method)}

CLÁUSULA SEXTA - DO DESCUMPRIMENTO

6.1 O descumprimento de qualquer uma das cláusulas por qualquer parte, implicará na rescisão imediata deste contrato, não isentando a CONTRATADA de suas responsabilidades referentes ao zelo com informações e dados da CONTRATANTE.

6.2 Havendo descumprimento deste contrato, será devida multa de [PERCENTUAL]% sobre o valor do contrato.

CLÁUSULA SÉTIMA - DO PRAZO E VALIDADE

7.1 A CONTRATADA deverá realizar os serviços dentro dos prazos determinados no cronograma previsto no ANEXO I, sendo sua responsabilidade comunicar a impossibilidade de cumprimento, bem como os motivos para tal e o novo prazo previsto, estando em sua competência a capacidade para tal avaliação.

7.2 Este instrumento é válido por prazo indeterminado, vigendo até a finalização do serviço, ora contratado, ou encerramento do contrato, não ficando as partes isentas de seus compromissos éticos após invalidação do mesmo.

CLÁUSULA OITAVA - DA RESCISÃO IMOTIVADA

8.1 Poderá o presente instrumento ser rescindido por qualquer das partes, em qualquer momento, sem que haja qualquer tipo de motivo relevante, respeitando-se um período mínimo de [DIAS] dias, devendo então somente ser finalizadas e pagas as etapas que já estiverem em andamento.

CLÁUSULA NONA - DA OBSERVÂNCIA À LGPD

9.1 O CONTRATANTE declara expresso CONSENTIMENTO que a CONTRATADA irá coletar, tratar e compartilhar os dados necessários ao cumprimento do contrato, nos termos do Art. 7º, inc. V da LGPD, os dados necessários para cumprimento de obrigações legais, nos termos do Art. 7º, inc. II da LGPD, bem como os dados, se necessários para proteção ao crédito, conforme autorizado pelo Art. 7º, inc. V da LGPD.

9.2 Outros dados poderão ser coletados, conforme termo de consentimento específico.

CLÁUSULA DÉCIMA - DAS DISPOSIÇÕES GERAIS

10.1 Fica pactuada a total inexistência de vínculo trabalhista entre as partes, excluindo as obrigações previdenciárias e os encargos sociais, não havendo entre CONTRATADA e CONTRATANTE qualquer tipo de relação de subordinação. 

10.2 A contratação da CONTRATADA, cumpridas todas as formalidades legais, com ou sem exclusividade, de forma contínua ou não, afasta a qualidade de empregado prevista no art. 3º da CLT, nos termos do art. 442-B da CLT. 

10.3 A tolerância, por qualquer das partes, com relação ao descumprimento de qualquer termo ou condição aqui ajustado, não será considerada como desistência em exigir o cumprimento de disposição nele contida, nem representará novação com relação à obrigação passada, presente ou futura, no tocante ao termo ou condição cujo descumprimento foi tolerado.

CLÁUSULA DÉCIMA PRIMEIRA - DO FORO

11.1 Para dirimir quaisquer controvérsias oriundas do presente contrato, as partes elegem o foro da Comarca de ${data.jurisdiction || '[COMARCA]'} do Estado de [ESTADO].

${data.anything_else ? `CLÁUSULA DÉCIMA SEGUNDA - DISPOSIÇÕES ADICIONAIS\n\n12.1 ${data.anything_else}` : ''}

Por estarem assim justos e de acordo, firmam o presente instrumento, em duas vias de igual teor, juntamente com 2 (duas) testemunhas.

${getCurrentDate()}










TESTEMUNHAS:

1. ___________________________________________________
   Nome: [NOME DA TESTEMUNHA 1]
   RG: [RG DA TESTEMUNHA 1]
   CPF: [CPF DA TESTEMUNHA 1]

2. ___________________________________________________
   Nome: [NOME DA TESTEMUNHA 2]
   RG: [RG DA TESTEMUNHA 2]
   CPF: [CPF DA TESTEMUNHA 2]

ANEXOS:
ANEXO I - Especificação dos Serviços e Cronograma
  `.trim();
};

const getPaymentMethodText = (paymentMethod: string): string => {
    switch (paymentMethod) {
        case 'single':
            return '- Pagamento único no valor total à vista';
        case 'installments':
            return '- Parcelado em [NÚMERO] parcelas de R$ [VALOR]';
        case 'hourly':
            return '- Por hora trabalhada, ao valor de R$ [VALOR] por hora';
        case 'milestone':
            return '- Por etapa/marco de entrega, conforme cronograma do ANEXO I';
        default:
            return '- [FORMA DE PAGAMENTO A SER DEFINIDA]';
    }
};

const getCurrentDate = (): string => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    };
    return now.toLocaleDateString('pt-BR', options);
};