'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Cohort } from '@/types/cohorts';
import type { Enrollment } from '@/types/enrollments';
import { formatDate } from '@/utils/format';
import { setStudentCohort } from '../actions/orderActions';

export interface LinkTarget {
  student: Enrollment;
  /** null = unlink. */
  cohortId: string | null;
}

interface Props {
  target: LinkTarget;
  cohorts: Cohort[];
  customerEmail: string | null;
  onClose: () => void;
}

/** Link or unlink a credit; the justification is mandatory (also enforced by the action). */
export function LinkCreditModal({ target, cohorts, customerEmail, onClose }: Props) {
  const [cohortId, setCohortId] = useState(target.cohortId);
  const [reason, setReason] = useState('');
  const { pending, run } = useServerAction();
  const linking = target.cohortId !== null;
  const confirm = () =>
    run(
      () => setStudentCohort(target.student.id, cohortId, reason),
      `${target.student.personName} ${linking ? 'vinculado(a)' : 'desvinculado(a)'} com sucesso. E-mail automático enviado a ${customerEmail ?? 'cliente'}.`,
      onClose,
    );
  return (
    <Modal
      open
      onClose={onClose}
      title={`${linking ? 'Vincular' : 'Desvincular'} crédito`}
      description={
        <>
          Pessoa: <strong>{target.student.personName}</strong> — curso {target.student.courseTitle}.
        </>
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={confirm} disabled={pending || (linking && !cohortId)}>
            Confirmar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {linking && (
          <Field id="link-cohort" label="Turma">
            {cohorts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma turma aberta para este curso.</p>
            ) : (
              <Select
                id="link-cohort"
                value={cohortId ?? ''}
                onChange={(e) => setCohortId(e.target.value)}
                options={cohorts.map((t) => ({ value: t.id, label: `${formatDate(t.startDate)} · ${t.location}` }))}
              />
            )}
          </Field>
        )}
        <Field id="link-reason" label="Justificativa" required>
          <Textarea
            id="link-reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explique o motivo da alteração de vínculo…"
          />
        </Field>
      </div>
    </Modal>
  );
}
