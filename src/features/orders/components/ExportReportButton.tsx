'use client';

import { Download } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/toast';
import { buildSalesReportCsv, syntheticReportRows } from '@/domain/salesReport';
import type { Order } from '@/types/orders';
import { downloadCsv } from '@/utils/download';
import type { OrderLookups } from '../utils/orderLookups';

/** Sales report (CSV) of the orders currently shown, plus the synthetic rows the BI mock expects. */
export function ExportReportButton({ orders, lookups }: { orders: Order[]; lookups: OrderLookups }) {
  const syntheticRows = useMemo(() => syntheticReportRows(), []);
  const exportCsv = () => {
    const csv = buildSalesReportCsv({
      orders,
      customerOf: lookups.customerOf,
      coursesOfOrder: lookups.coursesOf,
      studentsOfOrder: lookups.studentsOf,
      origin: window.location.origin,
      syntheticRows,
    });
    downloadCsv(`relatorio-pedidos-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    toast('Relatório exportado com sucesso.', undefined, 'success');
  };
  return (
    <Button variant="outline" onClick={exportCsv}>
      <Download aria-hidden className="size-4" /> Exportar relatório
    </Button>
  );
}
