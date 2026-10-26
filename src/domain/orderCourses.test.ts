/**
 * Especificação executável de `cursosDoPedido` / `alunosDoPedido`
 * (`src/lib/cursos-do-pedido.ts`).
 *
 * As duas regras viviam inline no corpo de `src/pages/admin/AdminPedidos.tsx`,
 * fechadas sobre o state do componente e nunca exportadas — este arquivo
 * reimplementava o algoritmo só para documentar os casos de borda, e portanto
 * não protegia nada. Agora importa as funções de produção de verdade: uma
 * mudança no algoritmo quebra estes testes.
 */
import {
  studentsOfOrder,
  coursesOfOrder,
  type MatchableCustomer,
  type MatchableCourse,
  type MatchableEnrollment,
  type MatchableOrder,
} from './orderCourses';

type MatriculaTeste = MatchableEnrollment & { id: string };

const CURSOS: MatchableCourse[] = [
  { id: 'cur-1', title: 'Conscientização com AVSEC (Aviation Security)' },
  { id: 'cur-2', title: 'Segurança Operacional em Pista' },
  { id: 'cur-3', title: 'Direção Defensiva' },
  { id: 'cur-4', title: 'NR-35 — Alt. e Risco' },
];

const order = (over: Partial<MatchableOrder> = {}): MatchableOrder => ({
  customerId: 'cli-1',
  description: '',
  items: [],
  ...over,
});

describe('cursosDoPedido — caminho feliz (p.itens preenchido)', () => {
  it('casa direto por cursoId e ignora a descrição', () => {
    const p = order({
      description: 'Direção Defensiva — 10 vagas', // texto que bateria em cur-3
      items: [{ courseId: 'cur-2' }],
    });
    expect(coursesOfOrder(p, CURSOS).map((c) => c.id)).toEqual(['cur-2']);
  });

  it('resolve múltiplos itens, na ordem do catálogo (não na ordem dos itens)', () => {
    const p = order({ items: [{ courseId: 'cur-3' }, { courseId: 'cur-1' }] });
    expect(coursesOfOrder(p, CURSOS).map((c) => c.id)).toEqual(['cur-1', 'cur-3']);
  });

  it('item com cursoId que não existe mais no catálogo some silenciosamente', () => {
    // Relevante: um curso removido do catálogo faz o pedido parecer sem itens
    // na tela, SEM cair na heurística (porque `p.itens.length > 0`).
    const p = order({ description: 'Direção Defensiva', items: [{ courseId: 'cur-apagado' }] });
    expect(coursesOfOrder(p, CURSOS)).toEqual([]);
  });

  it('itens duplicados do mesmo curso não duplicam o curso', () => {
    const p = order({ items: [{ courseId: 'cur-1' }, { courseId: 'cur-1' }] });
    expect(coursesOfOrder(p, CURSOS)).toHaveLength(1);
  });
});

describe('cursosDoPedido — fallback heurístico (itens: [])', () => {
  it('casa por palavra da descrição com o título do curso', () => {
    const p = order({ description: 'Segurança Operacional — 15 vagas' });
    expect(coursesOfOrder(p, CURSOS).map((c) => c.id)).toEqual(['cur-2']);
  });

  it('é case-insensitive', () => {
    const p = order({ description: 'DIREÇÃO DEFENSIVA (turma extra)' });
    expect(coursesOfOrder(p, CURSOS).map((c) => c.id)).toEqual(['cur-3']);
  });

  it('descrição que não bate com nenhum curso devolve vazio', () => {
    const p = order({ description: 'Reembolso turma cancelada' });
    expect(coursesOfOrder(p, CURSOS)).toEqual([]);
  });

  it('uma única palavra em comum já casa o curso (match frouxo)', () => {
    const p = order({ description: 'Palestra sobre segurança no trabalho administrativo' });
    expect(coursesOfOrder(p, CURSOS).map((c) => c.id)).toEqual(['cur-2']);
  });

  it('casa por substring, não por palavra inteira', () => {
    // "operacionalizar" contém "operacional": falso positivo conhecido e
    // deliberadamente mantido — trocar por casamento de palavra inteira
    // perderia os casos de plural/flexão que hoje funcionam ("Segurança
    // Operacional" vs. "segurança operacionais"), que são mais frequentes no
    // texto livre da `descricao` do que este falso positivo.
    const p = order({ description: 'Consultoria para operacionalizar o pátio' });
    expect(coursesOfOrder(p, CURSOS).map((c) => c.id)).toEqual(['cur-2']);
  });

  /**
   * Regressão: o filtro `w.length > 4` descartava toda palavra de até 4
   * letras. Um título composto só de palavras curtas ("NR-10 — Base") ficava
   * sem nenhum token e `[].some()` é sempre falso: o curso nunca casava, a
   * tela mostrava o pedido sem produto e `alunosDoPedido` caía no ramo "sem
   * curso identificado", listando TODOS os alunos do cliente. Agora, quando
   * não há nenhuma palavra longa, o título cai para todos os tokens de 2+
   * caracteres.
   */
  it('curso com título só de palavras curtas casa pela descrição', () => {
    const cursos: MatchableCourse[] = [{ id: 'cur-5', title: 'NR-10 — Base' }];
    const p = order({ description: 'Treinamento NR-10 — Base, 5 vagas' });

    expect(coursesOfOrder(p, cursos).map((c) => c.id)).toEqual(['cur-5']);
  });

  /**
   * Achado B-3 do quinto review: o fallback aceitava qualquer token de 2+
   * caracteres, inclusive números puros. Como as descrições dos pedidos
   * carregam a contagem de vagas ("... — 10 vagas"), o título "NR-10 — Base"
   * casava com um pedido de OUTRO curso só por conter "10".
   */
  it('não casa por número puro vindo da contagem de vagas', () => {
    const cursos: MatchableCourse[] = [{ id: 'cur-5', title: 'NR-10 — Base' }];
    const p = order({ description: 'Curso de Higiene — 10 vagas' });

    expect(coursesOfOrder(p, cursos)).toEqual([]);
  });

  it('o título só de números não casa com nenhuma descrição', () => {
    const cursos: MatchableCourse[] = [{ id: 'cur-6', title: '10 20' }];
    expect(coursesOfOrder(order({ description: 'Pedido com 10 e 20 vagas' }), cursos)).toEqual([]);
  });

  it('ainda casa pelos tokens não numéricos do mesmo título curto', () => {
    const cursos: MatchableCourse[] = [{ id: 'cur-5', title: 'NR-10 — Base' }];
    const p = order({ description: 'Treinamento base, 5 vagas' });
    expect(coursesOfOrder(p, cursos).map((c) => c.id)).toEqual(['cur-5']);
  });

  it('o fallback de palavras curtas não vale quando o título tem palavra longa', () => {
    // "NR-35 — Alt. e Risco" tem "risco" (5 letras), então só os tokens longos
    // valem: uma descrição que cita apenas "alt" não casa.
    const p = order({ description: 'Pedido de alt e nr' });
    expect(coursesOfOrder(p, CURSOS)).toEqual([]);
  });
});

describe('alunosDoPedido', () => {
  const CLIENTES: MatchableCustomer[] = [{ id: 'cli-1', name: 'LATAM Airlines Brasil' }];
  const MATRICULAS: MatriculaTeste[] = [
    { id: 'm-1', customerName: 'LATAM Airlines Brasil', courseId: 'cur-1' },
    { id: 'm-2', customerName: 'LATAM Airlines Brasil', courseId: 'cur-2' },
    { id: 'm-3', customerName: 'Azul Linhas Aéreas', courseId: 'cur-1' },
  ];

  it('filtra por nome do cliente e pelos cursos do pedido', () => {
    const p = order({ items: [{ courseId: 'cur-1' }] });
    expect(studentsOfOrder(p, CURSOS, MATRICULAS, CLIENTES).map((m) => m.id)).toEqual(['m-1']);
  });

  it('cliente inexistente devolve vazio', () => {
    const p = order({ customerId: 'cli-fantasma', items: [{ courseId: 'cur-1' }] });
    expect(studentsOfOrder(p, CURSOS, MATRICULAS, CLIENTES)).toEqual([]);
  });

  // Comportamento correto, mas perigoso o suficiente para ficar fixado:
  // sem curso identificado, o pedido "herda" todos os alunos do cliente.
  it('sem curso identificado, devolve TODOS os alunos do cliente', () => {
    const p = order({ description: 'Reembolso turma cancelada' });
    expect(studentsOfOrder(p, CURSOS, MATRICULAS, CLIENTES).map((m) => m.id)).toEqual(['m-1', 'm-2']);
  });

  it('o vínculo é por NOME do cliente, não por id (homônimo casaria)', () => {
    // LIMITAÇÃO DE MODELO: `Matricula.clienteNome` é um campo desnormalizado e
    // `Matricula` não tem `clienteId`. Renomear o cliente em `clientes`
    // desvincula todos os alunos dos pedidos dele.
    const clientesRenomeado: MatchableCustomer[] = [{ id: 'cli-1', name: 'LATAM Brasil S.A.' }];
    const p = order({ items: [{ courseId: 'cur-1' }] });
    expect(studentsOfOrder(p, CURSOS, MATRICULAS, clientesRenomeado)).toEqual([]);
  });
});
