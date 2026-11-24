import type { Enrollment, EnrollmentStatus } from '@/types/enrollments';
import { onlyDigits } from '@/utils/format';

export interface PeopleFilterValues {
  nome: string;
  cpf: string;
  cessionaria: string | null;
  status: EnrollmentStatus | null;
}

const plain = (s: string) => s.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

/** Name (no case, no accents), CPF (with or without its mask), concessionaire and status (#65). */
export function filterPeople(people: Enrollment[], { nome, cpf, cessionaria, status }: PeopleFilterValues) {
  const name = plain(nome);
  const digits = onlyDigits(cpf);
  return people.filter(
    (m) =>
      (!name || plain(m.personName).includes(name)) &&
      (!digits || onlyDigits(m.personCpf).includes(digits)) &&
      (!cessionaria || m.concessionaireId === cessionaria) &&
      (!status || m.status === status),
  );
}
