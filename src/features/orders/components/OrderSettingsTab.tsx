'use client';

import { Clock, Copy, KeyRound, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/toast';
import { regenerateBiToken, saveAutoCancelDays } from '@/features/settings';
import { useServerAction } from '@/components/ui/useServerAction';
import type { OrderSettings } from '@/types/orderSettings';

/** "Configurações" tab of the orders screen: auto-cancel window and the (mock) BI token. */
export function OrderSettingsTab({ settings }: { settings: OrderSettings }) {
  const [days, setDays] = useState(settings.autoCancelDays);
  const { pending, run } = useServerAction();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(settings.biToken);
      toast('Token copiado para a área de transferência', undefined, 'success');
    } catch {
      toast('Não foi possível copiar o token', undefined, 'error');
    }
  };
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold">
            <Clock aria-hidden className="size-4 text-accent" /> Cancelamento automático de pedidos pendentes
          </h2>
          <form
            className="flex flex-wrap items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              run(() => saveAutoCancelDays(days), 'Prazo de cancelamento salvo');
            }}
          >
            <label htmlFor="auto-cancel" className="text-sm">
              Cancelar automaticamente pedidos pendentes após
            </label>
            <Input
              id="auto-cancel"
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
              className="w-20"
            />
            <span className="text-sm">dias</span>
            <Button type="submit" size="sm" disabled={pending || days === settings.autoCancelDays}>
              Salvar
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">
            Pedidos <strong>Pendentes</strong> há mais de {days} dia(s) serão marcados como <strong>Cancelados</strong>.
            Só a configuração existe por enquanto — a rotina automática não roda.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold">
            <KeyRound aria-hidden className="size-4 text-accent" /> Integração com BI
          </h2>
          <p className="text-xs text-muted-foreground">
            Token de API para alimentar o BI/data lake com os dados de vendas. Mock — não existe endpoint real por trás
            dele.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="rounded-lg bg-muted px-3 py-2 font-mono text-xs break-all">{settings.biToken}</code>
            <Button variant="outline" size="sm" onClick={() => void copy()}>
              <Copy aria-hidden className="size-3.5" /> Copiar
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => run(regenerateBiToken, 'Novo token de integração gerado')}
            >
              <RefreshCw aria-hidden className="size-3.5" /> Regenerar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
