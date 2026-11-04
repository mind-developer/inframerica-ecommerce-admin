import type { Id } from './common';

/** A person with access to the admin panel (not a customer). */
export interface AdminUser {
  id: Id;
  name: string;
  email: string;
  sectorId: string | null;
  active: boolean;
  /** Holds every permission; only the owner edits an owner. */
  owner: boolean;
  profile: { id: Id; name: string } | null;
  createdAt: string;
}

export interface AdminUserInput {
  name: string;
  email: string;
  profileId: string;
  sectorId: string | null;
  active: boolean;
  /** PROVISIONAL, until Microsoft SSO. Empty keeps the current one. */
  password: string;
}

/** A named set of "resource.action" permissions. */
export interface AccessProfile {
  id: Id;
  name: string;
  permissions: string[];
  /** How many users have it. */
  members: number;
}

export type AccessProfileInput = Pick<AccessProfile, 'name' | 'permissions'>;
