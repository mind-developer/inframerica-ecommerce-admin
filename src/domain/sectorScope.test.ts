import type { Course } from '@/types/catalog';
import type { Order } from '@/types/orders';
import { coursesInSector, ordersInSector, sectorOf } from './sectorScope';

const course = (id: string, sectorId: string) => ({ id, sectorId }) as Course;
const order = (id: string, courseIds: string[]) =>
  ({ id, items: courseIds.map((courseId) => ({ courseId, quantity: 1, unitPrice: 10 })) }) as Order;

const courses = [course('avsec', 'set-avsec'), course('ops', 'set-ops')];
const orders = [order('o1', ['avsec']), order('o2', ['ops']), order('o3', ['ops', 'avsec']), order('o4', [])];

describe('sectorOf', () => {
  it('scopes an admin with a sector; the owner and admins without sector see everything', () => {
    expect(sectorOf({ owner: false, sectorId: 'set-avsec' })).toBe('set-avsec');
    expect(sectorOf({ owner: true, sectorId: 'set-avsec' })).toBeNull();
    expect(sectorOf({ owner: false, sectorId: null })).toBeNull();
  });
});

describe('coursesInSector / ordersInSector', () => {
  it('keeps only the courses of the sector', () => {
    expect(coursesInSector(courses, 'set-avsec').map((c) => c.id)).toEqual(['avsec']);
    expect(coursesInSector(courses, null)).toBe(courses);
  });

  it('keeps orders with a course of the sector; orders without courses stay out', () => {
    expect(ordersInSector(orders, courses, 'set-avsec').map((o) => o.id)).toEqual(['o1', 'o3']);
    expect(ordersInSector(orders, courses, null)).toBe(orders);
  });
});
