'use client';

import { parseAsBoolean, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import type { OrderStatus, PaymentMethod, ServiceType } from '@/types/orders';
import { ORDER_SORTS, type OrderFilters } from '../utils/orderFilters';

const STATUSES: OrderStatus[] = ['paid', 'pending', 'failed', 'refunded'];
const METHODS: PaymentMethod[] = ['pix', 'card', 'bank_slip', 'transfer'];
const SERVICES: ServiceType[] = ['training', 'credentialing', 'vip_lounge'];

export const orderSearchParams = {
  q: parseAsString.withDefault(''),
  status: parseAsStringLiteral(STATUSES),
  metodo: parseAsStringLiteral(METHODS),
  servico: parseAsStringLiteral(SERVICES),
  cliente: parseAsString,
  ordem: parseAsStringLiteral(ORDER_SORTS).withDefault('recente'),
  nf: parseAsStringLiteral(['com', 'sem'] as const),
  faturado: parseAsStringLiteral(['sim', 'nao'] as const),
  semMensalistas: parseAsBoolean.withDefault(false),
  /** Open order detail. */
  pedido: parseAsString,
  aba: parseAsStringLiteral(['lista', 'config'] as const).withDefault('lista'),
};

/** Orders filters live in the URL: "Ver todos os pedidos deste cliente" links straight to `?cliente=`. */
export function useOrderFilters() {
  const [p, set] = useQueryStates(orderSearchParams, { history: 'replace' });
  const filters: OrderFilters = {
    q: p.q,
    status: p.status,
    method: p.metodo,
    service: p.servico,
    customerId: p.cliente,
    sort: p.ordem,
    invoice: p.nf,
    billed: p.faturado,
    excludeAccountHolders: p.semMensalistas,
  };
  const active = Boolean(
    p.q || p.status || p.metodo || p.servico || p.cliente || p.nf || p.faturado || p.semMensalistas,
  );
  const clear = () =>
    set({
      q: null,
      status: null,
      metodo: null,
      servico: null,
      cliente: null,
      nf: null,
      faturado: null,
      semMensalistas: null,
    });
  return { params: p, set, filters, active, clear };
}
