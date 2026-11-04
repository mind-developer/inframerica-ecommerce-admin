import 'server-only';
import { listAllSectors } from '@/services/sectors.service';

/** Every sector, for the selects on other screens. Read per request: it needs the admin's API token. */
export const getSectors = () => listAllSectors();
