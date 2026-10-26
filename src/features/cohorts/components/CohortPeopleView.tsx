'use client';

import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { EmptyState } from '@/components/ui/EmptyState';
import { ENROLLMENT_STATUS_LABEL, ENROLLMENT_STATUS_ORDER } from '@/constants/labels';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Cohort } from '@/types/cohorts';
import type { Concessionaire } from '@/types/concessionaires';
import type { Enrollment } from '@/types/enrollments';
import { onlyDigits } from '@/utils/format';
import { changeEnrollmentStatus, unlinkEnrollment } from '../actions/cohortActions';
import { EnrollmentRow } from './EnrollmentRow';
import { CohortPeopleHeader } from './CohortPeopleHeader';
import { PeopleFilters } from './PeopleFilters';
import { StatusChips } from './StatusChips';

const params = {
  nome: parseAsString.withDefault(''),
  cpf: parseAsString.withDefault(''),
  cessionaria: parseAsString,
  status: parseAsStringLiteral(ENROLLMENT_STATUS_ORDER),
};

export function CohortPeopleView({
  cohort,
  courseTitle,
  enrollments,
  concessionaires,
}: {
  cohort: Cohort;
  courseTitle: string;
  enrollments: Enrollment[];
  concessionaires: Concessionaire[];
}) {
  const [filters, setFilters] = useQueryStates(params, { history: 'replace' });
  const { pending, run } = useServerAction();
  const name = filters.nome.trim().toLowerCase();
  const cpf = onlyDigits(filters.cpf);
  const shown = enrollments.filter(
    (m) =>
      (!name || m.personName.toLowerCase().includes(name)) &&
      (!cpf || onlyDigits(m.personCpf).includes(cpf)) &&
      (!filters.cessionaria || m.concessionaireId === filters.cessionaria) &&
      (!filters.status || m.status === filters.status),
  );
  return (
    <div>
      <CohortPeopleHeader cohort={cohort} courseTitle={courseTitle} enrolled={enrollments.length} />
      <StatusChips
        enrollments={enrollments}
        value={filters.status}
        onChange={(status) => void setFilters({ status })}
      />
      <PeopleFilters
        values={filters}
        concessionaires={concessionaires}
        onChange={(patch) => void setFilters(patch)}
        onClear={() => void setFilters({ nome: null, cpf: null, cessionaria: null, status: null })}
      />
      <p className="mt-4 mb-3 text-xs text-muted-foreground">
        {shown.length} de {enrollments.length} pessoa(s)
      </p>
      {shown.length === 0 ? (
        <EmptyState
          title={
            enrollments.length > 0
              ? 'Nenhuma pessoa corresponde aos filtros.'
              : 'Nenhuma pessoa vinculada a esta turma ainda.'
          }
        />
      ) : (
        <ul className="space-y-2">
          {shown.map((m) => (
            <EnrollmentRow
              key={m.id}
              enrollment={m}
              disabled={pending}
              onStatus={(s) =>
                run(() => changeEnrollmentStatus(m.id, s), `Status alterado para "${ENROLLMENT_STATUS_LABEL[s]}"`)
              }
              onUnlink={() => run(() => unlinkEnrollment(m.id), `${m.personName} desvinculada da turma`)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
