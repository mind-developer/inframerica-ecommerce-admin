'use client';

import { withForm } from '@/components/ui/form';
import { ImageUrlPreview } from '@/components/ui/ImageUrlPreview';
import { MODALITY_LABEL } from '@/constants/labels';
import type { Modality } from '@/types/catalog';
import { emptyCourse } from '../schemas/courseSchema';

export const CourseOfferTab = withForm({
  defaultValues: emptyCourse,
  render: function Render({ form }) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <form.AppField name="modality">
            {(f) => (
              <f.SelectField
                label="Modalidade"
                options={(Object.keys(MODALITY_LABEL) as Modality[]).map((m) => ({
                  value: m,
                  label: MODALITY_LABEL[m],
                }))}
              />
            )}
          </form.AppField>
          <form.AppField name="duration">
            {(f) => <f.TextField label="Carga horária" placeholder="16h" />}
          </form.AppField>
        </div>
        <form.Subscribe selector={(s) => s.values.modality}>
          {(modality) =>
            modality !== 'online' && (
              <form.AppField name="defaultLocation">
                {(f) => (
                  <f.TextField
                    label="Local padrão / endereço"
                    placeholder="Ex: BSB — Centro de Treinamento"
                    help="Sugerido ao criar novas turmas deste curso."
                  />
                )}
              </form.AppField>
            )
          }
        </form.Subscribe>
        <form.AppField name="sapCode">
          {(f) => (
            <f.TextField
              label="Código SAP do produto"
              placeholder="Ex: SAP-000123"
              inputClassName="font-mono text-xs"
              help="Referência interna para integração com o SAP (mockado)."
            />
          )}
        </form.AppField>
        <div className="grid grid-cols-2 gap-3">
          <form.AppField name="price">{(f) => <f.NumberField label="Preço (R$)" min={0} step={0.01} />}</form.AppField>
          <form.AppField name="originalPrice">
            {(f) => (
              <f.NumberField label="Preço original (R$)" min={0} step={0.01} placeholder="Sem desconto" nullable />
            )}
          </form.AppField>
          <form.AppField name="nextDate">
            {(f) => <f.TextField label="Próxima data" placeholder="12/05/2026" />}
          </form.AppField>
          <form.AppField name="spotsLeft">{(f) => <f.NumberField label="Vagas restantes" min={0} />}</form.AppField>
        </div>
        <form.AppField name="imageUrl">
          {(f) => <f.TextField label="Imagem (URL)" inputClassName="font-mono text-xs" />}
        </form.AppField>
        <form.Subscribe selector={(s) => s.values.imageUrl}>{(url) => <ImageUrlPreview url={url} />}</form.Subscribe>
        <div className="grid grid-cols-3 gap-3">
          <form.AppField name="students">{(f) => <f.NumberField label="Alunos" min={0} />}</form.AppField>
          <form.AppField name="rating">
            {(f) => <f.NumberField label="Nota (0–5)" min={0} max={5} step={0.1} />}
          </form.AppField>
          <form.AppField name="reviews">{(f) => <f.NumberField label="Avaliações" min={0} />}</form.AppField>
        </div>
        <form.AppField name="certificate">{(f) => <f.SwitchField label="Emite certificado" />}</form.AppField>
      </div>
    );
  },
});
