/** Linhas de item do relatório de vendas: rateio de valores e as colunas de cada linha. */
import {
  ORDER_STATUS_LABEL as STATUS_LABEL,
  PAYMENT_METHOD_LABEL as METODO_LABEL,
  SERVICE_TYPE_LABEL as SERVICO_LABEL,
} from '@/constants/labels';
import type { Customer } from '@/types/customers';
import type { Enrollment } from '@/types/enrollments';
import type { Order } from '@/types/orders';
import { formatDocument as formatDocumento } from '@/utils/format';
import type { ReportProduct } from './salesReport';
import { syntheticTransactionId } from './salesReportSynthetic';

/**
 * Rateia `amount` entre as linhas proporcionalmente aos pesos (valor bruto de cada item), em centavos:
 * as N−1 primeiras cotas são arredondadas e a ÚLTIMA recebe o resíduo (achado M-2), então
 * `Σ cotas === amount` exatamente — R$ 10 em 3 itens iguais dá 3,33 + 3,33 + 3,34.
 * Sem base de rateio (pesos zerados), tudo vai para a última linha.
 */
export function prorate(amount: number, weights: number[]): number[] {
  const totalCents = Math.round(amount * 100);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const last = weights.length - 1;
  if (totalWeight <= 0) return weights.map((_, i) => (i === last ? totalCents / 100 : 0));
  let accumulated = 0;
  return weights.map((w, i) => {
    if (i === last) return (totalCents - accumulated) / 100;
    const cent = Math.round(totalCents * (w / totalWeight));
    accumulated += cent;
    return cent / 100;
  });
}

const BILLING_LABEL = { paying: 'Pagante', account_holder: 'Correntista-Mensalista', exempt: 'Isento' } as const;

interface LineArgs {
  p: Order;
  customer: Customer | undefined;
  item: ReportProduct;
  quantity: number;
  lineAmount: number;
  lineDiscount: number;
  students: Enrollment[];
  origin: string;
}

/** As colunas de uma linha de item do pedido, na ordem de `CSV_HEADER`. */
export function orderLineCells({ p, customer, item, quantity, lineAmount, lineDiscount, students, origin }: LineArgs) {
  const hasOpenCredit = students.some((m) => m.status === 'pending');
  const linkedPerson = students[0];
  return [
    p.reference || p.id,
    customer?.email ?? '',
    p.createdAt,
    p.status === 'refunded' ? 'Cancelado' : 'Confirmado',
    STATUS_LABEL[p.status],
    'BRL',
    // Subtotal = valor da line antes do desconto; Total = depois.
    Math.round((lineAmount + lineDiscount) * 100) / 100,
    lineDiscount,
    lineAmount,
    customer?.name ?? '',
    customer ? formatDocumento(customer.document) : '',
    customer?.phone ?? '',
    METODO_LABEL[p.method],
    p.couponCode ?? '',
    p.paidAt ?? '',
    item.title,
    item.price,
    quantity,
    'sapCode' in item ? (item.sapCode ?? '') : '',
    syntheticTransactionId(p.id),
    p.canceledAt ?? '',
    p.cancellationReason ?? '',
    p.status === 'refunded' ? 'Sim' : 'Não',
    p.status === 'refunded' ? (p.canceledAt ?? '') : '',
    '',
    1,
    '',
    lineAmount,
    METODO_LABEL[p.method],
    `${origin}/pedidos?pedido=${p.id}`,
    customer?.billingTag ? BILLING_LABEL[customer.billingTag] : 'Pagante',
    SERVICO_LABEL[p.serviceType ?? 'training'],
    hasOpenCredit ? 'Sim' : 'Não',
    linkedPerson
      ? `${linkedPerson.personName}, ${formatDocumento(linkedPerson.personCpf)}, ${linkedPerson.personEmail}`
      : '',
    linkedPerson?.updatedAt ?? linkedPerson?.createdAt ?? '',
    linkedPerson ? '12 meses' : '',
  ];
}
