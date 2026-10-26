import { z } from 'zod';

export const heroSchema = z.object({
  eyebrow: z.string().trim(),
  title: z.string().trim(),
  titleHighlight: z.string().trim(),
  subtitle: z.string().trim(),
  ctaLabel: z.string().trim(),
  heroImageUrl: z.string().trim(),
  heroVideoUrl: z.string().trim(),
});

export const contactSchema = z.object({
  email: z.string().trim(),
  phone: z.string().trim(),
  address: z.string().trim(),
});

export const faqSchema = z.array(
  z.object({ question: z.string().trim().min(1, 'Toda pergunta precisa de texto'), answer: z.string().trim() }),
);

const civilDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida');

export const bannerSchema = z
  .object({
    title: z.string().trim().min(1, 'Informe o título do banner'),
    subtitle: z.string().trim(),
    ctaLabel: z.string().trim(),
    ctaHref: z.string().trim(),
    imageUrl: z.string().trim(),
    imageUrlTablet: z.string().trim(),
    imageUrlMobile: z.string().trim(),
    position: z.number().int(),
    active: z.boolean(),
    scheduled: z.boolean(),
    startDate: z.union([civilDate, z.literal('')]),
    endDate: z.union([civilDate, z.literal('')]),
    gaIntegrationId: z.string().trim(),
  })
  .refine((b) => !b.scheduled || !b.startDate || !b.endDate || b.startDate <= b.endDate, {
    message: 'A data de fim deve ser depois do início',
    path: ['endDate'],
  });

export type HeroValues = z.infer<typeof heroSchema>;
export type ContactValues = z.infer<typeof contactSchema>;
export type BannerValues = z.infer<typeof bannerSchema>;
