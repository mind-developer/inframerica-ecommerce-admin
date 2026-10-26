'use client';

import type { MaintenanceMode } from '@/types/settings';

const OPTIONS: { value: MaintenanceMode; title: string; help: string }[] = [
  {
    value: 'hide_menu',
    title: 'Ocultar menu de treinamentos e avisar clientes quando a loja reabrir',
    help: 'Oculta a navegação de treinamentos e mostra a tela de manutenção completa.',
  },
  {
    value: 'block_checkout_only',
    title: 'Apenas desabilitar o botão de checkout',
    help: 'Mantém a navegação e o catálogo visíveis, mas desabilita a compra.',
  },
];

export function MaintenanceModeOptions({
  mode,
  notifyOnReopen,
  disabled,
  onMode,
  onNotify,
}: {
  mode: MaintenanceMode;
  notifyOnReopen: boolean;
  disabled: boolean;
  onMode: (m: MaintenanceMode) => void;
  onNotify: (v: boolean) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm font-medium">Comportamento da loja fechada</legend>
      {OPTIONS.map((o) => (
        <div key={o.value} className="rounded-xl border border-border p-3">
          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="radio"
              name="mode"
              checked={mode === o.value}
              disabled={disabled}
              onChange={() => onMode(o.value)}
              className="mt-1 size-4 accent-primary"
            />
            <span>
              <span className="block text-sm font-medium">{o.title}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{o.help}</span>
            </span>
          </label>
          {o.value === 'hide_menu' && mode === 'hide_menu' && (
            <label className="mt-3 ml-7 flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={notifyOnReopen}
                disabled={disabled}
                onChange={(e) => onNotify(e.target.checked)}
                className="size-4 accent-primary"
              />
              Avisar clientes quando a loja reabrir
            </label>
          )}
        </div>
      ))}
    </fieldset>
  );
}
