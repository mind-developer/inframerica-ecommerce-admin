/**
 * Dados sintéticos do relatório de vendas: id de transação derivado e linhas extras de demonstração.
 * Separado de `salesReport.ts` para manter o gerador do CSV enxuto.
 */
import {
  ORDER_STATUS_LABEL as STATUS_LABEL,
  PAYMENT_METHOD_LABEL as METODO_LABEL,
  SERVICE_TYPE_LABEL as SERVICO_LABEL,
} from '@/constants/labels';
import type { Order } from '@/types/orders';

/**
 * Identificador da transação no meio de pagamento.
 *
 * `Pagamento` não tem campo de transação (o mock não fala com adquirente
 * nenhum). Antes a coluna repetia `p.referencia`, que já é o "Número do
 * Pedido": duas colunas semanticamente diferentes com valor idêntico, o que no
 * BI parece um dado real. Aqui é derivado do id, de forma determinística e
 * visivelmente sintética — continua sendo um substituto, mas não se disfarça
 * de número de transação do pedido.
 */
export const syntheticTransactionId = (orderId: string): string => {
  let h = 0;
  for (let i = 0; i < orderId.length; i++) h = (h * 31 + orderId.charCodeAt(i)) >>> 0;
  return `TXN-SINT-${h.toString(36).toUpperCase().padStart(7, '0')}`;
};

/**
 * Linhas sintéticas adicionais em memória, só para que o relatório tenha
 * volume plausível de demonstração (casos cancelados, correntistas e
 * isentos). Não tocam em AdminContext nem em nenhum outro estado real.
 */
export function syntheticReportRows() {
  const fakeNames = [
    'Transporte Aéreo Rio',
    'Estrela Handling',
    'Comércio Aeroportuário DF',
    'Órgão Regulador Federal',
    'Serviços Gerais BSB',
    'VIP Lounge Partners',
    'Cessionária Pátio Sul',
    'Manutenção de Pistas Ltda',
    'Segurança Patrimonial BSB',
    'Catering Aeroportuário',
  ];
  const customerTypes: Array<'Pagante' | 'Correntista-Mensalista' | 'Isento'> = [
    'Pagante',
    'Correntista-Mensalista',
    'Isento',
  ];
  const services: Array<keyof typeof SERVICO_LABEL> = ['training', 'credentialing', 'vip_lounge'];
  const statuses: Array<Order['status']> = ['paid', 'pending', 'failed', 'refunded'];

  return fakeNames.map((name, i) => {
    const amount = 800 + i * 215;
    const st = statuses[i % statuses.length]!;
    const baseDate = new Date(2026, 2 + (i % 4), 5 + i);
    const isoDate = baseDate.toISOString();
    return {
      numero: `SINT-${String(1000 + i)}`,
      email: `contato${i}@${name.toLowerCase().replace(/[^a-z]+/g, '')}.com.br`,
      data: isoDate,
      statusPedido: st === 'refunded' ? 'Cancelado' : 'Confirmado',
      statusPagamento: STATUS_LABEL[st],
      subtotal: amount,
      desconto: i % 3 === 0 ? Math.round(amount * 0.1) : 0,
      total: i % 3 === 0 ? Math.round(amount * 0.9) : amount,
      nomeComprador: name,
      document: `${String(10000000000 + i * 37).slice(0, 14)}`,
      phone: `+55 61 9${String(80000000 + i * 111).slice(0, 8)}`,
      method: METODO_LABEL[(['pix', 'card', 'bank_slip', 'transfer'] as const)[i % 4]!],
      cupom: i % 4 === 0 ? 'BEMVINDO10' : '',
      dataPagamento: st === 'paid' ? isoDate : '',
      produto: ['Conscientização AVSEC', 'Direção Defensiva', 'Equipamentos SITA', 'Sala VIP Executiva'][i % 4],
      valorProduto: amount,
      quantity: 1 + (i % 3),
      sku: `SAP-${3000 + i}`,
      transacaoId: `TXN-${90000 + i}`,
      canceledAt: st === 'refunded' ? isoDate : '',
      cancellationReason: st === 'refunded' ? 'Solicitação do cliente' : '',
      estorno: st === 'refunded' ? 'Sim' : 'Não',
      dataEstorno: st === 'refunded' ? isoDate : '',
      taxas: Math.round(amount * 0.02),
      parcelas: 1 + (i % 6),
      juros: i % 5 === 0 ? Math.round(amount * 0.015) : 0,
      totalLiquido: Math.round(amount * 0.95),
      tipoCliente: customerTypes[i % customerTypes.length]!,
      serviceType: SERVICO_LABEL[services[i % services.length]!],
      creditoAberto: i % 2 === 0 ? 'Sim' : 'Não',
      pessoaVinculada: i % 2 === 0 ? '' : `Colaborador ${i} — CPF 000.000.00${i % 10}-00 — colaborador${i}@email.com`,
      dataVinculacao: i % 2 === 0 ? '' : isoDate,
      validadeCredito: i % 2 === 0 ? '' : '12 meses',
    };
  });
}
