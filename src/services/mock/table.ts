import type { Id } from '@/types/common';

/**
 * An in-memory table seeded with mock data — stands in for a REST resource until the API exists.
 * Reads return copies, so callers can't mutate the stored rows by accident.
 */
export class MockTable<T extends { id: Id }> {
  private rows: T[];

  constructor(private readonly seed: readonly T[]) {
    this.rows = structuredClone([...seed]);
  }

  all(): T[] {
    return structuredClone(this.rows);
  }

  find(id: Id): T | null {
    const row = this.rows.find((r) => r.id === id);
    return row ? structuredClone(row) : null;
  }

  findBy(predicate: (row: T) => boolean): T | null {
    const row = this.rows.find(predicate);
    return row ? structuredClone(row) : null;
  }

  insert(row: T): T {
    this.rows.push(structuredClone(row));
    return structuredClone(row);
  }

  update(id: Id, patch: Partial<T>): T {
    const index = this.rows.findIndex((r) => r.id === id);
    const current = this.rows[index];
    if (!current) throw new Error(`Registro ${id} não encontrado`);
    const next = { ...current, ...patch, id };
    this.rows[index] = next;
    return structuredClone(next);
  }

  remove(id: Id): void {
    this.rows = this.rows.filter((r) => r.id !== id);
  }

  /** Test helper: replaces every row. */
  replaceAll(rows: readonly T[]): void {
    this.rows = structuredClone([...rows]);
  }

  reset(): void {
    this.rows = structuredClone([...this.seed]);
  }
}

/** Short random id with a resource prefix, e.g. `cup-1a2b3c4d`. */
export const newId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;

export const nowIso = () => new Date().toISOString();

/** Optional artificial latency (`MOCK_LATENCY_MS`), so loading states show up in development. */
export const latency = async () => {
  const ms = Number(process.env.MOCK_LATENCY_MS ?? 0);
  if (ms > 0) await new Promise((r) => setTimeout(r, ms));
};
