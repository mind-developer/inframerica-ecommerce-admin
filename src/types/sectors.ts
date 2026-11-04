import type { Id } from './common';

/** Area that groups courses and customers by specialty. */
export interface Sector {
  id: Id;
  name: string;
  description: string;
  manager: string;
  active: boolean;
}

export type SectorInput = Omit<Sector, 'id'>;

/** One page of the sectors list, as the API answers it. */
export interface SectorPage {
  items: Sector[];
  total: number;
  page: number;
  pageSize: number;
}
