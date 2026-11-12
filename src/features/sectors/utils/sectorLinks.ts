/** What points to a sector (courses and credentials live in the mock for now). */
export interface SectorLinks {
  courses: number;
  credentials: number;
}

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Shown before deactivating a sector that still has links (#52); null when there is none. */
export function deactivationWarning({ courses, credentials }: SectorLinks): string | null {
  const parts = [
    courses > 0 && count(courses, 'curso', 'cursos'),
    credentials > 0 && count(credentials, 'credencial', 'credenciais'),
  ].filter(Boolean);
  if (parts.length === 0) return null;
  const linked = courses + credentials === 1 ? 'vinculado' : 'vinculados';
  return `Este setor tem ${parts.join(' e ')} ${linked}. Eles continuam no sistema, mas o setor deixa de aparecer como ativo.`;
}
