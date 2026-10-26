'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { useServerAction } from '@/components/ui/useServerAction';
import type { SiteContent } from '@/types/content';
import { saveHero } from '../actions/contentActions';
import { heroSchema } from '../schemas/contentSchemas';
import { SaveRow } from './SaveRow';

export function HeroForm({ hero }: { hero: SiteContent['hero'] }) {
  const { pending, run } = useServerAction();
  const form = useAppForm({
    defaultValues: { ...hero, heroImageUrl: hero.heroImageUrl ?? '', heroVideoUrl: hero.heroVideoUrl ?? '' },
    validators: { onSubmit: heroSchema },
    onSubmit: ({ value }) => run(() => saveHero(value), 'Cabeçalho salvo'),
  });
  return (
    <Card>
      <CardContent className="pt-6">
        <form noValidate onSubmit={submitHandler(form)} className="space-y-4">
          <form.AppField name="eyebrow">
            {(f) => <f.TextField label="Eyebrow (texto pequeno acima do título)" />}
          </form.AppField>
          <div className="grid gap-3 sm:grid-cols-2">
            <form.AppField name="title">{(f) => <f.TextField label="Título" />}</form.AppField>
            <form.AppField name="titleHighlight">{(f) => <f.TextField label="Título em destaque" />}</form.AppField>
          </div>
          <form.AppField name="subtitle">{(f) => <f.TextAreaField label="Subtítulo" rows={2} />}</form.AppField>
          <form.AppField name="ctaLabel">{(f) => <f.TextField label="Texto do botão (CTA)" />}</form.AppField>
          <div className="grid gap-3 sm:grid-cols-2">
            <form.AppField name="heroImageUrl">
              {(f) => <f.TextField label="Imagem de destaque (opcional)" placeholder="https://… ou /images/…" />}
            </form.AppField>
            <form.AppField name="heroVideoUrl">
              {(f) => <f.TextField label="Vídeo de destaque (opcional)" placeholder="https://…" />}
            </form.AppField>
          </div>
          <SaveRow label="Salvar cabeçalho" pending={pending} />
        </form>
      </CardContent>
    </Card>
  );
}
