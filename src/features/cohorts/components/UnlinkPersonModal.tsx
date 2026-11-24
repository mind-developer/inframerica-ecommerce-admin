'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Enrollment } from '@/types/enrollments';
import { unlinkEnrollment } from '../actions/cohortActions';

/** Confirms the unlink with its mandatory justification (also enforced by the action). */
export function UnlinkPersonModal({ person, onClose }: { person: Enrollment; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const { pending, run } = useServerAction();
  const confirm = () =>
    run(() => unlinkEnrollment(person.id, reason), `${person.personName} desvinculada da turma`, onClose);
  return (
    <Modal
      open
      onClose={onClose}
      title="Desvincular da turma"
      description={
        <>
          <strong>{person.personName}</strong> sai desta turma e o crédito volta a ficar disponível.
        </>
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={confirm} disabled={pending || !reason.trim()}>
            Desvincular
          </Button>
        </>
      }
    >
      <Field id="unlink-reason" label="Justificativa" required>
        <Textarea
          id="unlink-reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explique o motivo do desvínculo…"
        />
      </Field>
    </Modal>
  );
}
