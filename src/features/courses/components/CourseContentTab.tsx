'use client';

import { withForm } from '@/components/ui/form';
import { emptyCourse } from '../schemas/courseSchema';
import { CurriculumEditor } from './CurriculumEditor';
import { StringListEditor } from './StringListEditor';

const LISTS = [
  { name: 'learningPoints', label: 'O que você vai aprender', placeholder: 'Ex: Identificar ameaças em área restrita' },
  { name: 'targetAudience', label: 'Para quem é este curso', placeholder: 'Ex: Agentes de segurança aeroportuária' },
  { name: 'prerequisites', label: 'Pré-requisitos', placeholder: 'Ex: Ensino médio completo' },
] as const;

export const CourseContentTab = withForm({
  defaultValues: emptyCourse,
  render: function Render({ form }) {
    return (
      <div className="space-y-6">
        {LISTS.map(({ name, label, placeholder }) => (
          <form.Field key={name} name={name}>
            {(f) => (
              <StringListEditor
                label={label}
                items={f.state.value}
                onChange={f.handleChange}
                placeholder={placeholder}
              />
            )}
          </form.Field>
        ))}
        <form.Field name="curriculum">
          {(f) => <CurriculumEditor curriculum={f.state.value} onChange={f.handleChange} />}
        </form.Field>
      </div>
    );
  },
});
