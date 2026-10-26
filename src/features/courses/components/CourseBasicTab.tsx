'use client';

import { withForm } from '@/components/ui/form';
import type { Credential } from '@/types/catalog';
import type { Sector } from '@/types/sectors';
import { slugify } from '@/utils/slugify';
import { emptyCourse } from '../schemas/courseSchema';

export const CourseBasicTab = withForm({
  defaultValues: emptyCourse,
  props: {} as { sectors: Sector[]; credentials: Credential[] },
  render: function Render({ form, sectors, credentials }) {
    return (
      <div className="space-y-4">
        <form.AppField name="title">
          {(f) => <f.TextField label="Título" placeholder="Ex: Conscientização com AVSEC" required />}
        </form.AppField>
        <form.Subscribe selector={(s) => slugify(s.values.slug || s.values.title)}>
          {(slug) => (
            <form.AppField name="slug">
              {(f) => (
                <f.TextField
                  label="Slug (URL)"
                  placeholder="gerado a partir do título"
                  inputClassName="font-mono text-xs"
                  help={`/treinamentos/${slug || '…'}`}
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>
        <form.AppField name="description">
          {(f) => (
            <f.TextAreaField label="Descrição curta" rows={2} placeholder="Aparece no card e no topo da página" />
          )}
        </form.AppField>
        <form.AppField name="longDescription">
          {(f) => <f.TextAreaField label="Descrição completa" rows={5} placeholder="Texto da aba 'Sobre o Curso'" />}
        </form.AppField>
        <div className="grid grid-cols-2 gap-3">
          <form.AppField name="category">
            {(f) => <f.TextField label="Categoria" placeholder="Segurança da Aviação" />}
          </form.AppField>
          <form.AppField name="sectorId">
            {(f) => (
              <f.SelectField
                label="Setor"
                placeholder="Selecione"
                options={sectors.map((s) => ({ value: s.id, label: s.name }))}
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="credentialIds">
          {(f) => (
            <f.CheckboxListField
              variant="pills"
              label="Credenciais habilitadas por este curso"
              options={credentials.map((c) => ({ value: c.id, label: c.acronym, title: c.name }))}
              help={() => 'Usado no filtro por credencial do site público.'}
            />
          )}
        </form.AppField>
        <form.AppField name="active">
          {(f) => (
            <f.SwitchField
              label="Curso publicado"
              help="Cursos despublicados somem do catálogo, mas seguem no preview."
            />
          )}
        </form.AppField>
      </div>
    );
  },
});
