'use client';

import { withForm } from '@/components/ui/form';
import type { BannerValues } from '../schemas/contentSchemas';

const defaultValues = {} as BannerValues;

/** Desktop/tablet/mobile image URLs; tablet and mobile fall back to desktop. */
export const BannerImageFields = withForm({
  defaultValues,
  render: function Render({ form }) {
    return (
      <fieldset className="space-y-2 rounded-xl border border-border p-3">
        <legend className="px-1 text-xs text-muted-foreground uppercase">Imagens por dispositivo</legend>
        <form.AppField name="imageUrl">
          {(f) => (
            <f.TextField
              label="Desktop (também usada como padrão) — 1600×500px"
              placeholder="https://… ou /placeholder.svg"
            />
          )}
        </form.AppField>
        <form.AppField name="imageUrlTablet">
          {(f) => <f.TextField label="Tablet — 1024×400px" placeholder="Opcional — cai para a imagem de desktop" />}
        </form.AppField>
        <form.AppField name="imageUrlMobile">
          {(f) => <f.TextField label="Celular — 750×560px" placeholder="Opcional — cai para a imagem de desktop" />}
        </form.AppField>
        <p className="pt-1 text-[11px] text-muted-foreground">
          Fora dessa proporção, a imagem pode ser cortada pelo carrossel.
        </p>
      </fieldset>
    );
  },
});

/** Optional display window; without one the banner runs until deactivated. */
export const BannerScheduleFields = withForm({
  defaultValues,
  render: function Render({ form }) {
    return (
      <fieldset className="space-y-3 rounded-xl border border-border p-3">
        <form.AppField name="scheduled">{(f) => <f.SwitchField label="Exibição por período definido" />}</form.AppField>
        <form.Subscribe selector={(s) => s.values.scheduled}>
          {(scheduled) =>
            scheduled ? (
              <div className="grid grid-cols-2 gap-3">
                <form.AppField name="startDate">{(f) => <f.TextField label="Data início" type="date" />}</form.AppField>
                <form.AppField name="endDate">{(f) => <f.TextField label="Data fim" type="date" />}</form.AppField>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Exibição indefinida — o banner permanece ativo até ser desativado manualmente.
              </p>
            )
          }
        </form.Subscribe>
      </fieldset>
    );
  },
});
