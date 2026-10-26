/** Opaque identifier; a UUID once the API exists. */
export type Id = string;

/** Outcome of a business rule check: allowed, or blocked with a user-facing reason (pt-BR). */
export interface RuleResult {
  allowed: boolean;
  reason?: string;
}

/** What every admin server action returns: the data, or a user-facing error (pt-BR). */
export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };
