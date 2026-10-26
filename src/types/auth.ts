import type { AdminRole } from './adminUsers';

/** The signed-in admin as the UI sees it. */
export interface AdminSessionUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}
