import { coursesOfOrder, studentsOfOrder } from '@/domain/orderCourses';
import type { Course } from '@/types/catalog';
import type { Cohort } from '@/types/cohorts';
import type { Customer } from '@/types/customers';
import type { Enrollment } from '@/types/enrollments';
import type { Order } from '@/types/orders';
import type { Sector } from '@/types/sectors';

export interface OrderData {
  customers: Customer[];
  courses: Course[];
  enrollments: Enrollment[];
  cohorts: Cohort[];
  sectors: Sector[];
}

export type OrderLookups = ReturnType<typeof buildOrderLookups>;

/** Joins the orders screen needs, built once per render from the server data. */
export function buildOrderLookups({ customers, courses, enrollments, cohorts, sectors }: OrderData) {
  const byId = new Map(customers.map((c) => [c.id, c]));
  return {
    customerOf: (id: string) => byId.get(id),
    coursesOf: (o: Order) => coursesOfOrder(o, courses),
    studentsOf: (o: Order) => studentsOfOrder(o, courses, enrollments, customers),
    /** Cohorts a credit can be linked to: same course, not canceled/completed, by start date. */
    cohortsOfCourse: (courseId: string) =>
      cohorts
        .filter((t) => t.courseId === courseId && (t.status === 'open' || t.status === 'closed'))
        .sort((a, b) => a.startDate.localeCompare(b.startDate)),
    sectorName: (id: string | null) => sectors.find((s) => s.id === id)?.name ?? '—',
  };
}
