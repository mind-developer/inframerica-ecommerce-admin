'use client';

import { Plus } from 'lucide-react';
import { parseAsString, useQueryStates } from 'nuqs';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmActionModal } from '@/components/ui/ConfirmActionModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import type { Course, Credential } from '@/types/catalog';
import type { Sector } from '@/types/sectors';
import { deleteCourse } from '../actions/courseActions';
import { CourseFormModal } from './CourseFormModal';
import { CourseRow } from './CourseRow';

/** `?editar=<id>` opens the editor (the preview's "Editar" button links here). */
const params = { q: parseAsString.withDefault(''), editar: parseAsString };

export function CoursesView({
  courses,
  sectors,
  credentials,
}: {
  courses: Course[];
  sectors: Sector[];
  credentials: Credential[];
}) {
  const [{ q, editar }, setParams] = useQueryStates(params, { history: 'replace' });
  const [creating, setCreating] = useState(false);
  const [removing, setRemoving] = useState<Course | null>(null);
  const term = q.trim().toLowerCase();
  const shown = term
    ? courses.filter((c) => [c.title, c.category, c.instructor].some((t) => t.toLowerCase().includes(term)))
    : courses;
  const editing = courses.find((c) => c.id === editar) ?? null;
  const sectorName = (id: string) => sectors.find((s) => s.id === id)?.name ?? '—';
  return (
    <>
      <PageHeader
        title="Cursos"
        subtitle={`${courses.length} cursos · ${courses.filter((c) => c.active).length} publicados`}
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus aria-hidden className="size-4" /> Novo Curso
          </Button>
        }
      />
      <SearchInput
        className="mb-5 max-w-md"
        value={q}
        onChange={(v) => void setParams({ q: v || null })}
        placeholder="Buscar por título, categoria ou instrutor"
      />
      {shown.length === 0 ? (
        <EmptyState title={term ? 'Nenhum curso corresponde à busca.' : 'Nenhum curso cadastrado.'} />
      ) : (
        <ul className="space-y-3">
          {shown.map((c) => (
            <CourseRow
              key={c.id}
              course={c}
              sectorName={sectorName(c.sectorId)}
              onEdit={() => void setParams({ editar: c.id })}
              onDelete={() => setRemoving(c)}
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
