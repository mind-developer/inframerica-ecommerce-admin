'use client';

import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { findSubstituteCohort } from '@/domain/cohorts';
import { toast } from '@/components/ui/toast';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Cohort } from '@/types/cohorts';
import { formatDate } from '@/utils/format';
import { cancelCohort } from '../actions/cohortActions';

/** Explains what canceling does: move people to a substitute cohort, or return their credits. */
export function CancelCohortModal({
  cohort,
  cohorts,
  onClose,
}: {
  cohort: Cohort | null;
  cohorts: Cohort[];
  onClose: () => void;
}) {
  const { pending, run } = useServerAction();
  const substitute = cohort ? findSubstituteCohort(cohort, cohorts) : null;
  const message = substitute ? (
    <span className="space-y-3">
      <span className="block">
        Encontramos uma turma substituta do mesmo curso com vaga disponível. Ao confirmar, todos os participantes desta
        turma serão movidos para ela, preservando o crédito já utilizado, e a turma atual será marcada como cancelada.
      </span>
      <span className="block rounded-lg border border-border p-3 text-foreground">
        <strong className="block">Turma substituta sugerida</strong>
        {formatDate(substitute.startDate)}
        {substitute.endDate ? ` — ${formatDate(substitute.endDate)}` : ''} · {substitute.schedule} ·{' '}
        {substitute.location || '—'} · {substitute.totalSeats - substitute.takenSeats} vaga(s) disponível(is)
      </span>
    </span>
  ) : (
    'Não há outra turma aberta com vaga livre para este curso. Ao confirmar, um e-mail de cancelamento será enviado a cada participante, as matrículas voltarão a ter crédito disponível (sem turma vinculada) e o cliente será avisado da devolução do crédito. A turma ficará marcada como cancelada, mas não será excluída.'
  );
  const confirm = () =>
    cohort &&
    run(
      () => cancelCohort(cohort.id),
      undefined,
      (r) => {
        onClose();
        toast(
          r.movedTo
            ? 'Participantes reinscritos automaticamente na turma substituta'
            : 'Crédito devolvido — as vagas ficaram disponíveis sem turma vinculada',
          `${r.people} participante(s) avisado(s) por e-mail (simulado).`,
          'success',
        );
      },
    );
  return (
    <ConfirmModal
      open={Boolean(cohort)}
      title={substitute ? 'Cancelar turma e reinscrever participantes?' : 'Cancelar turma?'}
      message={message}
      confirmLabel={substitute ? 'Confirmar reinscrição automática' : 'Confirmar cancelamento'}
      destructive={!substitute}
      pending={pending}
      onConfirm={() => void confirm()}
      onClose={onClose}
    />
  );
}
