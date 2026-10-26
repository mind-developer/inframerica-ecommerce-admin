import type { StoreSettings } from '@/types/settings';

/** The training store starts open. */
export const storeSettingsSeed: StoreSettings = {
  storeClosed: false,
  message: 'Estamos temporariamente indisponíveis para novas compras de treinamentos. Voltamos em breve.',
  contactChannel: 'atendimento@inframerica.com',
  mode: 'hide_menu',
  notifyOnReopen: true,
};
