'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Course } from '@/types/catalog';
import type { Cohort } from '@/types/cohorts';
import { deleteCohort } from '../actions/cohortActions';
import { CancelCohortModal } from './CancelCohortModal';
import { CohortCard } from './CohortCard';
import { CohortFormModal } from './CohortFormModal';

export function CohortsView({ cohorts, courses }: { cohorts: Cohort[]; courses: Course[] }) {
  const [editing, setEditing] = useState<Cohort | 'new' | null>(null);
  const [canceling, setCanceling] = useState<Cohort | null>(null);
  const [removing, setRemoving] = useState<Cohort | null>(null);
  const { pending, run } = useServerAction();
  const courseTitle = (id: string) => courses.find((c) => c.id === id)?.title ?? 'Curso removido';
  return (
    <>
      <PageHeader
        title="Turmas"
        subtitle={`${cohorts.length} turmas cadastradas`}
        actions={
          <Button variant="accent" disabled={courses.length === 0} onClick={() => setEditing('new')}>
            <Plus aria-hidden className="size-4" /> Nova Turma
          </Button>
        }
      />
      {courses.length === 0 ? (
        <EmptyState title="Cadastre ao menos um curso antes de criar turmas." />
      ) : cohorts.length === 0 ? (
        <EmptyState title="Nenhuma turma cadastrada." />
      ) : (
        <ul className="grid gap-4">
          {cohorts.map((t) => (
            <CohortCard
              key={t.id}
              cohort={t}
              courseTitle={courseTitle(t.courseId)}
              onEdit={() => setEditing(t)}
              onCancel={() => setCanceling(t)}
              onDelete={() => setRemoving(t)}
            />
          ))}
        </ul>
      )}
      {editing && (
        <CohortFormModal
          cohort={editing === 'new' ? null : editing}
          courses={courses}
          onClose={() => setEditing(null)}
        />
      )}
      <CancelCohortModal cohort={canceling} cohorts={cohorts} onClose={() => setCanceling(null)} />
      <ConfirmModal
        open={Boolean(removing)}
        title="Remover esta turma?"
        message="Use 'Cancelar turma' para manter o histórico e cuidar dos participantes."
        confirmLabel="Remover"
        destructive
        pending={pending}
        onClose={() => setRemoving(null)}
        onConfirm={() =>
          removing &&
          run(
            () => deleteCohort(removing.id),
            'Turma removida',
            () => setRemoving(null),
          )
        }
      />
    </>
  );
}
