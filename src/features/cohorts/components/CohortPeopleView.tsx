'use client';

import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { ENROLLMENT_STATUS_LABEL, ENROLLMENT_STATUS_ORDER } from '@/constants/labels';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Cohort } from '@/types/cohorts';
import type { Concessionaire } from '@/types/concessionaires';
import type { Enrollment } from '@/types/enrollments';
import { changeEnrollmentStatus } from '../actions/cohortActions';
import { EnrollmentRow } from './EnrollmentRow';
import { CohortPeopleHeader } from './CohortPeopleHeader';
import { PeopleFilters } from './PeopleFilters';
import { StatusChips } from './StatusChips';
import { UnlinkPersonModal } from './UnlinkPersonModal';
import { filterPeople } from '../utils/peopleFilters';

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
  const [unlinking, setUnlinking] = useState<Enrollment | null>(null);
  const shown = filterPeople(enrollments, filters);
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
              onUnlink={() => setUnlinking(m)}
            />
          ))}
        </ul>
      )}
      {unlinking && <UnlinkPersonModal key={unlinking.id} person={unlinking} onClose={() => setUnlinking(null)} />}
    </div>
  );
}
