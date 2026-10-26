'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { FilterBox } from '@/components/ui/FilterBox';
import { PendingRuleBadge } from '@/components/ui/PendingRuleBadge';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select, type SelectOption } from '@/components/ui/Select';
import { ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL, SERVICE_TYPE_LABEL } from '@/constants/labels';
import type { Customer } from '@/types/customers';
import type { useOrderFilters } from '../hooks/useOrderFilters';

type Controls = ReturnType<typeof useOrderFilters>;
type Params = Controls['params'];
type SelectKey = 'status' | 'metodo' | 'servico' | 'cliente' | 'nf' | 'faturado';

const withAll = (options: SelectOption[], allLabel = 'Todos') => [{ value: '', label: allLabel }, ...options];
const fromLabels = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const SORT: SelectOption[] = [
  { value: 'recente', label: 'Mais recentes' },
  { value: 'antigo', label: 'Mais antigos' },
  { value: 'maior', label: 'Maior valor' },
  { value: 'menor', label: 'Menor valor' },
];

const INVOICE_LABEL = (
  <>
    Nota fiscal{' '}
    <PendingRuleBadge text="Campo de nota fiscal ainda é mockado (derivado do id do pedido) — no backend real viria da integração com o GDF/SAP." />
  </>
);

const selects = (customers: Customer[]): { key: SelectKey; label: ReactNode; options: SelectOption[] }[] => [
  { key: 'status', label: 'Status', options: withAll(fromLabels(ORDER_STATUS_LABEL)) },
  { key: 'metodo', label: 'Método', options: withAll(fromLabels(PAYMENT_METHOD_LABEL)) },
  { key: 'servico', label: 'Tipo de serviço', options: withAll(fromLabels(SERVICE_TYPE_LABEL)) },
  {
    key: 'cliente',
    label: 'Empresa/cliente',
    options: withAll(customers.map((c) => ({ value: c.id, label: c.name }))),
  },
  {
    key: 'nf',
    label: INVOICE_LABEL,
    options: withAll(
      [
        { value: 'com', label: 'Com nota fiscal' },
        { value: 'sem', label: 'Sem nota fiscal (investigar)' },
      ],
      'Todas',
    ),
  },
  {
    key: 'faturado',
    label: 'Faturamento',
    options: withAll([
      { value: 'sim', label: 'Faturado' },
      { value: 'nao', label: 'Não faturado' },
    ]),
  },
];

function FilterField({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium">
      <span className="flex items-center gap-1.5">{label}</span>
      {children}
    </label>
  );
}

export function OrderFiltersPanel({ controls, customers }: { controls: Controls; customers: Customer[] }) {
  const { params: p, set } = controls;
  return (
    <FilterBox active={controls.active} onClear={() => void controls.clear()}>
      <FilterField label="Busca">
        <SearchInput
          value={p.q}
          onChange={(q) => void set({ q: q || null })}
          placeholder="Pedido, cliente, CNPJ, pessoa vinculada…"
        />
      </FilterField>
      {selects(customers).map(({ key, label, options }) => (
        <FilterField key={key} label={label}>
          <Select
            value={p[key] ?? ''}
            onChange={(e) => void set({ [key]: e.target.value || null } as Partial<Params>)}
            options={options}
          />
        </FilterField>
      ))}
      <FilterField label="Ordenação">
        <Select
          value={p.ordem}
          onChange={(e) => void set({ ordem: e.target.value as Params['ordem'] })}
          options={SORT}
        />
      </FilterField>
      <div className="flex items-end">
        <Button
          variant={p.semMensalistas ? 'primary' : 'outline'}
          aria-pressed={p.semMensalistas}
          className="w-full"
          title="Útil em consultas por período: correntistas/mensalistas são faturados em lote no fim do mês, fora do ciclo normal de NF."
          onClick={() => void set({ semMensalistas: p.semMensalistas ? null : true })}
        >
          Excluir mensalistas da consulta
        </Button>
      </div>
    </FilterBox>
  );
}
