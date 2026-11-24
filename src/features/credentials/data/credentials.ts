import 'server-only';
import { credentialsService } from '@/services/credentials.service';

/** Every credential (#69). Read per request: it needs the admin's API token. */
export const getCredentials = () => credentialsService.list();
