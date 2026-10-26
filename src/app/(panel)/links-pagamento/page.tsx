import type { Metadata } from 'next';
import { PaymentLinksPage } from '@/features/payment-links/server';

export const metadata: Metadata = { title: 'Links de Pagamento' };

export default function Page() {
  return <PaymentLinksPage />;
}
