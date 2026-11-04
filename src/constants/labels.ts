/** User-facing domain labels in one place (pt-BR). */
import type { Modality } from '@/types/catalog';
import type { CohortStatus } from '@/types/cohorts';
import type { BillingTag, CustomerCategory } from '@/types/customers';
import type { EnrollmentStatus } from '@/types/enrollments';
import type { OrderStatus, PaymentMethod, ServiceType } from '@/types/orders';
import type { PaymentLinkStatus } from '@/types/paymentLinks';

export const MODALITY_LABEL: Record<Modality, string> = {
  in_person: 'Presencial',
  online: 'Online',
  hybrid: 'Híbrido',
};

export const ENROLLMENT_STATUS_LABEL: Record<EnrollmentStatus, string> = {
  pending: 'Pendente',
  enrolled: 'Matriculada',
  in_progress: 'Em andamento',
  completed: 'Concluída',
};
export const ENROLLMENT_STATUS_ORDER: EnrollmentStatus[] = ['pending', 'enrolled', 'in_progress', 'completed'];

/**
 * Order status as named in the report/BI. Must read the same as the customer area's payment labels
 * (`failed` ↔ `error`, `refunded` ↔ `canceled`) until A2 unifies the two models.
 */
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  paid: 'Pago',
  pending: 'Pendente',
  failed: 'Erro no processamento',
  refunded: 'Cancelado',
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  pix: 'PIX',
  card: 'Cartão',
  bank_slip: 'Boleto',
  transfer: 'Transferência',
};

export const SERVICE_TYPE_LABEL: Record<ServiceType, string> = {
  training: 'Treinamento',
  credentialing: 'Credenciamento',
  vip_lounge: 'Sala VIP',
};

export const CUSTOMER_CATEGORY_LABEL: Record<CustomerCategory, string> = {
  individual: 'Pessoa física',
  company: 'Pessoa jurídica',
  public_agency: 'Órgão público',
};

export const BILLING_TAG_LABEL: Record<BillingTag, string> = {
  paying: 'Pagante normal',
  account_holder: 'Correntista/Mensalista',
  exempt: 'Isento',
};

export const COHORT_STATUS_LABEL: Record<CohortStatus, string> = {
  open: 'Aberta',
  closed: 'Fechada',
  completed: 'Concluída',
  canceled: 'Cancelada',
};

export const PAYMENT_LINK_STATUS_LABEL: Record<PaymentLinkStatus, string> = {
  draft: 'Rascunho',
  sent: 'Enviado',
  paid: 'Pago',
  expired: 'Expirado',
};
