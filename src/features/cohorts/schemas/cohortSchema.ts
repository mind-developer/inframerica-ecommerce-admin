import { z } from 'zod';

export const cohortSchema = z
  .object({
    courseId: z.string().min(1, 'Preencha curso e data de início'),
    startDate: z.string().min(1, 'Preencha curso e data de início'),
    endDate: z.string(),
    schedule: z.string().trim(),
    location: z.string().trim(),
    totalSeats: z.number().int().min(0),
    takenSeats: z.number().int().min(0),
    status: z.enum(['open', 'closed', 'completed', 'canceled']),
    meetingPoint: z.string().trim(),
    materials: z.string().trim(),
    emailTemplate: z.string(),
  })
  .refine((c) => !c.endDate || c.endDate >= c.startDate, {
    message: 'A data de fim deve ser depois do início',
    path: ['endDate'],
  })
  .refine((c) => c.takenSeats <= c.totalSeats, {
    message: 'Ocupadas não pode passar do total de vagas',
    path: ['takenSeats'],
  });

export type CohortFormValues = z.infer<typeof cohortSchema>;

export const emptyCohort: CohortFormValues = {
  courseId: '',
  startDate: '',
  endDate: '',
  schedule: '08:00–18:00',
  location: '',
  totalSeats: 30,
  takenSeats: 0,
  status: 'open',
  meetingPoint: '',
  materials: '',
  emailTemplate: '',
};
