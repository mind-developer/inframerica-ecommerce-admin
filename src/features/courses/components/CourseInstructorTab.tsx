'use client';

import { withForm } from '@/components/ui/form';
import { emptyCourse } from '../schemas/courseSchema';

/** Instructor data. The public course page doesn't show it today (prototype pending item 8). */
export const CourseInstructorTab = withForm({
  defaultValues: emptyCourse,
  render: function Render({ form }) {
    return (
      <div className="space-y-4">
        <form.AppField name="instructor">
          {(f) => <f.TextField label="Nome" placeholder="Cap. Roberto Alves" />}
        </form.AppField>
        <form.AppField name="instructorRole">
          {(f) => (
            <f.TextField label="Cargo / especialidade" placeholder="Especialista em Segurança da Aviação Civil" />
          )}
        </form.AppField>
        <form.AppField name="instructorBio">{(f) => <f.TextAreaField label="Biografia" rows={5} />}</form.AppField>
        <div className="grid grid-cols-2 gap-3">
          <form.AppField name="instructorCourses">
            {(f) => <f.NumberField label="Cursos ministrados" min={0} />}
          </form.AppField>
          <form.AppField name="instructorStudents">
            {(f) => <f.NumberField label="Alunos formados" min={0} />}
          </form.AppField>
        </div>
      </div>
    );
  },
});
