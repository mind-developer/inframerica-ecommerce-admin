import type { Id } from './common';

/** Registration category, needed for SAP invoicing. */
export type CustomerCategory = 'individual' | 'company' | 'public_agency';

/** Billing rule for releasing credits: paying per order, monthly account holder, or exempt. */
export type BillingTag = 'paying' | 'account_holder' | 'exempt';

export interface Customer {
  id: Id;
  name: string;
  email: string;
  phone: string;
  company: string;
  document: string;
  sectorId: string | null;
  createdAt: string;
  /** CNPJ; may equal `document` for companies, kept apart for individuals with a linked company. */
  cnpj?: string;
  category?: CustomerCategory;
  billingTag?: BillingTag;
  /** SAP billing data (invoicing is sometimes manual). */
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  stateRegistration?: string;
}

export type CustomerInput = Omit<Customer, 'id' | 'createdAt'>;
