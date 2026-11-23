import 'server-only';
import type { Credential, CredentialInput } from '@/types/catalog';
import { createCrudService } from './mock/crud';
import { getDb } from './mock/db';
import { nowIso } from './mock/table';

/** Credentials, still in the mock. Courses moved to the API (`courses.service.ts`). */
export const credentialsService = createCrudService<Credential, CredentialInput>(
  () => getDb().credentials,
  (input) => ({ ...input, createdAt: nowIso() }),
  'cred',
);
