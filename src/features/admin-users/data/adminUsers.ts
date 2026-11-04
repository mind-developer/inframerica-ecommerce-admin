import 'server-only';
import { listAdminUsers } from '@/services/access.service';

export const getAdminUsers = () => listAdminUsers();
