import { z } from 'zod';
import type { Course } from '@/types/catalog';

/** A path of the site (`/images/…`) or an http(s) address; empty falls back to the placeholder. */
export const isImageUrl = (value: string) =>
  value === '' || (value.startsWith('/') && !value.startsWith('//')) || /^https?:\/\/\S+$/.test(value);

const lesson = z.object({ title: z.string(), duration: z.string(), free: z.boolean().optional() });

export const courseSchema = z
  .object({
    title: z.string().trim().min(1, 'Informe o título do curso'),
    slug: z.string().trim(),
    description: z.string().trim(),
    longDescription: z.string().trim(),
    category: z.string().trim(),
    sectorId: z.string().min(1, 'Selecione o setor do curso'),
    credentialIds: z.array(z.string()),
    active: z.boolean(),
    modality: z.enum(['in_person', 'online', 'hybrid']),
    duration: z.string().trim(),
    defaultLocation: z.string().trim(),
    sapCode: z.string().trim(),
    price: z.number().min(0),
    originalPrice: z.number().min(0).nullable(),
    nextDate: z.string().trim(),
    spotsLeft: z.number().int().min(0),
    imageUrl: z.string().trim().refine(isImageUrl, 'Use um caminho do site (/images/…) ou um endereço http(s)'),
    students: z.number().int().min(0),
    rating: z.number().min(0).max(5),
    reviews: z.number().int().min(0),
    certificate: z.boolean(),
    modules: z.number().int().min(0),
    learningPoints: z.array(z.string()),
    targetAudience: z.array(z.string()),
    prerequisites: z.array(z.string()),
    curriculum: z.array(z.object({ title: z.string(), lessons: z.array(lesson) })),
    instructor: z.string().trim(),
    instructorRole: z.string().trim(),
    instructorBio: z.string().trim(),
    instructorCourses: z.number().int().min(0),
    instructorStudents: z.number().int().min(0),
  })
  .refine((c) => c.originalPrice === null || c.originalPrice > c.price, {
    // A struck-through price must be above the price, or the "de/por" shows no discount (#68).
    message: 'O preço original precisa ser maior que o preço',
    path: ['originalPrice'],
  });

export type CourseFormValues = z.infer<typeof courseSchema>;

export const emptyCourse: CourseFormValues = {
  title: '',
  slug: '',
  description: '',
  longDescription: '',
  category: '',
  sectorId: '',
  credentialIds: [],
  active: true,
  modality: 'in_person',
  duration: '',
  defaultLocation: '',
  sapCode: '',
  price: 0,
  originalPrice: null,
  nextDate: '',
  spotsLeft: 30,
  imageUrl: '/placeholder.svg',
  students: 0,
  rating: 5,
  reviews: 0,
  certificate: true,
  modules: 0,
  learningPoints: [],
  targetAudience: [],
  prerequisites: [],
  curriculum: [],
  instructor: '',
  instructorRole: '',
  instructorBio: '',
  instructorCourses: 0,
  instructorStudents: 0,
};

export const toCourseValues = ({ id: _id, updatedAt: _u, ...c }: Course): CourseFormValues => ({
  ...c,
  defaultLocation: c.defaultLocation ?? '',
  sapCode: c.sapCode ?? '',
});
