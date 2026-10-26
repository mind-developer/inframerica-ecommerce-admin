import type { Id } from './common';

export type PaymentLinkStatus = 'draft' | 'sent' | 'paid' | 'expired';

/** One-off charge the admin generates and e-mails to a customer. */
export interface PaymentLink {
  id: Id;
  customerId: string;
  email: string;
  description: string;
  amount: number;
  url: string;
  status: PaymentLinkStatus;
  sentAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

export type PaymentLinkInput = Omit<PaymentLink, 'id' | 'createdAt' | 'url'>;
