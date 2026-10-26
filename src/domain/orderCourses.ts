/**
 * Quais cursos e quais alunos pertencem a um pedido.
 *
 * Fonte única dessas duas regras. Elas viviam inline no corpo de
 * `pages/admin/AdminPedidos.tsx`, fechadas sobre o state do componente e nunca
 * exportadas — ou seja, a parte do sistema com mais adivinhação (casamento de
 * texto livre) era a que menos cobertura tinha. Aqui são funções puras, que
 * recebem tudo de que precisam por parâmetro.
 *
 * Os tipos de entrada são estruturais (só os campos lidos) de propósito: a
 * tela passa `CursoCompleto`/`Pagamento`/`Matricula`/`Cliente` reais e os
 * testes passam objetos mínimos, sem precisar montar entidades inteiras.
 */

/** Curso como estas regras precisam enxergar — `CursoCompleto` satisfaz. */
export interface MatchableCourse {
  id: string;
  title: string;
}

/** Pedido como estas regras precisam enxergar — `Pagamento` satisfaz. */
export interface MatchableOrder {
  customerId: string;
  description: string;
  items: { courseId: string }[];
}

/** Matrícula como estas regras precisam enxergar — `Matricula` satisfaz. */
export interface MatchableEnrollment {
  customerName: string;
  courseId: string;
}

/** Cliente como estas regras precisam enxergar — `Cliente` satisfaz. */
export interface MatchableCustomer {
  id: string;
  name: string;
}

/** Separadores de palavra usados nos títulos do catálogo. */
const SEPARADORES = /[\s—\-+,()]+/;

/**
 * Tokens do título que valem como pista de casamento com a `descricao`.
 *
 * O filtro padrão descarta palavras de até 4 letras, que são as que geram
 * falso positivo (preposições, artigos, "com", "em"). Um título composto
 * *inteiramente* de palavras curtas ("NR-10 — Base") ficava sem nenhum token,
 * e `[].some()` é sempre falso: o curso nunca casava com pedido nenhum, o que
 * fazia a tela mostrar o pedido sem produto e `alunosDoPedido` cair no ramo
 * "sem curso identificado", listando TODOS os alunos do cliente. Nesse caso
 * caímos para todos os tokens de 2+ caracteres — menos seletivo, mas muito
 * melhor que o falso negativo total.
 *
 * Nesse ramo de fallback, tokens puramente numéricos são descartados (achado
 * B-3 do quinto review): as `descricao` dos pedidos carregam a contagem de
 * vagas ("Conscientização AVSEC — 30 vagas"), então um título como "NR-10 —
 * Base" casaria com qualquer pedido de 10 vagas, de qualquer curso.
 */
const tokensDoTitulo = (title: string): string[] => {
  const todos = title.toLowerCase().split(SEPARADORES).filter(Boolean);
  const longos = todos.filter((w) => w.length > 4);
  return longos.length > 0 ? longos : todos.filter((w) => w.length > 1 && !/^\d+$/.test(w));
};

/**
 * Cursos do pedido: lê diretamente de `p.itens` (curso, quantidade, preço)
 * agora que o pedido modela os itens de verdade. Pedidos semente sem curso
 * identificável (reembolso, credenciamento avulso) ficam com `itens: []`;
 * para esses — e como rede de segurança para qualquer pedido legado criado
 * antes dessa migração — caímos de volta para a heurística antiga de casar
 * palavras da `descricao` com o título do curso (ver docs/FUNCIONALIDADES.md §8.4).
 *
 * O resultado sai na ordem do catálogo, não na ordem dos itens do pedido.
 */
export const coursesOfOrder = <C extends MatchableCourse>(p: MatchableOrder, cursos: C[]): C[] => {
  if (p.items.length > 0) {
    const ids = new Set(p.items.map((i) => i.courseId));
    return cursos.filter((c) => ids.has(c.id));
  }
  const desc = p.description.toLowerCase();
  return cursos.filter((c) => tokensDoTitulo(c.title).some((w) => desc.includes(w)));
};

/**
 * Alunos (matrículas) ligados ao pedido: do mesmo cliente e, quando o pedido
 * tem curso identificado, restritos a esses cursos. Sem curso identificado, o
 * pedido "herda" todos os alunos do cliente — frouxo, mas é o que permite a
 * coluna de créditos funcionar em pedidos legados.
 *
 * LIMITAÇÃO DE MODELO: o vínculo é por `clienteNome` porque `Matricula` não
 * tem `clienteId` (campo desnormalizado, ver src/types/index.ts). Renomear um
 * cliente desvincula todos os alunos dos pedidos dele, e homônimos casariam.
 */
export const studentsOfOrder = <M extends MatchableEnrollment>(
  p: MatchableOrder,
  cursos: MatchableCourse[],
  matriculas: M[],
  clientes: MatchableCustomer[],
): M[] => {
  const customer = clientes.find((c) => c.id === p.customerId);
  if (!customer) return [];
  const ids = coursesOfOrder(p, cursos).map((c) => c.id);
  return matriculas.filter((m) => m.customerName === customer.name && (ids.length === 0 || ids.includes(m.courseId)));
};
