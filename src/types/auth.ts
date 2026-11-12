/** The signed-in admin as the UI sees it, with what they may do. */
export interface AdminSessionUser {
  id: string;
  name: string;
  email: string;
  /** No profile: holds every permission. */
  owner: boolean;
  /** Sector the panel is limited to (courses and orders); null sees every sector. */
  sectorId: string | null;
  profile: { id: string; name: string } | null;
  /** "resource.action" pairs, e.g. "orders.read". */
  permissions: string[];
}
