'use client';

import { useAppForm } from '@/components/ui/form';
import { FormModal } from '@/components/ui/form/FormModal';
import { PendingRuleBadge } from '@/components/ui/PendingRuleBadge';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Banner } from '@/types/content';
import { BannerImageFields, BannerScheduleFields } from './BannerFormSections';
import { saveBanner } from '../actions/contentActions';
import { bannerSchema, type BannerValues } from '../schemas/contentSchemas';

const toValues = (b: Banner | null, nextPosition: number): BannerValues => ({
  title: b?.title ?? '',
  subtitle: b?.subtitle ?? '',
  ctaLabel: b?.ctaLabel ?? '',
  ctaHref: b?.ctaHref ?? '',
  imageUrl: b?.imageUrlDesktop || b?.imageUrl || '',
  imageUrlTablet: b?.imageUrlTablet ?? '',
  imageUrlMobile: b?.imageUrlMobile ?? '',
  position: b?.position ?? nextPosition,
  active: b?.active ?? true,
  scheduled: Boolean(b?.startDate || b?.endDate),
  startDate: b?.startDate ?? '',
  endDate: b?.endDate ?? '',
  gaIntegrationId: b?.gaIntegrationId ?? '',
});

export function BannerFormModal({
  banner,
  nextPosition,
  onClose,
}: {
  banner: Banner | null;
  nextPosition: number;
  onClose: () => void;
}) {
  const { pending, run } = useServerAction();
  const form = useAppForm({
    defaultValues: toValues(banner, nextPosition),
    validators: { onSubmit: bannerSchema },
    onSubmit: ({ value }) =>
      run(() => saveBanner(banner?.id ?? null, value), banner ? 'Banner atualizado' : 'Banner criado', onClose),
  });
  return (
    <FormModal
      form={form}
      pending={pending}
      onClose={onClose}
      title={banner ? 'Editar banner' : 'Novo banner'}
      description="Banners aparecem no carrossel do catálogo público, na ordem configurada."
    >
      <form.AppField name="title">
        {(f) => <f.TextField label="Título" placeholder="Ex: Capacitação aeroportuária certificada" required />}
      </form.AppField>
      <form.AppField name="subtitle">{(f) => <f.TextAreaField label="Subtítulo" rows={2} />}</form.AppField>
      <div className="grid grid-cols-2 gap-3">
        <form.AppField name="ctaLabel">
          {(f) => <f.TextField label="Texto do botão (CTA)" placeholder="Ver cursos" help="Vazio esconde o botão." />}
        </form.AppField>
        <form.AppField name="ctaHref">
          {(f) => <f.TextField label="Link do botão" placeholder="/treinamentos" />}
        </form.AppField>
      </div>
      <BannerImageFields form={form} />
      <div className="grid grid-cols-2 items-end gap-3">
        <form.AppField name="position">{(f) => <f.NumberField label="Ordem de exibição" min={1} />}</form.AppField>
        <form.AppField name="active">{(f) => <f.SwitchField label="Ativo" />}</form.AppField>
      </div>
      <BannerScheduleFields form={form} />
      <form.AppField name="gaIntegrationId">
        {(f) => (
          <f.TextField
            label={
              <span className="inline-flex items-center gap-1.5">
                ID de integração Google Analytics{' '}
                <PendingRuleBadge text="Esta integração ainda está em refinamento — o formato final do campo (ID de evento, UTM, etc.) pode mudar." />
              </span>
            }
            placeholder="Ex: G-XXXXXXX ou nome do evento"
            help="Cliques e acessos deste banner são medidos no Google Analytics — não há contador próprio aqui."
          />
        )}
      </form.AppField>
    </FormModal>
  );
}
