import type { Id } from './common';

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'pix' | 'card' | 'bank_slip' | 'transfer';
export type ServiceType = 'training' | 'credentialing' | 'vip_lounge';

/** One purchased line: course, quantity and the unit price at purchase time. */
export interface OrderItem {
  courseId: Id;
  quantity: number;
  unitPrice: number;
}

/** An order (canonical model; the prototype called it "Pagamento"). */
export interface Order {
  id: Id;
  customerId: string;
  description: string;
  /**
   * Order amount in BRL. ASSUMPTION (prototype pending item 7): read as the NET amount (after discount) by
   * the sales report; the orders KPI labels the same sum "Valor bruto". Decide with the API contract.
   */
  amount: number;
  method: PaymentMethod;
  status: OrderStatus;
  reference: string;
  createdAt: string;
  paidAt: string | null;
  /** Mock categorization for the orders filter; missing means "training". */
  serviceType?: ServiceType;
  cancellationReason?: string;
  canceledAt?: string | null;
  /** Empty for seed orders without an identifiable course (refunds, credentialing). */
  items: OrderItem[];
  couponCode?: string | null;
  discountAmount?: number;
}

export type OrderInput = Omit<Order, 'id' | 'createdAt'>;
