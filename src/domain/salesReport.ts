/**
 * Geração do relatório de vendas (CSV) da tela de Pedidos do admin.
 *
 * Código puro: recebe os pedidos já filtrados e funções de lookup, devolve a
 * string do CSV. O download em si está isolado em `baixarCsv`, para que a
 * geração possa ser testada sem DOM.
 */
import type { Customer } from '@/types/customers';
import type { Enrollment } from '@/types/enrollments';
import type { Order } from '@/types/orders';

/** Escapa um campo para CSV com separador `;`. */
export const csvField = (v: string | number | null | undefined) => {
  const s = v === null || v === undefined ? '' : String(v);
  if (/[;"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

export const CSV_HEADER = [
  'Número do Pedido',
  'E-mail',
  'Data',
  'Status do Pedido',
  'Status do Pagamento',
  'Moeda',
  'Subtotal',
  'Desconto',
  'Total',
  'Nome do comprador',
  'CPF / CNPJ',
  'Telefone',
  'Forma de Pagamento',
  'Cupom de Desconto',
  'Data de pagamento',
  'Nome do Produto',
  'Valor do Produto',
  'Quantidade Comprada',
  'SKU (código SAP)',
  'Identificador da transação no meio de pagamento',
  'Data e hora do cancelamento',
  'Motivo do cancelamento',
  'Estorno',
  'Data de estorno',
  'Taxas',
  'Parcelas',
  'Juros',
  'Total líquido',
  'Meio de pagamento',
  'Link do pedido',
  'Tipo de cliente (Pagante / Correntista-Mensalista / Isento)',
  'Tipo de serviço (Treinamento / Credenciamento / Sala VIP)',
  'Créditos em aberto',
  'Pessoa vinculada (nome, CPF, e-mail)',
  'Data da vinculação',
  'Validade do crédito',
];

/** Produto (curso) como o relatório precisa enxergar — `CursoCompleto` satisfaz. */
export interface ReportProduct {
  id: string;
  title: string;
  price: number;
  sapCode?: string;
}

export { syntheticReportRows, syntheticTransactionId } from './salesReportSynthetic';
import { orderLineCells, prorate } from './salesReportLines';
import { syntheticReportRows } from './salesReportSynthetic';

export { prorate } from './salesReportLines';

export interface SalesReportArgs {
  /** Pedidos já filtrados pela tela, na ordem exibida. */
  orders: Order[];
  customerOf: (id: string) => Customer | undefined;
  coursesOfOrder: (p: Order) => ReportProduct[];
  studentsOfOrder: (p: Order) => Enrollment[];
  /** `window.location.origin` — recebido de fora para manter a função pura. */
  origin: string;
  syntheticRows: ReturnType<typeof syntheticReportRows>;
}

/** Monta o conteúdo completo do CSV (cabeçalho + pedidos + linhas sintéticas). */
export function buildSalesReportCsv({
  orders,
  customerOf,
  coursesOfOrder,
  studentsOfOrder,
  origin,
  syntheticRows,
}: SalesReportArgs): string {
  const orderLines: string[] = [];

  orders.forEach((p) => {
    const customer = customerOf(p.customerId);
    const items = coursesOfOrder(p);
    const students = studentsOfOrder(p);
    const products: ReportProduct[] = items.length > 0 ? items : [{ title: p.description, price: p.amount, id: p.id }];

    /**
     * Valor e desconto de cada line.
     *
     * Antes, Subtotal/Total/Total líquido recebiam `p.valor` (o total do
     * PEDIDO INTEIRO) em TODAS as linhas de item: num pedido de 2 itens,
     * somar a coluna Total no Excel contabilizava o dobro da receita. A line
     * passou a carregar o valor do ITEM.
     *
     * Semântica fixada no achado M-1 do quinto review: **`p.valor` é o valor
     * LÍQUIDO do pedido** (o que o cliente efetivamente pagou — é o campo que
     * as telas exibem como total e que `descontoAplicado` já descontou, ver
     * `Pagamento` em src/types/index.ts). Logo:
     *
     * - `Total` / `Total líquido` da line = cota de `p.valor`;
     * - `Desconto` da line = cota de `p.descontoAplicado`;
     * - `Subtotal` da line = `Total + Desconto` (valor bruto da line).
     *
     * Invariantes garantidas: `Σ Total === p.valor` e
     * `Σ Desconto === p.descontoAplicado`, exatamente, para qualquer número
     * de itens — antes só valiam por coincidência, com desconto zero e
     * `precoUnitario × quantidade` somando `p.valor`.

     *
     * O rateio (centavos, resíduo na última linha) está em `prorate`.
     */
    const orderItemOf = (produtoId: string) => p.items.find((i) => i.courseId === produtoId);
    const weights = products.map((product) => {
      const ip = orderItemOf(product.id);
      return ip ? ip.unitPrice * ip.quantity : product.price;
    });
    const orderDiscount = p.discountAmount ?? 0;
    const lineAmounts = prorate(p.amount, weights);
    const lineDiscounts = orderDiscount > 0 ? prorate(orderDiscount, weights) : products.map(() => 0);

    products.forEach((item, idx) => {
      const orderItem = orderItemOf(item.id);
      const quantity = orderItem?.quantity ?? 1;
      const lineAmount = lineAmounts[idx] ?? 0;
      const lineDiscount = lineDiscounts[idx] ?? 0;
      const line = orderLineCells({ p, customer, item, quantity, lineAmount, lineDiscount, students, origin });
      orderLines.push(line.map(csvField).join(';'));
    });
  });

  const extraLines = syntheticRows.map((l) =>
    [
      l.numero,
      l.email,
      l.data,
      l.statusPedido,
      l.statusPagamento,
      'BRL',
      l.subtotal,
      l.desconto,
      l.total,
      l.nomeComprador,
      l.document,
      l.phone,
      l.method,
      l.cupom,
      l.dataPagamento,
      l.produto,
      l.valorProduto,
      l.quantity,
      l.sku,
      l.transacaoId,
      l.canceledAt,
      l.cancellationReason,
      l.estorno,
      l.dataEstorno,
      l.taxas,
      l.parcelas,
      l.juros,
      l.totalLiquido,
      l.method,
      `${origin}/pedidos?pedido=${l.numero}`,
      l.tipoCliente,
      l.serviceType,
      l.creditoAberto,
      l.pessoaVinculada,
      l.dataVinculacao,
      l.validadeCredito,
    ]
      .map(csvField)
      .join(';'),
  );

  return [CSV_HEADER.join(';'), ...orderLines, ...extraLines].join('\n');
}
