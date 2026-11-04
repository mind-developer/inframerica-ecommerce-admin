/** The signed-in admin as the UI sees it, with what they may do. */
export interface AdminSessionUser {
  id: string;
  name: string;
  email: string;
  /** No profile: holds every permission. */
  owner: boolean;
  profile: { id: string; name: string } | null;
  /** "resource.action" pairs, e.g. "orders.read". */
  permissions: string[];
}
