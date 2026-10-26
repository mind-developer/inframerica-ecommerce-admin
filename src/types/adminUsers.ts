import type { Id } from './common';

export type AdminRole = 'super_admin' | 'admin' | 'operator' | 'finance';

/** A person with access to the admin panel (not a customer). */
export interface AdminUser {
  id: Id;
  name: string;
  email: string;
  role: AdminRole;
  sectorId: string | null;
  active: boolean;
  createdAt: string;
}

export type AdminUserInput = Omit<AdminUser, 'id' | 'createdAt'>;
