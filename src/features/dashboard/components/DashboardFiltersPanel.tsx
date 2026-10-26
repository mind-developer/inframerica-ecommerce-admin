'use client';

import { FilterBox } from '@/components/ui/FilterBox';
import { Select } from '@/components/ui/Select';
import type { Sector } from '@/types/sectors';
import type { useDashboardFilters } from '../hooks/useDashboardFilters';
import type { CustomerType, Period, RankingSort } from '../utils/dashboardMetrics';

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
  { value: 'ano', label: 'Este ano' },
  { value: 'tudo', label: 'Todo o período' },
];
const TYPE_OPTIONS: { value: CustomerType; label: string }[] = [
  { value: 'todos', label: 'PF e PJ' },
  { value: 'pj', label: 'Pessoa jurídica' },
  { value: 'pf', label: 'Pessoa física' },
];
const SORT_OPTIONS: { value: RankingSort; label: string }[] = [
  { value: 'receita', label: 'Maior receita' },
  { value: 'pedidos', label: 'Mais pedidos' },
  { value: 'nome', label: 'Nome (A–Z)' },
];
const TOP_OPTIONS = [5, 10, 20].map((n) => ({ value: String(n), label: `Top ${n}` }));

export function DashboardFiltersPanel({
  controls,
  sectors,
}: {
  controls: ReturnType<typeof useDashboardFilters>;
  sectors: Sector[];
}) {
  const { filters: f, update } = controls;
  const field = (id: string, label: string, control: React.ReactNode) => (
    <div className="flex flex-col gap-1 text-xs font-medium">
      <label htmlFor={id}>{label}</label>
      {control}
    </div>
  );
  return (
    <FilterBox active={controls.changed} onClear={controls.clear}>
      {field(
        'dash-period',
        'Período',
        <Select
          id="dash-period"
          value={f.period}
          onChange={(e) => update({ period: e.target.value as Period })}
          options={PERIOD_OPTIONS}
        />,
      )}
      {field(
        'dash-sector',
        'Setor',
        <Select
          id="dash-sector"
          value={f.sectorId ?? ''}
          onChange={(e) => update({ sectorId: e.target.value || null })}
          options={[{ value: '', label: 'Todos os setores' }, ...sectors.map((s) => ({ value: s.id, label: s.name }))]}
        />,
      )}
      {field(
        'dash-type',
        'Tipo de cliente',
        <Select
          id="dash-type"
          value={f.customerType}
          onChange={(e) => update({ customerType: e.target.value as CustomerType })}
          options={TYPE_OPTIONS}
        />,
      )}
      {field(
        'dash-top',
        'Ranking',
        <Select
          id="dash-top"
          value={String(f.topN)}
          onChange={(e) => update({ topN: Number(e.target.value) })}
          options={TOP_OPTIONS}
        />,
      )}
      {field(
        'dash-sort',
        'Ordenar ranking por',
        <Select
          id="dash-sort"
          value={f.sort}
          onChange={(e) => update({ sort: e.target.value as RankingSort })}
          options={SORT_OPTIONS}
        />,
      )}
    </FilterBox>
  );
}
