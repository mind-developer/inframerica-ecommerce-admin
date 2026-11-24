/**
 * In-memory stand-in for `services/credentials.service` (the API), over the mock db's seed credentials.
 * `test/setup.ts` installs it for every test; `credentials.service.test.ts` tests the real one.
 */
import { createCrudService } from '@/services/mock/crud';
import { getDb } from '@/services/mock/db';
import { nowIso } from '@/services/mock/table';
import type { Credential, CredentialInput } from '@/types/catalog';

export const credentialsService = createCrudService<Credential, CredentialInput>(
  () => getDb().credentials,
  (input) => ({ ...input, createdAt: nowIso() }),
  'cred',
);
