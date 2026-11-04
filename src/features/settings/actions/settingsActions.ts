'use server';

import { adminMutation } from '@/features/auth/server';
import { updateOrderSettings, updateStoreSettings } from '@/services/content.service';
import type { ActionResult } from '@/types/common';
import type { OrderSettings } from '@/types/orderSettings';
import type { StoreSettings } from '@/types/settings';
import { storeSettingsSchema } from '../schemas/storeSettingsSchema';

/** Closing or reopening the training store must reach the storefront at once. */
export async function saveStoreSettings(patch: Partial<StoreSettings>): Promise<ActionResult<StoreSettings>> {
  const parsed = storeSettingsSchema.partial().safeParse(patch);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  return adminMutation('settings', ['store-settings'], () => updateStoreSettings(parsed.data), ['store-settings']);
}

export async function saveAutoCancelDays(days: number): Promise<ActionResult<OrderSettings>> {
  if (!Number.isInteger(days) || days < 1) return { ok: false, error: 'Informe pelo menos 1 dia' };
  return adminMutation('settings', ['order-settings'], () => updateOrderSettings({ autoCancelDays: days }));
}

/** Mock BI token (no endpoint behind it): a fresh random value. */
export async function regenerateBiToken(): Promise<ActionResult<OrderSettings>> {
  const token = `sk_live_bi_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`;
  return adminMutation('settings', ['order-settings'], () => updateOrderSettings({ biToken: token }));
}
