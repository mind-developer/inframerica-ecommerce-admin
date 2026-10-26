import {
  CANCEL_WINDOW_DAYS,
  LINK_WINDOW_DAYS,
  daysUntil,
  daysSince,
  adminCancelBlockReason,
  adminLinkBlockReason,
  canCancelOrder,
  canUnlinkOrSwapSeat,
  isCancelWindowExpired,
  isLinkWindowExpired,
} from './enrollmentRules';

/**
 * `now` fixo em todos os casos: as regras são sensíveis a data e um teste que
 * dependesse do relógio real passaria ou falharia conforme a hora do dia.
 */
const NOW = new Date('2026-10-19T12:00:00Z');

/** ISO de `n` dias antes de NOW (fração permitida, para testar o arredondamento). */
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

/** ISO de `n` dias depois de NOW. */
const daysAhead = (n: number) => new Date(NOW.getTime() + n * 24 * 60 * 60 * 1000).toISOString();

describe('daysSince', () => {
  it('conta 0 para o próprio instante', () => {
    expect(daysSince(NOW.toISOString(), NOW)).toBe(0);
  });

  it('conta dias inteiros transcorridos', () => {
    expect(daysSince(daysAgo(1), NOW)).toBe(1);
    expect(daysSince(daysAgo(15), NOW)).toBe(15);
    expect(daysSince(daysAgo(16), NOW)).toBe(16);
  });

  it('trunca para baixo: 23h59 ainda é 0 dia', () => {
    expect(daysSince(daysAgo(0.999), NOW)).toBe(0);
    expect(daysSince(daysAgo(1.5), NOW)).toBe(1);
  });

  it('é negativo para datas no futuro', () => {
    expect(daysSince(daysAhead(3), NOW)).toBe(-3);
  });
});

describe('daysUntil', () => {
  it('conta 0 para o próprio instante', () => {
    expect(daysUntil(NOW.toISOString(), NOW)).toBe(0);
  });

  it('conta dias inteiros restantes', () => {
    expect(daysUntil(daysAhead(7), NOW)).toBe(7);
    expect(daysUntil(daysAhead(1), NOW)).toBe(1);
  });

  it('trunca para baixo: faltando 7,5 dias devolve 7', () => {
    expect(daysUntil(daysAhead(7.5), NOW)).toBe(7);
  });

  it('é negativo quando a data já passou', () => {
    expect(daysUntil(daysAgo(2), NOW)).toBe(-2);
  });
});

describe('isLinkWindowExpired', () => {
  it('é false quando não há data de vinculação (vaga nunca vinculada)', () => {
    expect(isLinkWindowExpired(null, NOW)).toBe(false);
  });

  it('é false exatamente no limite do prazo', () => {
    expect(isLinkWindowExpired(daysAgo(LINK_WINDOW_DAYS), NOW)).toBe(false);
  });

  it('é false um dia antes do limite', () => {
    expect(isLinkWindowExpired(daysAgo(LINK_WINDOW_DAYS - 1), NOW)).toBe(false);
  });

  it('é true um dia depois do limite', () => {
    expect(isLinkWindowExpired(daysAgo(LINK_WINDOW_DAYS + 1), NOW)).toBe(true);
  });
});

describe('isCancelWindowExpired', () => {
  it('é false quando não há data de pagamento', () => {
    expect(isCancelWindowExpired(null, NOW)).toBe(false);
  });

  it('é false exatamente no limite do prazo', () => {
    expect(isCancelWindowExpired(daysAgo(CANCEL_WINDOW_DAYS), NOW)).toBe(false);
  });

  it('é false um dia antes do limite', () => {
    expect(isCancelWindowExpired(daysAgo(CANCEL_WINDOW_DAYS - 1), NOW)).toBe(false);
  });

  it('é true um dia depois do limite', () => {
    expect(isCancelWindowExpired(daysAgo(CANCEL_WINDOW_DAYS + 1), NOW)).toBe(true);
  });
});

describe('canUnlinkOrSwapSeat', () => {
  const base = {
    alreadyStartedOrCompleted: false,
    linkedAtIso: null as string | null,
    now: NOW,
  };

  it('permite quando nada bloqueia', () => {
    expect(canUnlinkOrSwapSeat(base)).toEqual({ allowed: true });
  });

  it('permite quando a vaga nunca foi vinculada (linkedAtIso null)', () => {
    const r = canUnlinkOrSwapSeat({ ...base, linkedAtIso: null });
    expect(r.allowed).toBe(true);
  });

  it('bloqueia quando o treinamento já foi iniciado ou concluído', () => {
    const r = canUnlinkOrSwapSeat({ ...base, alreadyStartedOrCompleted: true });
    expect(r.allowed).toBe(false);
    expect(r.reason).toMatch(/já foi acessado\/cursado/);
  });

  it('o status iniciado tem precedência sobre o prazo ainda válido', () => {
    const r = canUnlinkOrSwapSeat({
      ...base,
      alreadyStartedOrCompleted: true,
      linkedAtIso: daysAgo(1),
    });
    expect(r.reason).toMatch(/já foi acessado\/cursado/);
  });

  it('permite exatamente no limite de 15 dias', () => {
    const r = canUnlinkOrSwapSeat({ ...base, linkedAtIso: daysAgo(LINK_WINDOW_DAYS) });
    expect(r).toEqual({ allowed: true });
  });

  it('permite um dia antes do limite', () => {
    const r = canUnlinkOrSwapSeat({ ...base, linkedAtIso: daysAgo(LINK_WINDOW_DAYS - 1) });
    expect(r.allowed).toBe(true);
  });

  it('bloqueia um dia depois do limite, informando os dias decorridos', () => {
    const r = canUnlinkOrSwapSeat({ ...base, linkedAtIso: daysAgo(LINK_WINDOW_DAYS + 1) });
    expect(r.allowed).toBe(false);
    expect(r.reason).toContain('16 dias');
  });

  it('bloqueia quando a turma presencial é em menos de 7 dias', () => {
    const r = canUnlinkOrSwapSeat({ ...base, cohortDaysLeft: 6 });
    expect(r.allowed).toBe(false);
    expect(r.reason).toMatch(/menos de 7 dias/);
  });

  it('permite quando a turma é exatamente em 7 dias (limite inclusivo)', () => {
    expect(canUnlinkOrSwapSeat({ ...base, cohortDaysLeft: 7 })).toEqual({ allowed: true });
  });

  it('bloqueia quando a turma já passou (dias negativos)', () => {
    const r = canUnlinkOrSwapSeat({ ...base, cohortDaysLeft: -1 });
    expect(r.allowed).toBe(false);
  });

  it('ignora cohortDaysLeft null ou ausente (curso sem turma presencial)', () => {
    expect(canUnlinkOrSwapSeat({ ...base, cohortDaysLeft: null })).toEqual({ allowed: true });
    expect(canUnlinkOrSwapSeat({ ...base, cohortDaysLeft: undefined })).toEqual({ allowed: true });
  });

  it('o prazo de vínculo tem precedência sobre o prazo da turma', () => {
    const r = canUnlinkOrSwapSeat({
      ...base,
      linkedAtIso: daysAgo(LINK_WINDOW_DAYS + 1),
      cohortDaysLeft: 1,
    });
    expect(r.reason).toMatch(/desde a vinculação/);
  });
});

describe('adminLinkBlockReason', () => {
  const base = {
    inProgress: false,
    completed: false,
    linkedAtIso: daysAgo(1),
    now: NOW,
  };

  it('não bloqueia dentro do prazo', () => {
    expect(adminLinkBlockReason(base)).toBeNull();
  });

  it('bloqueia curso em andamento', () => {
    expect(adminLinkBlockReason({ ...base, inProgress: true })).toMatch(/já iniciado/);
  });

  it('bloqueia curso concluído', () => {
    expect(adminLinkBlockReason({ ...base, completed: true })).toMatch(/já concluído/);
  });

  it('em andamento tem precedência sobre concluído', () => {
    const r = adminLinkBlockReason({ ...base, inProgress: true, completed: true });
    expect(r).toMatch(/já iniciado/);
  });

  it('não bloqueia exatamente no limite de 15 dias', () => {
    expect(adminLinkBlockReason({ ...base, linkedAtIso: daysAgo(LINK_WINDOW_DAYS) })).toBeNull();
  });

  it('não bloqueia um dia antes do limite', () => {
    expect(adminLinkBlockReason({ ...base, linkedAtIso: daysAgo(LINK_WINDOW_DAYS - 1) })).toBeNull();
  });

  it('bloqueia um dia depois do limite', () => {
    const r = adminLinkBlockReason({ ...base, linkedAtIso: daysAgo(LINK_WINDOW_DAYS + 1) });
    expect(r).toContain('16 dias');
  });

  it('concorda com canUnlinkOrSwapSeat no limite do prazo (marco unificado)', () => {
    for (const dias of [LINK_WINDOW_DAYS - 1, LINK_WINDOW_DAYS, LINK_WINDOW_DAYS + 1]) {
      const linkedAtIso = daysAgo(dias);
      const admin = adminLinkBlockReason({ ...base, linkedAtIso });
      const cliente = canUnlinkOrSwapSeat({
        alreadyStartedOrCompleted: false,
        linkedAtIso,
        now: NOW,
      });
      expect(admin === null).toBe(cliente.allowed);
    }
  });
});

describe('canCancelOrder', () => {
  const base = {
    isAccountHolder: false,
    isCanceled: false,
    isPaid: true,
    paidAtIso: daysAgo(1) as string | null,
    anyTrainingStarted: false,
    now: NOW,
  };

  it('permite quando nada bloqueia', () => {
    expect(canCancelOrder(base)).toEqual({ allowed: true });
  });

  it('bloqueia cliente correntista, mesmo com tudo o mais válido', () => {
    const r = canCancelOrder({ ...base, isAccountHolder: true });
    expect(r.allowed).toBe(false);
    expect(r.reason).toMatch(/correntistas\/mensalistas/);
  });

  it('correntista tem precedência sobre as demais regras', () => {
    const r = canCancelOrder({
      ...base,
      isAccountHolder: true,
      isCanceled: true,
      isPaid: false,
    });
    expect(r.reason).toMatch(/correntistas\/mensalistas/);
  });

  it('bloqueia pedido já cancelado', () => {
    const r = canCancelOrder({ ...base, isCanceled: true });
    expect(r.reason).toMatch(/já foi cancelado/);
  });

  it('bloqueia pedido não pago', () => {
    const r = canCancelOrder({ ...base, isPaid: false });
    expect(r.reason).toMatch(/pagamento confirmado/);
  });

  it('bloqueia pedido pago mas sem data de pagamento (paidAtIso null)', () => {
    const r = canCancelOrder({ ...base, paidAtIso: null });
    expect(r.allowed).toBe(false);
    expect(r.reason).toMatch(/pagamento confirmado/);
  });

  it('bloqueia quando algum treinamento já foi iniciado ou concluído', () => {
    const r = canCancelOrder({ ...base, anyTrainingStarted: true });
    expect(r.reason).toMatch(/iniciados ou concluídos/);
  });

  it('permite exatamente no limite de 7 dias', () => {
    expect(canCancelOrder({ ...base, paidAtIso: daysAgo(CANCEL_WINDOW_DAYS) })).toEqual({
      allowed: true,
    });
  });

  it('permite um dia antes do limite', () => {
    const r = canCancelOrder({ ...base, paidAtIso: daysAgo(CANCEL_WINDOW_DAYS - 1) });
    expect(r.allowed).toBe(true);
  });

  it('bloqueia um dia depois do limite, informando os dias decorridos', () => {
    const r = canCancelOrder({ ...base, paidAtIso: daysAgo(CANCEL_WINDOW_DAYS + 1) });
    expect(r.allowed).toBe(false);
    expect(r.reason).toContain('8 dias');
  });

  it('o status iniciado tem precedência sobre o prazo expirado', () => {
    const r = canCancelOrder({
      ...base,
      anyTrainingStarted: true,
      paidAtIso: daysAgo(CANCEL_WINDOW_DAYS + 1),
    });
    expect(r.reason).toMatch(/iniciados ou concluídos/);
  });
});

describe('adminCancelBlockReason', () => {
  const base = {
    anyStudentStarted: false,
    paidAtIso: daysAgo(1),
    isCanceled: false,
    isPaid: true,
    now: NOW,
  };

  it('não bloqueia dentro do prazo', () => {
    expect(adminCancelBlockReason(base)).toBeNull();
  });

  it('bloqueia quando algum aluno já iniciou ou concluiu', () => {
    const r = adminCancelBlockReason({ ...base, anyStudentStarted: true });
    expect(r).toMatch(/iniciado ou concluído/);
  });

  it('não bloqueia exatamente no limite de 7 dias', () => {
    expect(adminCancelBlockReason({ ...base, paidAtIso: daysAgo(CANCEL_WINDOW_DAYS) })).toBeNull();
  });

  it('não bloqueia um dia antes do limite', () => {
    expect(
      adminCancelBlockReason({
        ...base,
        paidAtIso: daysAgo(CANCEL_WINDOW_DAYS - 1),
      }),
    ).toBeNull();
  });

  it('bloqueia um dia depois do limite', () => {
    const r = adminCancelBlockReason({
      ...base,
      paidAtIso: daysAgo(CANCEL_WINDOW_DAYS + 1),
    });
    expect(r).toContain('8 dias');
  });

  it('bloqueia pedido já cancelado', () => {
    expect(adminCancelBlockReason({ ...base, isCanceled: true })).toMatch(/já está cancelado/);
  });

  it('o status cancelado tem precedência sobre o prazo expirado', () => {
    const r = adminCancelBlockReason({
      ...base,
      paidAtIso: daysAgo(CANCEL_WINDOW_DAYS + 1),
      isCanceled: true,
    });
    expect(r).toMatch(/já está cancelado/);
  });

  // Achado M-3 do quinto review: o admin cancelava "com estorno automático"
  // pedido nunca pago.
  it('bloqueia quando o pagamento não está confirmado', () => {
    expect(adminCancelBlockReason({ ...base, isPaid: false })).toMatch(/pagamento confirmado/);
  });

  /**
   * Achado M-3 do sexto review: a assinatura recebia `referenciaIso` e o
   * chamador passava `p.pagoEm ?? p.criadoEm`. Com `status: "pago"` e
   * `pagoEm: null`, o fallback fazia o prazo ser contado da CRIAÇÃO do pedido
   * em vez de bloquear — divergindo do cliente, que já checava `!paidAtIso`.
   */
  it('bloqueia pedido marcado como pago mas sem data de pagamento (paidAtIso null)', () => {
    expect(adminCancelBlockReason({ ...base, isPaid: true, paidAtIso: null })).toMatch(/pagamento confirmado/);
  });

  it('concorda com canCancelOrder no limite do prazo', () => {
    for (const dias of [CANCEL_WINDOW_DAYS - 1, CANCEL_WINDOW_DAYS, CANCEL_WINDOW_DAYS + 1]) {
      const iso = daysAgo(dias);
      const admin = adminCancelBlockReason({ ...base, paidAtIso: iso });
      const cliente = canCancelOrder({
        isAccountHolder: false,
        isCanceled: false,
        isPaid: true,
        paidAtIso: iso,
        anyTrainingStarted: false,
        now: NOW,
      });
      expect(admin === null).toBe(cliente.allowed);
    }
  });
});

/**
 * Tabela-verdade de equivalência cliente × admin (achado M-3 do quinto
 * review). O doc-comment do admin sempre prometeu "mesma regra do cliente",
 * mas o admin não checava pagamento nenhum: um pedido pendente era
 * "cancelável com estorno automático" para o operador e não para o cliente.
 *
 * Este teste varre o produto cartesiano das condições que os dois lados
 * compartilham e exige que a decisão (permitido / bloqueado) coincida. A
 * ÚNICA divergência aceita é deliberada e está explicitada abaixo: pedido de
 * cliente correntista/mensalista, que o cliente não pode cancelar (cobrança
 * consolidada, sem estorno individual) e o admin pode.
 */
describe('equivalência cliente × admin no cancelamento', () => {
  const bool = [false, true];
  const diasCasos = [0, CANCEL_WINDOW_DAYS, CANCEL_WINDOW_DAYS + 1];

  it('decide igual ao cliente em toda a tabela-verdade (salvo correntista)', () => {
    const divergencias: string[] = [];
    /**
     * `temData` é a dimensão acrescentada no sexto review: antes a data de
     * pagamento era derivada de `pago` (`pago ? iso : null`), então a
     * combinação `pago=true` + data ausente — a que o fallback
     * `p.pagoEm ?? p.criadoEm` mascarava no admin — nunca era varrida.
     * Agora ela é independente, e os dois lados devem bloquear.
     */
    let varreuPagoSemData = false;

    for (const correntista of bool) {
      for (const cancelado of bool) {
        for (const pago of bool) {
          for (const temData of bool) {
            for (const iniciado of bool) {
              for (const dias of diasCasos) {
                const iso = temData ? daysAgo(dias) : null;
                if (pago && !temData) varreuPagoSemData = true;
                const cliente = canCancelOrder({
                  isAccountHolder: correntista,
                  isCanceled: cancelado,
                  isPaid: pago,
                  paidAtIso: iso,
                  anyTrainingStarted: iniciado,
                  now: NOW,
                });
                const admin = adminCancelBlockReason({
                  anyStudentStarted: iniciado,
                  paidAtIso: iso,
                  isCanceled: cancelado,
                  isPaid: pago,
                  now: NOW,
                });
                const adminPermite = admin === null;

                // Divergência deliberada: correntista é bloqueado só no cliente.
                if (correntista && !cliente.allowed && adminPermite) continue;

                if (adminPermite !== cliente.allowed) {
                  divergencias.push(
                    `correntista=${correntista} cancelado=${cancelado} pago=${pago} ` +
                      `temData=${temData} iniciado=${iniciado} dias=${dias}: ` +
                      `cliente=${cliente.allowed} admin=${adminPermite}`,
                  );
                }
              }
            }
          }
        }
      }
    }

    expect(divergencias).toEqual([]);
    // A combinação que motivou a correção foi de fato exercitada.
    expect(varreuPagoSemData, 'pago=true + paidAtIso=null').toBe(true);
  });

  it('pago sem data de pagamento é bloqueado nos DOIS lados', () => {
    expect(
      canCancelOrder({
        isAccountHolder: false,
        isCanceled: false,
        isPaid: true,
        paidAtIso: null,
        anyTrainingStarted: false,
        now: NOW,
      }).allowed,
    ).toBe(false);
    expect(
      adminCancelBlockReason({
        anyStudentStarted: false,
        paidAtIso: null,
        isCanceled: false,
        isPaid: true,
        now: NOW,
      }),
    ).not.toBeNull();
  });

  it('a divergência de correntista é a única e é intencional', () => {
    const iso = daysAgo(1);
    const comum = { isCanceled: false, isPaid: true, paidAtIso: iso, anyTrainingStarted: false, now: NOW };
    expect(canCancelOrder({ ...comum, isAccountHolder: true }).allowed).toBe(false);
    expect(canCancelOrder({ ...comum, isAccountHolder: false }).allowed).toBe(true);
    expect(
      adminCancelBlockReason({
        anyStudentStarted: false,
        paidAtIso: iso,
        isCanceled: false,
        isPaid: true,
        now: NOW,
      }),
    ).toBeNull();
  });

  /**
   * Um caso só: as duas funções recebem `isPaid: false`, não o status
   * textual do pedido — iterar "pendente" e "falhou" repetia exatamente a
   * mesma chamada, mudando apenas a mensagem de erro do `expect`.
   */
  it('pedido não pago é bloqueado nos DOIS lados (regressão do M-3)', () => {
    expect(
      canCancelOrder({
        isAccountHolder: false,
        isCanceled: false,
        isPaid: false,
        paidAtIso: null,
        anyTrainingStarted: false,
        now: NOW,
      }).allowed,
    ).toBe(false);
    expect(
      adminCancelBlockReason({
        anyStudentStarted: false,
        paidAtIso: daysAgo(1),
        isCanceled: false,
        isPaid: false,
        now: NOW,
      }),
    ).not.toBeNull();
  });
});
