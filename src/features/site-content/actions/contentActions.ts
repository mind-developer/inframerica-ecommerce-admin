'use server';

import { adminMutation } from '@/features/auth/server';
import { getSiteContent, resetSiteContent, updateSiteContent } from '@/services/content.service';
import type { ActionResult } from '@/types/common';
import type { Banner, FaqItem, SiteContent } from '@/types/content';
import {
  bannerSchema,
  contactSchema,
  faqSchema,
  heroSchema,
  type BannerValues,
  type ContactValues,
  type HeroValues,
} from '../schemas/contentSchemas';

/** Every CMS write expires the admin cache and tells the storefront to refresh its pages. */
const save = (patch: Partial<SiteContent>, resource: 'content' | 'banners' = 'content') =>
  adminMutation(resource, ['site-content'], () => updateSiteContent(patch), ['site-content']);

const invalid = (issues: { message: string }[]) => ({
  ok: false as const,
  error: issues[0]?.message ?? 'Dados inválidos',
});

export async function saveHero(values: HeroValues): Promise<ActionResult<SiteContent>> {
  const parsed = heroSchema.safeParse(values);
  return parsed.success ? save({ hero: parsed.data }) : invalid(parsed.error.issues);
}

export async function saveContact(values: ContactValues): Promise<ActionResult<SiteContent>> {
  const parsed = contactSchema.safeParse(values);
  return parsed.success ? save({ contact: parsed.data }) : invalid(parsed.error.issues);
}

export async function saveFaq(items: FaqItem[]): Promise<ActionResult<SiteContent>> {
  const parsed = faqSchema.safeParse(items);
  return parsed.success ? save({ faq: parsed.data }) : invalid(parsed.error.issues);
}

export async function saveAbout(text: string): Promise<ActionResult<SiteContent>> {
  return save({ about: text.trim() });
}

export async function resetContent(): Promise<ActionResult<SiteContent>> {
  return adminMutation('content', ['site-content'], () => resetSiteContent(), ['site-content']);
}

const toBanner = (id: string, { scheduled, startDate, endDate, imageUrl, ...rest }: BannerValues): Banner => ({
  ...rest,
  id,
  imageUrl,
  imageUrlDesktop: imageUrl,
  startDate: scheduled ? startDate || null : null,
  endDate: scheduled ? endDate || null : null,
});

/** Banners are stored inside the site content; ids are generated here. */
export async function saveBanner(id: string | null, values: BannerValues): Promise<ActionResult<SiteContent>> {
  const parsed = bannerSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error.issues);
  const { banners } = await getSiteContent();
  const banner = toBanner(id ?? `ban-${crypto.randomUUID().slice(0, 8)}`, parsed.data);
  return save({ banners: id ? banners.map((b) => (b.id === id ? banner : b)) : [...banners, banner] }, 'banners');
}

export async function setBannerActive(id: string, active: boolean): Promise<ActionResult<SiteContent>> {
  const { banners } = await getSiteContent();
  return save({ banners: banners.map((b) => (b.id === id ? { ...b, active } : b)) }, 'banners');
}

export async function deleteBanner(id: string): Promise<ActionResult<SiteContent>> {
  const { banners } = await getSiteContent();
  return save({ banners: banners.filter((b) => b.id !== id) }, 'banners');
}
