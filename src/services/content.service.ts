import 'server-only';
import { siteContentSeed } from '@/mocks/siteContent';
import type { SiteContent, SiteContentInput } from '@/types/content';
import type { OrderSettings } from '@/types/orderSettings';
import type { StoreSettings } from '@/types/settings';
import { getDb } from './mock/db';
import { latency, nowIso } from './mock/table';

export async function getSiteContent(): Promise<SiteContent> {
  await latency();
  return structuredClone(getDb().siteContent.value);
}

/** PATCH by section: hero and contact merge field by field; `updatedAt` is stamped here. */
export async function updateSiteContent(patch: Partial<SiteContentInput>): Promise<SiteContent> {
  await latency();
  const db = getDb();
  const current = db.siteContent.value;
  db.siteContent.value = {
    ...current,
    ...patch,
    hero: { ...current.hero, ...patch.hero },
    contact: { ...current.contact, ...patch.contact },
    banners: patch.banners ?? current.banners,
    updatedAt: nowIso(),
  };
  return structuredClone(db.siteContent.value);
}

export async function resetSiteContent(): Promise<SiteContent> {
  await latency();
  getDb().siteContent.value = structuredClone(siteContentSeed);
  return structuredClone(siteContentSeed);
}

export async function getStoreSettings(): Promise<StoreSettings> {
  await latency();
  return structuredClone(getDb().storeSettings.value);
}

export async function updateStoreSettings(patch: Partial<StoreSettings>): Promise<StoreSettings> {
  await latency();
  const db = getDb();
  db.storeSettings.value = { ...db.storeSettings.value, ...patch };
  return structuredClone(db.storeSettings.value);
}

export async function getOrderSettings(): Promise<OrderSettings> {
  await latency();
  return structuredClone(getDb().orderSettings.value);
}

export async function updateOrderSettings(patch: Partial<OrderSettings>): Promise<OrderSettings> {
  await latency();
  const db = getDb();
  db.orderSettings.value = { ...db.orderSettings.value, ...patch };
  return structuredClone(db.orderSettings.value);
}
