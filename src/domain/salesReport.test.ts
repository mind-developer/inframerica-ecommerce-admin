/**
 * Testes da parte pura do relatório de vendas: `csvField`, `CSV_HEADER` e
 * `gerarCsvRelatorioPedidos`.
 *
 * O download (`baixarCsv` / `exportarRelatorioPedidos`) NÃO é testado aqui: ele
 * delega para `downloadCsvFile` em `lib/browser`, que depende de Blob/URL e
 * `document.createElement("a")`. A geração da string é a responsabilidade com
 * regra de negócio e é o que este arquivo cobre.
 */
import type { Customer } from '@/types/customers';
import type { Enrollment } from '@/types/enrollments';
import type { Order } from '@/types/orders';
import {
  CSV_HEADER,
  csvField,
  buildSalesReportCsv,
  syntheticReportRows,
  syntheticTransactionId,
  type ReportProduct,
} from './salesReport';

const ORIGIN = 'https://inframerica.test';

const customer = (over: Partial<Customer> = {}): Customer => ({
  id: 'cli-1',
  name: 'Transporte Aéreo Rio',
  email: 'financeiro@tar.com.br',
  phone: '+55 61 99999-0000',
  company: 'TAR',
  document: '12345678000199',
  sectorId: null,
  createdAt: '2026-01-10',
  billingTag: 'paying',
  ...over,
});

const order = (over: Partial<Order> = {}): Order => ({
  id: 'pag-1',
  customerId: 'cli-1',
  description: 'Curso de Conscientização AVSEC',
  amount: 500,
  method: 'pix',
  status: 'paid',
  reference: 'PED-0001',
  createdAt: '2026-03-01T10:00:00.000Z',
  paidAt: '2026-03-01T10:05:00.000Z',
  serviceType: 'training',
  items: [],
  ...over,
});

const enrollment = (over: Partial<Enrollment> = {}): Enrollment => ({
  id: 'mat-1',
  personId: 'pes-1',
  personName: 'Maria Souza',
  personCpf: '12345678901',
  personEmail: 'maria@tar.com.br',
  customerName: 'Transporte Aéreo Rio',
  concessionaireId: null,
  concessionaireName: '',
  courseId: 'cur-1',
  courseTitle: 'AVSEC',
  cohortId: 'tur-1',
  status: 'enrolled',
  completedAt: null,
  createdAt: '2026-03-01T10:00:00.000Z',
  updatedAt: '2026-03-02T10:00:00.000Z',
  ...over,
});

/** Gera o CSV sem linhas sintéticas, para que só o que o teste passou apareça. */
const build = (over: Partial<Parameters<typeof buildSalesReportCsv>[0]> = {}) =>
  buildSalesReportCsv({
    orders: [],
    customerOf: () => customer(),
    coursesOfOrder: () => [],
    studentsOfOrder: () => [],
    origin: ORIGIN,
    syntheticRows: [],
    ...over,
  });

/** Divide uma linha de CSV respeitando campos entre aspas. */
const splitCsvLine = (linha: string): string[] => {
  const campos: string[] = [];
  let atual = '';
  let dentroDeAspas = false;
  for (let i = 0; i < linha.length; i++) {
    const c = linha[i];
    if (dentroDeAspas) {
      if (c === '"' && linha[i + 1] === '"') {
        atual += '"';
        i++;
      } else if (c === '"') {
        dentroDeAspas = false;
      } else {
        atual += c;
      }
    } else if (c === '"') {
      dentroDeAspas = true;
    } else if (c === ';') {
      campos.push(atual);
      atual = '';
    } else {
      atual += c;
    }
  }
  campos.push(atual);
  return campos;
};

const col = (name: string) => CSV_HEADER.indexOf(name);

/* --------------------------------- csvField -------------------------------- */

describe('csvField — escapamento', () => {
  it('devolve string vazia para null e undefined', () => {
    expect(csvField(null)).toBe('');
    expect(csvField(undefined)).toBe('');
  });

  it('devolve o valor cru quando não há caractere especial', () => {
    expect(csvField('AVSEC')).toBe('AVSEC');
    expect(csvField('sala, vip')).toBe('sala, vip'); // vírgula não é o separador
  });

  it('converte número para string sem aspas', () => {
    expect(csvField(1500)).toBe('1500');
    expect(csvField(0)).toBe('0');
    expect(csvField(-12.5)).toBe('-12.5');
  });

  it('envolve em aspas quando o campo contém o separador `;`', () => {
    expect(csvField('Curso A; Curso B')).toBe('"Curso A; Curso B"');
  });

  it('envolve em aspas e duplica aspas internas', () => {
    expect(csvField('Curso "Avançado"')).toBe('"Curso ""Avançado"""');
  });

  it('envolve em aspas quando o campo contém quebra de linha', () => {
    expect(csvField('linha1\nlinha2')).toBe('"linha1\nlinha2"');
  });

  it('escapa campo com separador, aspas e quebra de linha juntos', () => {
    expect(csvField('a;b"c\nd')).toBe('"a;b""c\nd"');
  });

  it('um campo escapado sobrevive ao round-trip do parser de CSV', () => {
    const amount = 'Curso "X"; com ; e\nquebra';
    expect(splitCsvLine(csvField(amount))).toEqual([amount]);
  });
});

/* -------------------------------- cabeçalho -------------------------------- */

describe('CSV_HEADER', () => {
  it('tem 36 colunas, sem nomes duplicados', () => {
    expect(CSV_HEADER).toHaveLength(36);
    expect(new Set(CSV_HEADER).size).toBe(36);
  });

  it('é a primeira linha do CSV, separada por `;`', () => {
    const csv = build();
    expect(csv.split('\n')[0]).toBe(CSV_HEADER.join(';'));
  });

  it('CSV sem pedidos nem linhas sintéticas é só o cabeçalho', () => {
    expect(build().split('\n')).toHaveLength(1);
  });

  it('cada coluna do cabeçalho tem um campo correspondente na linha do pedido', () => {
    const csv = build({ orders: [order()] });
    const linha = splitCsvLine(csv.split('\n')[1]!);
    expect(linha).toHaveLength(CSV_HEADER.length);
  });

  it('os nomes de coluna usados pelos testes existem no cabeçalho', () => {
    for (const name of [
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
      'Forma de Pagamento',
      'Cupom de Desconto',
      'Nome do Produto',
      'Valor do Produto',
      'Quantidade Comprada',
      'SKU (código SAP)',
      'Link do pedido',
      'Estorno',
    ]) {
      expect(col(name)).toBeGreaterThanOrEqual(0);
    }
  });
});

/* ------------------------------ linha de pedido ---------------------------- */

describe('gerarCsvRelatorioPedidos — pedido com itens', () => {
  const items: ReportProduct[] = [
    { id: 'cur-1', title: 'Conscientização AVSEC', price: 300, sapCode: 'SAP-1' },
    { id: 'cur-2', title: 'Direção Defensiva', price: 200 },
  ];

  it('emite uma linha por item do pedido', () => {
    const csv = build({ orders: [order()], coursesOfOrder: () => items });
    expect(csv.split('\n')).toHaveLength(3); // cabeçalho + 2 itens
  });

  it('usa title/price/codigoSap do item nas colunas de produto', () => {
    const csv = build({ orders: [order()], coursesOfOrder: () => items });
    const [, l1, l2] = csv.split('\n').map(splitCsvLine);
    expect(l1![col('Nome do Produto')]).toBe('Conscientização AVSEC');
    expect(l1![col('Valor do Produto')]).toBe('300');
    expect(l1![col('SKU (código SAP)')]).toBe('SAP-1');
    expect(l2![col('Nome do Produto')]).toBe('Direção Defensiva');
    expect(l2![col('SKU (código SAP)')]).toBe(''); // sem codigoSap → vazio
  });

  it('preenche identificação do pedido e do comprador', () => {
    const csv = build({ orders: [order()], coursesOfOrder: () => items });
    const l = splitCsvLine(csv.split('\n')[1]!);
    expect(l[col('Número do Pedido')]).toBe('PED-0001');
    expect(l[col('E-mail')]).toBe('financeiro@tar.com.br');
    expect(l[col('Data')]).toBe('2026-03-01T10:00:00.000Z');
    expect(l[col('Moeda')]).toBe('BRL');
    expect(l[col('Nome do comprador')]).toBe('Transporte Aéreo Rio');
    expect(l[col('Forma de Pagamento')]).toBe('PIX');
    expect(l[col('Link do pedido')]).toBe(`${ORIGIN}/pedidos?pedido=pag-1`);
  });

  it('formata CPF/CNPJ do cliente com `formatDocumento`', () => {
    const csv = build({ orders: [order()], coursesOfOrder: () => items });
    const l = splitCsvLine(csv.split('\n')[1]!);
    expect(l[col('CPF / CNPJ')]).toBe('12.345.678/0001-99');
  });

  it('usa o id do pedido como número quando `referencia` está vazia', () => {
    const csv = build({ orders: [order({ reference: '' })], coursesOfOrder: () => items });
    const l = splitCsvLine(csv.split('\n')[1]!);
    expect(l[col('Número do Pedido')]).toBe('pag-1');
  });

  it('deixa colunas de cliente vazias quando o cliente não é encontrado', () => {
    const csv = build({
      orders: [order()],
      coursesOfOrder: () => items,
      customerOf: () => undefined,
    });
    const l = splitCsvLine(csv.split('\n')[1]!);
    expect(l[col('E-mail')]).toBe('');
    expect(l[col('Nome do comprador')]).toBe('');
    expect(l[col('CPF / CNPJ')]).toBe('');
    expect(l[col('Telefone')]).toBe('');
    // Sem cliente, o tipo cai para o default "Pagante".
    expect(l[col('Tipo de cliente (Pagante / Correntista-Mensalista / Isento)')]).toBe('Pagante');
  });

  it('mapeia tipoTag do cliente para o rótulo do relatório', () => {
    const iCol = col('Tipo de cliente (Pagante / Correntista-Mensalista / Isento)');
    const rotulo = (tag: Customer['billingTag']) => {
      const csv = build({
        orders: [order()],
        coursesOfOrder: () => items,
        customerOf: () => customer({ billingTag: tag }),
      });
      return splitCsvLine(csv.split('\n')[1]!)[iCol];
    };
    expect(rotulo('paying')).toBe('Pagante');
    expect(rotulo('account_holder')).toBe('Correntista-Mensalista');
    expect(rotulo('exempt')).toBe('Isento');
    expect(rotulo(undefined)).toBe('Pagante');
  });

  it('escapa campos do pedido que contenham `;` ou aspas', () => {
    const csv = build({
      orders: [order({ description: 'Pacote "A"; com extras' })],
      coursesOfOrder: () => [],
    });
    const linha = csv.split('\n')[1]!;
    expect(linha).toContain('"Pacote ""A""; com extras"');
    expect(splitCsvLine(linha)[col('Nome do Produto')]).toBe('Pacote "A"; com extras');
  });
});

describe('gerarCsvRelatorioPedidos — pedido sem itens (fallback)', () => {
  it('emite uma única linha usando descricao/valor do pedido como produto', () => {
    const csv = build({ orders: [order({ items: [] })], coursesOfOrder: () => [] });
    const linhas = csv.split('\n');
    expect(linhas).toHaveLength(2);
    const l = splitCsvLine(linhas[1]!);
    expect(l[col('Nome do Produto')]).toBe('Curso de Conscientização AVSEC');
    expect(l[col('Valor do Produto')]).toBe('500');
    expect(l[col('SKU (código SAP)')]).toBe(''); // fallback não tem codigoSap
  });
});

describe('gerarCsvRelatorioPedidos — status, estorno e datas', () => {
  it('pedido pago: Confirmado, sem estorno, com data de pagamento', () => {
    const csv = build({ orders: [order({ status: 'paid' })] });
    const l = splitCsvLine(csv.split('\n')[1]!);
    expect(l[col('Status do Pedido')]).toBe('Confirmado');
    expect(l[col('Status do Pagamento')]).toBe('Pago');
    expect(l[col('Estorno')]).toBe('Não');
    expect(l[col('Data de estorno')]).toBe('');
    expect(l[col('Data de pagamento')]).toBe('2026-03-01T10:05:00.000Z');
  });

  it('pedido estornado: Cancelado, Estorno=Sim e data/motivo de cancelamento', () => {
    const csv = build({
      orders: [
        order({
          status: 'refunded',
          paidAt: null,
          canceledAt: '2026-03-05T12:00:00.000Z',
          cancellationReason: 'Solicitação do cliente',
        }),
      ],
    });
    const l = splitCsvLine(csv.split('\n')[1]!);
    expect(l[col('Status do Pedido')]).toBe('Cancelado');
    expect(l[col('Status do Pagamento')]).toBe('Cancelado');
    expect(l[col('Estorno')]).toBe('Sim');
    expect(l[col('Data e hora do cancelamento')]).toBe('2026-03-05T12:00:00.000Z');
    expect(l[col('Motivo do cancelamento')]).toBe('Solicitação do cliente');
    expect(l[col('Data de estorno')]).toBe('2026-03-05T12:00:00.000Z');
    expect(l[col('Data de pagamento')]).toBe('');
  });

  it('status pendente/falhou usam os rótulos de STATUS_LABEL e seguem Confirmado', () => {
    const pend = splitCsvLine(build({ orders: [order({ status: 'pending' })] }).split('\n')[1]!);
    expect(pend[col('Status do Pagamento')]).toBe('Pendente');
    expect(pend[col('Status do Pedido')]).toBe('Confirmado');
    const falhou = splitCsvLine(build({ orders: [order({ status: 'failed' })] }).split('\n')[1]!);
    expect(falhou[col('Status do Pagamento')]).toBe('Erro no processamento');
  });

  it('tipo de serviço cai para Treinamento quando ausente', () => {
    const iCol = col('Tipo de serviço (Treinamento / Credenciamento / Sala VIP)');
    const semTipo = splitCsvLine(build({ orders: [order({ serviceType: undefined })] }).split('\n')[1]!);
    expect(semTipo[iCol]).toBe('Treinamento');
    const vip = splitCsvLine(build({ orders: [order({ serviceType: 'vip_lounge' })] }).split('\n')[1]!);
    expect(vip[iCol]).toBe('Sala VIP');
  });

  it('datas são emitidas como ISO cru, sem formatação pt-BR', () => {
    const l = splitCsvLine(build({ orders: [order()] }).split('\n')[1]!);
    expect(l[col('Data')]).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('valores monetários são emitidos como número cru (ponto decimal, sem R$)', () => {
    const l = splitCsvLine(build({ orders: [order({ amount: 1234.5 })] }).split('\n')[1]!);
    expect(l[col('Total')]).toBe('1234.5');
    expect(l[col('Valor do Produto')]).toBe('1234.5');
  });
});

describe('gerarCsvRelatorioPedidos — pessoa vinculada e crédito em aberto', () => {
  it('sem alunos: crédito Não, pessoa/datas/validade vazias', () => {
    const l = splitCsvLine(build({ orders: [order()], studentsOfOrder: () => [] }).split('\n')[1]!);
    expect(l[col('Créditos em aberto')]).toBe('Não');
    expect(l[col('Pessoa vinculada (nome, CPF, e-mail)')]).toBe('');
    expect(l[col('Data da vinculação')]).toBe('');
    expect(l[col('Validade do crédito')]).toBe('');
  });

  it('com aluno matriculado: usa a primeira matrícula e formata o CPF', () => {
    const l = splitCsvLine(build({ orders: [order()], studentsOfOrder: () => [enrollment()] }).split('\n')[1]!);
    expect(l[col('Créditos em aberto')]).toBe('Não');
    expect(l[col('Pessoa vinculada (nome, CPF, e-mail)')]).toBe('Maria Souza, 123.456.789-01, maria@tar.com.br');
    expect(l[col('Data da vinculação')]).toBe('2026-03-02T10:00:00.000Z');
    expect(l[col('Validade do crédito')]).toBe('12 meses');
  });

  it('qualquer matrícula pendente marca crédito em aberto', () => {
    const l = splitCsvLine(
      build({
        orders: [order()],
        studentsOfOrder: () => [enrollment(), enrollment({ id: 'mat-2', status: 'pending' })],
      }).split('\n')[1]!,
    );
    expect(l[col('Créditos em aberto')]).toBe('Sim');
  });
});

/* --------------------- regressões de regra de negócio ---------------------- */

describe('gerarCsvRelatorioPedidos — valor por linha, quantidade e cupom', () => {
  const items: ReportProduct[] = [
    { id: 'cur-1', title: 'AVSEC', price: 300 },
    { id: 'cur-2', title: 'Direção Defensiva', price: 200 },
  ];

  /**
   * Regressão (alta): Subtotal, Total e Total líquido recebiam `p.valor` (o
   * total do PEDIDO) em TODAS as linhas de item. Num pedido de 2 itens de
   * R$ 500 a coluna Total trazia 500 duas vezes → somar a coluna no Excel/BI
   * contabilizava R$ 1.000 de receita. Agora cada linha carrega o valor do
   * item, e a soma das linhas reconstitui o valor do pedido.
   */
  it('a soma do Total das linhas de um pedido é o valor do pedido, não um múltiplo', () => {
    const csv = build({ orders: [order({ amount: 500 })], coursesOfOrder: () => items });
    const linhas = csv.split('\n').slice(1).map(splitCsvLine);
    const somaTotal = linhas.reduce((acc, l) => acc + Number(l[col('Total')]), 0);
    expect(somaTotal).toBe(500);
    expect(linhas.map((l) => l[col('Total')])).toEqual(['300', '200']);
    expect(linhas.map((l) => l[col('Total líquido')])).toEqual(['300', '200']);
  });

  it('usa precoUnitario * quantidade de `p.itens` quando o item existe no pedido', () => {
    const csv = build({
      orders: [
        order({
          amount: 500,
          items: [
            { courseId: 'cur-1', quantity: 3, unitPrice: 100 },
            { courseId: 'cur-2', quantity: 1, unitPrice: 200 },
          ],
        }),
      ],
      coursesOfOrder: () => items,
    });
    const linhas = csv.split('\n').slice(1).map(splitCsvLine);
    expect(linhas.map((l) => l[col('Total')])).toEqual(['300', '200']);
    expect(linhas.reduce((acc, l) => acc + Number(l[col('Total')]), 0)).toBe(500);
  });

  /**
   * Regressão (média): "Quantidade Comprada" era hardcoded 1, embora
   * `Pagamento.itens[].quantidade` exista. Um pedido de 10 vagas do mesmo
   * curso saía como quantidade 1.
   */
  it('propaga a quantidade real do item do pedido', () => {
    const csv = build({
      orders: [order({ items: [{ courseId: 'cur-1', quantity: 10, unitPrice: 50 }] })],
      coursesOfOrder: () => [{ id: 'cur-1', title: 'AVSEC', price: 500 }],
    });
    const l = splitCsvLine(csv.split('\n')[1]!);
    expect(l[col('Quantidade Comprada')]).toBe('10');
    expect(l[col('Total')]).toBe('500'); // 10 × 50
  });

  it('quantidade cai para 1 quando o produto não tem item correspondente em `p.itens`', () => {
    const l = splitCsvLine(build({ orders: [order()], coursesOfOrder: () => items }).split('\n')[1]!);
    expect(l[col('Quantidade Comprada')]).toBe('1');
  });

  /**
   * Regressão (média): "Desconto" era hardcoded 0 e "Cupom de Desconto"
   * hardcoded "" nas linhas de pedidos reais — um pedido pago com cupom saía
   * como se não tivesse desconto. Hoje as colunas leem `p.cupomAplicado` /
   * `p.descontoAplicado` (campos opcionais aditivos em `Pagamento`).
   */
  it('pedido sem cupom: Desconto 0, Cupom vazio e Subtotal === Total', () => {
    const l = splitCsvLine(build({ orders: [order({ amount: 500 })] }).split('\n')[1]!);
    expect(l[col('Desconto')]).toBe('0');
    expect(l[col('Cupom de Desconto')]).toBe('');
    expect(l[col('Subtotal')]).toBe(l[col('Total')]);
  });

  it('pedido com cupom: emite o código e o desconto, com Subtotal = Total + Desconto', () => {
    const l = splitCsvLine(
      build({
        orders: [order({ amount: 450, couponCode: 'BEMVINDO10', discountAmount: 50 })],
      }).split('\n')[1]!,
    );
    expect(l[col('Cupom de Desconto')]).toBe('BEMVINDO10');
    expect(l[col('Desconto')]).toBe('50');
    expect(l[col('Total')]).toBe('450');
    expect(l[col('Subtotal')]).toBe('500');
  });

  /**
   * Achados M-1/M-2 do quinto review: a invariante "soma das linhas = total do
   * pedido" só valia com `descontoAplicado = 0`, e o rateio arredondava cada
   * cota independentemente, perdendo centavos. A semântica fixada é
   * `p.valor` = LÍQUIDO: `Σ Total === p.valor` e `Σ Desconto ===
   * p.descontoAplicado`, com a última linha absorvendo o resíduo.
   */
  it('com desconto e múltiplos itens, Σ Total === p.valor e Σ Desconto === descontoAplicado', () => {
    // 2 itens de 300 + 200 (bruto 500), desconto de R$ 50 → líquido 450.
    const csv = build({
      orders: [order({ amount: 450, couponCode: 'META50', discountAmount: 50 })],
      coursesOfOrder: () => items,
    });
    const linhas = csv.split('\n').slice(1).map(splitCsvLine);
    expect(linhas).toHaveLength(2);

    const somaTotal = linhas.reduce((acc, l) => acc + Number(l[col('Total')]), 0);
    const somaDesconto = linhas.reduce((acc, l) => acc + Number(l[col('Desconto')]), 0);
    const somaSubtotal = linhas.reduce((acc, l) => acc + Number(l[col('Subtotal')]), 0);
    const somaLiquido = linhas.reduce((acc, l) => acc + Number(l[col('Total líquido')]), 0);

    expect(somaTotal).toBe(450);
    expect(somaDesconto).toBe(50);
    expect(somaLiquido).toBe(450);
    // Subtotal = Total + Desconto por linha → soma reconstitui o bruto.
    expect(somaSubtotal).toBe(500);

    // Rateio proporcional ao bruto de cada item (300/500 e 200/500).
    expect(linhas.map((l) => l[col('Total')])).toEqual(['270', '180']);
    expect(linhas.map((l) => l[col('Desconto')])).toEqual(['30', '20']);
  });

  /**
   * Fixture corrigido no sexto review: usava `valor: 10` com desconto de 10 e
   * 3 itens de 10 (bruto 30) — um "desconto de 100%" sobre um bruto que não
   * fechava com nada. Agora: bruto 30, desconto 10, líquido 20. O que o teste
   * mede continua sendo o resíduo de centavos — 20/3 e 10/3 são as duas
   * divisões inexatas que ratear independentemente perderia.
   */
  it('o resíduo de centavos vai para a última linha (R$ 20 em 3 itens iguais)', () => {
    const tres: ReportProduct[] = [
      { id: 'cur-1', title: 'A', price: 10 },
      { id: 'cur-2', title: 'B', price: 10 },
      { id: 'cur-3', title: 'C', price: 10 },
    ];
    const csv = build({
      orders: [order({ amount: 20, couponCode: 'X', discountAmount: 10 })],
      coursesOfOrder: () => tres,
    });
    const linhas = csv.split('\n').slice(1).map(splitCsvLine);
    expect(linhas.map((l) => l[col('Total')])).toEqual(['6.67', '6.67', '6.66']);
    expect(linhas.reduce((acc, l) => acc + Number(l[col('Total')]), 0)).toBe(20);
    expect(linhas.map((l) => l[col('Desconto')])).toEqual(['3.33', '3.33', '3.34']);
    expect(linhas.reduce((acc, l) => acc + Number(l[col('Desconto')]), 0)).toBe(10);
    // Subtotal = Total + Desconto → cada linha fecha em 10, somando o bruto 30.
    expect(linhas.map((l) => l[col('Subtotal')])).toEqual(['10', '10', '10']);
    expect(linhas.reduce((acc, l) => acc + Number(l[col('Subtotal')]), 0)).toBe(30);
  });

  it('a invariante vale para valores quebrados e quantidades diferentes', () => {
    const csv = build({
      orders: [
        order({
          amount: 1000.07,
          discountAmount: 99.99,
          items: [
            { courseId: 'cur-1', quantity: 3, unitPrice: 99.9 },
            { courseId: 'cur-2', quantity: 7, unitPrice: 11.11 },
          ],
        }),
      ],
      coursesOfOrder: () => items,
    });
    const linhas = csv.split('\n').slice(1).map(splitCsvLine);
    const soma = (c: string) => Math.round(linhas.reduce((acc, l) => acc + Number(l[col(c)]), 0) * 100) / 100;
    expect(soma('Total')).toBe(1000.07);
    expect(soma('Desconto')).toBe(99.99);
    expect(soma('Subtotal')).toBe(1100.06);
  });

  it('pedido sem itens no catálogo cai para uma linha única com o valor do pedido', () => {
    const l = splitCsvLine(build({ orders: [order({ amount: 123.45, discountAmount: 6.55 })] }).split('\n')[1]!);
    expect(l[col('Total')]).toBe('123.45');
    expect(l[col('Desconto')]).toBe('6.55');
    expect(l[col('Subtotal')]).toBe('130');
  });

  /**
   * Fixture corrigido no sexto review: usava `valor: 500` com itens de
   * catálogo somando 500 de BRUTO e desconto de 50 — numericamente incoerente
   * com a semântica líquida assumida para `p.valor` (500 bruto − 50 = 450
   * líquido). O rateio do desconto não muda (é proporcional ao bruto do item,
   * 300/500 e 200/500), mas o fixture agora é consistente e a soma de
   * `Subtotal` reconstitui o bruto.
   */
  it('o desconto do pedido é rateado entre as linhas de item (não repetido)', () => {
    const csv = build({
      orders: [order({ amount: 450, couponCode: 'META50', discountAmount: 50 })],
      coursesOfOrder: () => items,
    });
    const linhas = csv.split('\n').slice(1).map(splitCsvLine);
    expect(linhas.map((l) => l[col('Desconto')])).toEqual(['30', '20']);
    expect(linhas.reduce((acc, l) => acc + Number(l[col('Desconto')]), 0)).toBe(50);
    // Subtotal = Total + Desconto por linha → a soma volta ao bruto (500).
    expect(linhas.map((l) => l[col('Subtotal')])).toEqual(['300', '200']);
    expect(linhas.reduce((acc, l) => acc + Number(l[col('Subtotal')]), 0)).toBe(500);
  });

  /**
   * Regressão (baixa): "Identificador da transação no meio de pagamento"
   * reutilizava `p.referencia`, que já é o "Número do Pedido" — duas colunas
   * semanticamente diferentes com o mesmo valor. `Pagamento` não tem campo de
   * transação, então a coluna passou a emitir um identificador derivado do id,
   * determinístico e explicitamente sintético.
   */
  it('a coluna de transação não repete o número do pedido e é determinística', () => {
    const l = splitCsvLine(build({ orders: [order()] }).split('\n')[1]!);
    const txn = l[col('Identificador da transação no meio de pagamento')]!;
    expect(l[col('Número do Pedido')]).toBe('PED-0001');
    expect(txn).not.toBe('PED-0001');
    expect(txn).toBe(syntheticTransactionId('pag-1'));
    expect(txn).toMatch(/^TXN-SINT-[0-9A-Z]+$/);
    // Ids diferentes geram transações diferentes.
    expect(syntheticTransactionId('pag-2')).not.toBe(txn);
  });
});

/* ---------------------------- linhas sintéticas ---------------------------- */

describe('gerarLinhasSinteticas + composição final', () => {
  it('gera 10 linhas de demonstração', () => {
    expect(syntheticReportRows()).toHaveLength(10);
  });

  it('as linhas sintéticas entram depois dos pedidos reais e têm a largura do cabeçalho', () => {
    const sinteticas = syntheticReportRows();
    const csv = build({ orders: [order()], syntheticRows: sinteticas });
    const linhas = csv.split('\n');
    expect(linhas).toHaveLength(1 + 1 + sinteticas.length);
    expect(splitCsvLine(linhas[1]!)[col('Número do Pedido')]).toBe('PED-0001');
    for (const linha of linhas.slice(2)) {
      expect(splitCsvLine(linha)).toHaveLength(CSV_HEADER.length);
      expect(splitCsvLine(linha)[col('Número do Pedido')]).toMatch(/^SINT-\d+$/);
    }
  });

  it('linhas sintéticas usam o mesmo `origin` recebido', () => {
    const csv = build({ syntheticRows: syntheticReportRows() });
    expect(csv.split('\n')[1]).toContain(`${ORIGIN}/pedidos?pedido=SINT-1000`);
  });
});
