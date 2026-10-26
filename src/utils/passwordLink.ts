import { STOREFRONT_URL } from '@/constants/links';

/** Set-password link the admin copies or (simulated) e-mails. MOCK: no endpoint validates the token yet. */
export const passwordLink = (token: string = crypto.randomUUID().slice(0, 8)) =>
  `${STOREFRONT_URL}/definir-senha?token=${token}`;
