/** Opaque identifier; a UUID once the API exists. */
export type Id = string;

/** Outcome of a business rule check: allowed, or blocked with a user-facing reason (pt-BR). */
export interface RuleResult {
  allowed: boolean;
  reason?: string;
}

/** What every admin server action returns: the data, or a user-facing error (pt-BR). */
export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

/** One page of a paginated API list (`?page=&pageSize=`). */
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
