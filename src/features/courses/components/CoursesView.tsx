'use client';

import { Plus } from 'lucide-react';
import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmActionModal } from '@/components/ui/ConfirmActionModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import type { Course, Credential } from '@/types/catalog';
import type { Sector } from '@/types/sectors';
import { deleteCourse } from '../actions/courseActions';
import { useCoursePublish } from '../hooks/useCoursePublish';
import { COURSE_STATUSES, filterCourses } from '../utils/courseFilters';
import { CourseFilters } from './CourseFilters';
import { CourseFormModal } from './CourseFormModal';
import { CourseRow } from './CourseRow';

/** `?editar=<id>` opens the editor (the preview's "Editar" button links here). */
const params = {
  q: parseAsString.withDefault(''),
  status: parseAsStringLiteral(COURSE_STATUSES),
  editar: parseAsString,
};

export function CoursesView({
  courses,
  sectors,
  credentials,
}: {
  courses: Course[];
  sectors: Sector[];
  credentials: Credential[];
}) {
  const [{ q, status, editar }, setParams] = useQueryStates(params, { history: 'replace' });
  const { publish, publishing } = useCoursePublish();
  const [creating, setCreating] = useState(false);
  const [removing, setRemoving] = useState<Course | null>(null);
  const shown = filterCourses(courses, q, status);
  const filtering = Boolean(q.trim() || status);
  const editing = courses.find((c) => c.id === editar) ?? null;
  const sectorName = (id: string) => sectors.find((s) => s.id === id)?.name ?? '—';
  return (
    <>
      <PageHeader
        soon
        title="Cursos"
        subtitle={`${courses.length} cursos · ${courses.filter((c) => c.active).length} publicados`}
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus aria-hidden className="size-4" /> Novo Curso
          </Button>
        }
      />
      <CourseFilters
        q={q}
        status={status}
        onSearch={(v) => void setParams({ q: v || null })}
        onStatus={(v) => void setParams({ status: status === v ? null : v })}
      />
      {shown.length === 0 ? (
        <EmptyState title={filtering ? 'Nenhum curso encontrado.' : 'Nenhum curso cadastrado.'} />
      ) : (
        <ul className="space-y-3">
          {shown.map((c) => (
            <CourseRow
              key={c.id}
              course={c}
              sectorName={sectorName(c.sectorId)}
              onEdit={() => void setParams({ editar: c.id })}
              onDelete={() => setRemoving(c)}
              onPublish={(active) => publish(c, active)}
              publishing={publishing}
            />
          ))}
        </ul>
      )}
      {(creating || editing) && (
        <CourseFormModal
          key={editing?.id ?? 'new'}
          course={editing}
          sectors={sectors}
          credentials={credentials}
          onClose={() => {
            setCreating(false);
            void setParams({ editar: null });
          }}
        />
      )}
      <ConfirmActionModal
        target={removing}
        title={(r) => `Remover ${r.title}?`}
        message="O curso sai do catálogo público."
        confirmLabel="Remover"
        success="Curso removido"
        action={(r) => deleteCourse(r.id)}
        onClose={() => setRemoving(null)}
      />
    </>
  );
}
