'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { adminLinkBlockReason } from '@/domain/enrollmentRules';
import { EnrollmentStatusBadge } from '@/features/cohorts';
import type { Enrollment } from '@/types/enrollments';
import { formatDateTime, formatDocument } from '@/utils/format';

export const linkBlockReason = (m: Enrollment) =>
  adminLinkBlockReason({
    inProgress: m.status === 'in_progress',
    completed: m.status === 'completed',
    linkedAtIso: m.updatedAt,
  });

/** One student on the order's credits, with link/unlink (blocked by the same rules as the customer area). */
export function OrderStudentRow({
  student: m,
  onLink,
  onUnlink,
}: {
  student: Enrollment;
  onLink: () => void;
  onUnlink: () => void;
}) {
  const blocked = linkBlockReason(m);
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{m.personName}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          CPF {formatDocument(m.personCpf)} · {m.courseTitle}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {m.cohortId ? `Vinculado em ${formatDateTime(m.updatedAt)}` : 'Sem turma atribuída'}
        </p>
      </div>
      <EnrollmentStatusBadge status={m.status} />
      {blocked ? (
        <Tooltip id={`block-${m.id}`} content={blocked}>
          <Button
            size="sm"
            variant="outline"
            aria-disabled
            aria-describedby={`block-${m.id}`}
            onClick={(e) => e.preventDefault()}
          >
            <AlertTriangle aria-hidden className="size-3.5" /> Bloqueado
          </Button>
        </Tooltip>
      ) : m.cohortId ? (
        <Button size="sm" variant="outline" onClick={onUnlink}>
          Desvincular
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={onLink}>
          Vincular turma
        </Button>
      )}
    </li>
  );
}
