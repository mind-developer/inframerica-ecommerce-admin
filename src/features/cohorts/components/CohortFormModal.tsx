'use client';

import { useAppForm } from '@/components/ui/form';
import { FormModal } from '@/components/ui/form/FormModal';
import { COHORT_STATUS_LABEL } from '@/constants/labels';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Course } from '@/types/catalog';
import type { Cohort, CohortStatus } from '@/types/cohorts';
import { saveCohort } from '../actions/cohortActions';
import { cohortSchema, emptyCohort, type CohortFormValues } from '../schemas/cohortSchema';

const toValues = ({ id: _id, ...c }: Cohort): CohortFormValues => ({
  ...emptyCohort,
  ...c,
  meetingPoint: c.meetingPoint ?? '',
  materials: c.materials ?? '',
  emailTemplate: c.emailTemplate ?? '',
});

export function CohortFormModal({
  cohort,
  courses,
  onClose,
}: {
  cohort: Cohort | null;
  courses: Course[];
  onClose: () => void;
}) {
  const { pending, run } = useServerAction();
  const form = useAppForm({
    defaultValues: cohort ? toValues(cohort) : { ...emptyCohort, courseId: courses[0]?.id ?? '' },
    validators: { onSubmit: cohortSchema },
    onSubmit: ({ value }) =>
      run(() => saveCohort(cohort?.id ?? null, value), cohort ? 'Turma atualizada' : 'Turma criada', onClose),
  });
  return (
    <FormModal form={form} pending={pending} onClose={onClose} title={cohort ? 'Editar Turma' : 'Nova Turma'}>
      <form.AppField name="courseId">
        {(f) => (
          <f.SelectField
            label="Curso"
            placeholder="Selecione um curso"
            options={courses.map((c) => ({ value: c.id, label: c.title }))}
          />
        )}
      </form.AppField>
      <div className="grid grid-cols-2 gap-4">
        <form.AppField name="startDate">
          {(f) => <f.TextField label="Data Início" type="date" required />}
        </form.AppField>
        <form.AppField name="endDate">{(f) => <f.TextField label="Data Fim" type="date" />}</form.AppField>
      </div>
      <form.AppField name="schedule">
        {(f) => <f.TextField label="Horário" placeholder="Ex: 08:00–18:00" />}
      </form.AppField>
      <form.AppField name="location">
        {(f) => <f.TextField label="Local" placeholder="Ex: BSB — Sala A" />}
      </form.AppField>
      <div className="grid grid-cols-2 gap-4">
        <form.AppField name="totalSeats">{(f) => <f.NumberField label="Total de Vagas" min={0} />}</form.AppField>
        <form.AppField name="takenSeats">{(f) => <f.NumberField label="Vagas Ocupadas" min={0} />}</form.AppField>
      </div>
      <form.AppField name="status">
        {(f) => (
          <f.SelectField
            label="Status"
            options={(Object.keys(COHORT_STATUS_LABEL) as CohortStatus[]).map((s) => ({
              value: s,
              label: COHORT_STATUS_LABEL[s],
            }))}
          />
        )}
      </form.AppField>
      <form.AppField name="meetingPoint">
        {(f) => <f.TextField label="Local de encontro" placeholder="Ex: Portaria principal, sala 204" />}
      </form.AppField>
      <form.AppField name="materials">
        {(f) => (
          <f.TextAreaField label="Materiais a levar" rows={3} placeholder="Ex: Documento com foto, caderno e caneta" />
        )}
      </form.AppField>
      <form.AppField name="emailTemplate">
        {(f) => (
          <f.TextAreaField
            label="Modelo de e-mail aos participantes"
            rows={5}
            placeholder="Olá {{nome}}, sua turma de {{curso}} inicia em {{data}}…"
          />
        )}
      </form.AppField>
    </FormModal>
  );
}
