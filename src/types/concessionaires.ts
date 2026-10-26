import type { Id } from './common';
import type { BillingTag } from './customers';

export type ConcessionaireType = 'airline' | 'handling' | 'retail' | 'public_agency' | 'services' | 'other';

/** Company operating at the airport (the courses' target audience). */
export interface Concessionaire {
  id: Id;
  name: string;
  cnpj: string;
  type: ConcessionaireType;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  /** Terminal/area of operation. */
  location: string;
  active: boolean;
  createdAt: string;
  billingTag?: BillingTag;
}
