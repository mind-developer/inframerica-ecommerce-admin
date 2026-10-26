import { describe, expect, it } from 'vitest';
import type { Course } from '@/types/catalog';
import type { Cohort } from '@/types/cohorts';
import type { Customer } from '@/types/customers';
import type { Enrollment } from '@/types/enrollments';
import type { Order } from '@/types/orders';
import { buildOrderLookups } from './orderLookups';

const customer = { id: 'c1', name: 'Acme', sectorId: 's1' } as Customer;
const course = (id: string, title: string) => ({ id, title }) as Course;
const order = {
  id: 'p1',
  customerId: 'c1',
  description: 'x',
  items: [{ courseId: 'k1', quantity: 1, unitPrice: 10 }],
} as Order;
const enrollment = (id: string, courseId: string, customerName = 'Acme') =>
  ({ id, courseId, customerName }) as Enrollment;
const cohort = (id: string, courseId: string, startDate: string, status: Cohort['status'] = 'open') =>
  ({ id, courseId, startDate, status }) as Cohort;

const lookups = buildOrderLookups({
  customers: [customer],
  courses: [course('k1', 'Segurança'), course('k2', 'Direção')],
  enrollments: [enrollment('e1', 'k1'), enrollment('e2', 'k2'), enrollment('e3', 'k1', 'Other')],
  cohorts: [
    cohort('t2', 'k1', '2026-12-01'),
    cohort('t1', 'k1', '2026-11-01'),
    cohort('t3', 'k1', '2026-10-01', 'canceled'),
    cohort('t4', 'k2', '2026-11-01'),
  ],
  sectors: [{ id: 's1', name: 'Aviação' } as never],
});

describe('buildOrderLookups', () => {
  it('finds customers by id', () => {
    expect(lookups.customerOf('c1')).toBe(customer);
    expect(lookups.customerOf('nope')).toBeUndefined();
  });

  it('resolves the courses and students of an order', () => {
    expect(lookups.coursesOf(order).map((c) => c.id)).toEqual(['k1']);
    expect(lookups.studentsOf(order).map((m) => m.id)).toEqual(['e1']);
  });

  it('lists the linkable cohorts of a course by start date, skipping canceled/completed ones', () => {
    expect(lookups.cohortsOfCourse('k1').map((t) => t.id)).toEqual(['t1', 't2']);
  });

  it('names sectors, with a dash for none', () => {
    expect(lookups.sectorName('s1')).toBe('Aviação');
    expect(lookups.sectorName(null)).toBe('—');
  });
});
