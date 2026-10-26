'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { Switch } from '@/components/ui/Switch';
import { useServerAction } from '@/components/ui/useServerAction';
import type { StoreSettings } from '@/types/settings';
import { saveStoreSettings } from '../actions/settingsActions';
import { storeSettingsSchema } from '../schemas/storeSettingsSchema';
import { MaintenanceModeOptions } from './MaintenanceModeOptions';

export function StoreSettingsCard({ settings }: { settings: StoreSettings }) {
  const { pending, run } = useServerAction();
  const save = (patch: Partial<StoreSettings>, message: string) => run(() => saveStoreSettings(patch), message);
  const form = useAppForm({
    defaultValues: { message: settings.message, contactChannel: settings.contactChannel },
    validators: { onSubmit: storeSettingsSchema.pick({ message: true, contactChannel: true }) },
    onSubmit: ({ value }) => save(value, 'Mensagem e canal de contato salvos'),
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle aria-hidden className="size-5 text-warning" /> Fechar loja de treinamentos
        </CardTitle>
        <CardDescription>
          Use para falhas de conexão com SAP ou cálculo incorreto de descontos/impostos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
          <div>
            <p className="text-sm font-medium">Fechar loja de treinamentos</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {settings.storeClosed
                ? 'A área de treinamentos está fechada para novas compras. Sala VIP e salas de reunião continuam disponíveis.'
                : 'A área de treinamentos está operando normalmente.'}
            </p>
          </div>
          <Switch
            aria-label="Fechar loja de treinamentos"
            checked={settings.storeClosed}
            disabled={pending}
            onCheckedChange={(v) =>
              save({ storeClosed: v }, v ? 'Loja de treinamentos fechada' : 'Loja de treinamentos reaberta')
            }
          />
        </div>
        <form noValidate onSubmit={submitHandler(form)} className="space-y-4">
          <form.AppField name="message">
            {(f) => <f.TextAreaField label="Mensagem exibida na tela de manutenção" rows={3} />}
          </form.AppField>
          <form.AppField name="contactChannel">
            {(f) => <f.TextField label="Canal de contato" placeholder="atendimento@inframerica.com" />}
          </form.AppField>
          <Button type="submit" variant="outline" disabled={pending}>
            Salvar mensagem e contato
          </Button>
        </form>
        <MaintenanceModeOptions
          mode={settings.mode}
          notifyOnReopen={settings.notifyOnReopen}
          disabled={pending}
          onMode={(mode) => save({ mode }, 'Comportamento atualizado')}
          onNotify={(notifyOnReopen) => save({ notifyOnReopen }, 'Preferência salva')}
        />
      </CardContent>
    </Card>
  );
}
