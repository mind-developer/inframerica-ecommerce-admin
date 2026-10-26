'use client';

import { FilterBox } from '@/components/ui/FilterBox';
import { Input } from '@/components/ui/Input';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { ENROLLMENT_STATUS_LABEL, ENROLLMENT_STATUS_ORDER } from '@/constants/labels';
import type { Concessionaire } from '@/types/concessionaires';
import type { EnrollmentStatus } from '@/types/enrollments';

export interface PeopleFilterValues {
  nome: string;
  cpf: string;
  cessionaria: string | null;
  status: EnrollmentStatus | null;
}

export function PeopleFilters({
  values,
  concessionaires,
  onChange,
  onClear,
}: {
  values: PeopleFilterValues;
  concessionaires: Concessionaire[];
  onChange: (patch: Partial<PeopleFilterValues>) => void;
  onClear: () => void;
}) {
  const active = Boolean(values.nome || values.cpf || values.cessionaria || values.status);
  return (
    <FilterBox active={active} onClear={onClear}>
      <SearchInput
        value={values.nome}
        onChange={(nome) => onChange({ nome })}
        placeholder="Buscar por nome"
        label="Nome"
      />
      <Input
        aria-label="CPF"
        inputMode="numeric"
        value={values.cpf}
        onChange={(e) => onChange({ cpf: e.target.value })}
        placeholder="000.000.000-00"
        className="font-mono"
      />
      <Select
        aria-label="Cessionária"
        value={values.cessionaria ?? ''}
        onChange={(e) => onChange({ cessionaria: e.target.value || null })}
        options={[
          { value: '', label: 'Todas as cessionárias' },
          ...concessionaires.map((c) => ({ value: c.id, label: c.name })),
        ]}
      />
      <Select
        aria-label="Status"
        value={values.status ?? ''}
        onChange={(e) => onChange({ status: (e.target.value || null) as EnrollmentStatus | null })}
        options={[
          { value: '', label: 'Todos os status' },
          ...ENROLLMENT_STATUS_ORDER.map((s) => ({ value: s, label: ENROLLMENT_STATUS_LABEL[s] })),
        ]}
      />
    </FilterBox>
  );
}
