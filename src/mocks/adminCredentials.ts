/**
 * Demo passwords of the admin accounts (PROTOTYPE ONLY), kept apart from the AdminUser records the
 * "Usuários" screen edits. Lives only in server memory; goes away with the mock authentication.
 */
export const adminPasswordsSeed: Record<string, string> = {
  'admin@inframerica.com': '123456',
};

export const DEFAULT_ORDER_SETTINGS = { autoCancelDays: 7, biToken: 'sk_live_bi_3f9a1c7e5b2d8f0a6c4e1b9d' };
