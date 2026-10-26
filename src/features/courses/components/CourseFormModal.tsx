'use client';

import { Eye } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { Modal } from '@/components/ui/Modal';
import { tabPanelProps, Tabs } from '@/components/ui/Tabs';
import { toast } from '@/components/ui/toast';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Course, Credential } from '@/types/catalog';
import type { Sector } from '@/types/sectors';
import { saveCourse } from '../actions/courseActions';
import { courseSchema, emptyCourse, toCourseValues } from '../schemas/courseSchema';
import { CourseBasicTab } from './CourseBasicTab';
import { CourseContentTab } from './CourseContentTab';
import { CourseInstructorTab } from './CourseInstructorTab';
import { CourseOfferTab } from './CourseOfferTab';

type Tab = 'basico' | 'oferta' | 'conteudo' | 'instrutor';
const TABS: { id: Tab; label: string }[] = [
  { id: 'basico', label: 'Básico' },
  { id: 'oferta', label: 'Oferta' },
  { id: 'conteudo', label: 'Conteúdo' },
  { id: 'instrutor', label: 'Instrutor' },
];

export function CourseFormModal({
  course,
  sectors,
  credentials,
  onClose,
}: {
  course: Course | null;
  sectors: Sector[];
  credentials: Credential[];
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>('basico');
  const { pending, run } = useServerAction();
  const form = useAppForm({
    defaultValues: course ? toCourseValues(course) : { ...emptyCourse, sectorId: sectors[0]?.id ?? '' },
    validators: { onSubmit: courseSchema },
    onSubmit: ({ value }) =>
      run(() => saveCourse(course?.id ?? null, value), course ? 'Curso atualizado' : 'Curso criado', onClose),
    // An invalid field may sit on another tab: say so instead of failing silently.
    onSubmitInvalid: () => toast('Revise os campos obrigatórios', 'Título e setor ficam na aba Básico.', 'error'),
  });
  return (
    <Modal
      open
      size="xl"
      onClose={onClose}
      title={course ? 'Editar Curso' : 'Novo Curso'}
      description="Todos os campos abaixo aparecem na página pública do curso. Use o Preview para ver o resultado antes de publicar."
      footer={
        <>
          {course && (
            <Link href={`/cursos/${course.id}/preview` as Route} className={buttonStyles({ variant: 'outline' })}>
              <Eye aria-hidden className="size-4" /> Preview
            </Link>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={pending} onClick={() => void form.handleSubmit()}>
            {pending ? 'Salvando…' : 'Salvar'}
          </Button>
        </>
      }
    >
      <Tabs<Tab> idPrefix="curso" className="mb-4" value={tab} onChange={setTab} tabs={TABS} />
      <form noValidate onSubmit={submitHandler(form)} {...tabPanelProps('curso', tab)}>
        {tab === 'basico' && <CourseBasicTab form={form} sectors={sectors} credentials={credentials} />}
        {tab === 'oferta' && <CourseOfferTab form={form} />}
        {tab === 'conteudo' && <CourseContentTab form={form} />}
        {tab === 'instrutor' && <CourseInstructorTab form={form} />}
      </form>
    </Modal>
  );
}
