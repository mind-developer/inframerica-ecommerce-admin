'use client';

import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import {
  CUSTOMER_TYPES,
  DEFAULT_DASHBOARD_FILTERS as D,
  PERIODS,
  RANKING_SORTS,
  type DashboardFilters,
} from '../utils/dashboardMetrics';

const params = {
  periodo: parseAsStringLiteral(PERIODS).withDefault(D.period),
  setor: parseAsString,
  tipo: parseAsStringLiteral(CUSTOMER_TYPES).withDefault(D.customerType),
  top: parseAsInteger.withDefault(D.topN),
  ordem: parseAsStringLiteral(RANKING_SORTS).withDefault(D.sort),
};

/** Dashboard filters in the URL, so a filtered view can be shared or bookmarked. */
export function useDashboardFilters() {
  const [p, set] = useQueryStates(params, { history: 'replace' });
  const filters: DashboardFilters = {
    period: p.periodo,
    sectorId: p.setor,
    customerType: p.tipo,
    topN: p.top,
    sort: p.ordem,
  };
  const changed =
    p.periodo !== D.period || p.setor !== null || p.tipo !== D.customerType || p.top !== D.topN || p.ordem !== D.sort;
  const update = (patch: Partial<DashboardFilters>) =>
    void set({
      periodo: patch.period,
      setor: patch.sectorId,
      tipo: patch.customerType,
      top: patch.topN,
      ordem: patch.sort,
    });
  const clear = () => void set({ periodo: null, setor: null, tipo: null, top: null, ordem: null });
  return { filters, changed, update, clear };
}
