/** Mock seed, converted from the prototype's `src/mocks` with English field names. Temporary: deleted when the API ships. */
import type { AdminUser } from '@/types/adminUsers';

export const adminUsersSeed: AdminUser[] = [
  {
    id: 'usr-0',
    name: 'Administrador Inframérica',
    email: 'admin@inframerica.com',
    role: 'super_admin',
    sectorId: null,
    active: true,
    createdAt: '2025-01-01',
  },
  {
    id: 'usr-1',
    name: 'Administrador Geral',
    email: 'admin@infraamerica.com',
    role: 'super_admin',
    sectorId: null,
    active: true,
    createdAt: '2025-01-01',
  },
  {
    id: 'usr-2',
    name: 'Mariana Souza',
    email: 'mariana.souza@infraamerica.com',
    role: 'admin',
    sectorId: 'set-avsec',
    active: true,
    createdAt: '2025-06-15',
  },
  {
    id: 'usr-3',
    name: 'Felipe Andrade',
    email: 'felipe.andrade@infraamerica.com',
    role: 'operator',
    sectorId: 'set-operacional',
    active: true,
    createdAt: '2025-09-02',
  },
  {
    id: 'usr-4',
    name: 'Patrícia Nogueira',
    email: 'patricia.nogueira@infraamerica.com',
    role: 'finance',
    sectorId: null,
    active: true,
    createdAt: '2025-10-22',
  },
  {
    id: 'usr-5',
    name: 'Ricardo Tavares',
    email: 'ricardo.tavares@infraamerica.com',
    role: 'operator',
    sectorId: 'set-tecnologia',
    active: false,
    createdAt: '2024-08-10',
  },
];
