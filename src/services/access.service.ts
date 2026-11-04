/** Access profiles and internal users, from inframerica-ecommerce-api. */
import 'server-only';
import type { AccessProfile, AccessProfileInput, AdminUser, AdminUserInput } from '@/types/adminUsers';
import { adminRead, adminWrite } from './api/adminApi';

const conflicts = {
  'name-taken': 'Já existe um perfil com este nome',
  'in-use': 'Este perfil ainda tem usuários. Mude o perfil deles antes de remover.',
  'email-taken': 'Já existe um usuário com este email',
  'password-required': 'Informe uma senha para o novo usuário',
  'profile-not-found': 'Perfil não encontrado',
  escalation: 'Você só pode conceder ou alterar acessos que você mesmo tem.',
  'own-profile': 'Você não pode alterar o seu próprio perfil.',
  'own-account': 'Você não pode remover a sua própria conta.',
  owner: 'Só o dono da conta pode alterar este usuário.',
};
const profile = { conflicts, notFound: 'Perfil não encontrado' };
const user = { conflicts, notFound: 'Usuário não encontrado' };

export const listProfiles = () => adminRead<AccessProfile[]>('/admin/profiles');
export const listProfileOptions = () => adminRead<AccessProfile[]>('/admin/profiles/options');
export const createProfile = (body: AccessProfileInput) => adminWrite('/admin/profiles', 'POST', { ...profile, body });
export const updateProfile = (id: string, body: AccessProfileInput) =>
  adminWrite(`/admin/profiles/${id}`, 'PATCH', { ...profile, body });
export const removeProfile = (id: string) => adminWrite(`/admin/profiles/${id}`, 'DELETE', profile);

export const listAdminUsers = () => adminRead<AdminUser[]>('/admin/users');
export const createAdminUser = (body: AdminUserInput) => adminWrite('/admin/users', 'POST', { ...user, body });
export const updateAdminUser = (id: string, body: AdminUserInput) =>
  adminWrite(`/admin/users/${id}`, 'PATCH', { ...user, body });
export const removeAdminUser = (id: string) => adminWrite(`/admin/users/${id}`, 'DELETE', user);
