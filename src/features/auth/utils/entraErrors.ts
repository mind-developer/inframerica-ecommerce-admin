/** What the sign-in page says after a Microsoft sign-in that didn't work (`?erro=`). */
export const ENTRA_ERRORS = {
  'sem-acesso': 'Sua conta não tem acesso a este painel. Peça a um administrador para adicionar você.',
  inativo: 'Seu acesso a este painel está desativado.',
  externo: 'Entre com uma conta da Inframérica.',
  cancelado: 'O login com a Microsoft não foi concluído.',
  expirado: 'O login demorou demais ou foi iniciado em outra janela. Tente de novo.',
  falha: 'Não foi possível confirmar seu login com a Microsoft. Tente de novo.',
  indisponivel: 'Não foi possível entrar agora. Tente novamente em instantes.',
} as const;

export type EntraError = keyof typeof ENTRA_ERRORS;

export const entraErrorMessage = (code: string | null | undefined): string | null =>
  code && Object.hasOwn(ENTRA_ERRORS, code) ? ENTRA_ERRORS[code as EntraError] : null;

/** The API's refusals, in the page's terms. */
export const fromApiStatus = (status: string | undefined): EntraError =>
  status === 'not-invited'
    ? 'sem-acesso'
    : status === 'inactive'
      ? 'inativo'
      : status === 'outside-tenant'
        ? 'externo'
        : 'falha';
