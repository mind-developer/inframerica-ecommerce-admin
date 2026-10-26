import type { Id } from './common';

export interface Banner {
  id: Id;
  title: string;
  subtitle: string;
  /** Button text; empty hides the CTA. */
  ctaLabel: string;
  ctaHref: string;
  /** Fallback image when no breakpoint-specific image is set. */
  imageUrl: string;
  imageUrlDesktop?: string;
  imageUrlTablet?: string;
  imageUrlMobile?: string;
  position: number;
  active: boolean;
  /** Civil dates (`YYYY-MM-DD`); null = no schedule. */
  startDate?: string | null;
  endDate?: string | null;
  /** Google Analytics integration id; clicks are measured there. */
  gaIntegrationId?: string;
}

export interface FaqItem {
  question: string;
  /** Plain text; supports `[label](url)` links. */
  answer: string;
}

/** Site content edited in the admin CMS. */
export interface SiteContent {
  hero: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaLabel: string;
    heroImageUrl?: string;
    heroVideoUrl?: string;
  };
  banners: Banner[];
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  faq?: FaqItem[];
  /** Free institutional text ("Sobre nós"). */
  about?: string;
  updatedAt: string;
}

export type BannerInput = Omit<Banner, 'id'>;
export type SiteContentInput = Omit<SiteContent, 'updatedAt'>;
