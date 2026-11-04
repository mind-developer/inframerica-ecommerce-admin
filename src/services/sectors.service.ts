/** Sectors, from inframerica-ecommerce-api. Mock courses and credentials point to them by id. */
import 'server-only';
import type { Sector, SectorInput, SectorPage } from '@/types/sectors';
import { adminRead, adminWrite } from './api/adminApi';

const notFound = 'Setor não encontrado';
const conflicts = { 'name-taken': 'Já existe um setor com este nome' };

export function listSectorPage({ q, status, page }: { q: string; status: string | null; page: number }) {
  const query = new URLSearchParams({ q, page: String(page) });
  if (status) query.set('status', status);
  return adminRead<SectorPage>(`/admin/sectors?${query}`);
}

export const listAllSectors = () => adminRead<Sector[]>('/admin/sectors/all');

export const createSector = (values: SectorInput) =>
  adminWrite('/admin/sectors', 'POST', { body: values, conflicts, notFound });

export const updateSector = (id: string, values: SectorInput) =>
  adminWrite(`/admin/sectors/${id}`, 'PATCH', { body: values, conflicts, notFound });

export const removeSector = (id: string) => adminWrite(`/admin/sectors/${id}`, 'DELETE', { notFound });
