import 'server-only';
import type { Id } from '@/types/common';
import { latency, newId, type MockTable } from './table';

export interface CrudService<T, TInput> {
  list(): Promise<T[]>;
  get(id: Id): Promise<T | null>;
  create(input: TInput): Promise<T>;
  update(id: Id, patch: Partial<TInput>): Promise<T>;
  remove(id: Id): Promise<void>;
}

/**
 * A REST-like CRUD over one mock table: list → GET /x, get → GET /x/:id, create → POST, update → PATCH,
 * remove → DELETE. `build` turns the input into a stored row (server-side stamps such as createdAt).
 */
export function createCrudService<T extends { id: Id }, TInput>(
  table: () => MockTable<T>,
  build: (input: TInput) => Omit<T, 'id'>,
  idPrefix: string,
): CrudService<T, TInput> {
  return {
    async list() {
      await latency();
      return table().all();
    },
    async get(id) {
      await latency();
      return table().find(id);
    },
    async create(input) {
      await latency();
      return table().insert({ ...build(input), id: newId(idPrefix) } as T);
    },
    async update(id, patch) {
      await latency();
      return table().update(id, patch as Partial<T>);
    },
    async remove(id) {
      await latency();
      table().remove(id);
    },
  };
}
