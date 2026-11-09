import type { BrazilState } from '@/constants/brazil';

export interface CepAddress {
  address: string;
  city: string;
  state: BrazilState;
  ibgeCode: string;
}

interface ViaCepReply {
  erro?: boolean | string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: BrazilState;
  ibge?: string;
}

/** Address of a CEP from ViaCEP (public, called from the browser). null when unknown, incomplete or offline. */
export async function lookupCep(cep: string): Promise<CepAddress | null> {
  const digits = cep.replace(/\D/g, '');
  if (digits.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const r = (await res.json()) as ViaCepReply;
    if (r.erro || !r.uf || !r.ibge) return null;
    return {
      address: [r.logradouro, r.bairro].filter(Boolean).join(', '),
      city: r.localidade ?? '',
      state: r.uf,
      ibgeCode: r.ibge,
    };
  } catch {
    return null;
  }
}
