'use client';

import { Mail, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { useReadOnly } from '@/components/ui/ReadOnly';
import { Select } from '@/components/ui/Select';
import { ENROLLMENT_STATUS_LABEL, ENROLLMENT_STATUS_ORDER } from '@/constants/labels';
import { linkBlockReason } from '@/domain/enrollmentLink';
import type { Enrollment, EnrollmentStatus } from '@/types/enrollments';
import { formatDocument } from '@/utils/format';
import { EnrollmentStatusBadge } from './EnrollmentStatusBadge';

export function EnrollmentRow({
  enrollment: m,
  disabled,
  onStatus,
  onUnlink,
}: {
  enrollment: Enrollment;
  disabled: boolean;
  onStatus: (s: EnrollmentStatus) => void;
  onUnlink: () => void;
}) {
  const readOnly = useReadOnly();
  const blocked = linkBlockReason(m);
  return (
    <Card className="flex flex-wrap items-center gap-3 rounded-xl p-4">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{m.personName}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          CPF {formatDocument(m.personCpf)} · {m.concessionaireName}
        </p>
        <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
          <Mail aria-hidden className="size-3 shrink-0" /> {m.personEmail}
        </p>
        {blocked && !readOnly && (
          <p id={`block-${m.id}`} className="mt-1 text-[11px] text-muted-foreground">
            {blocked}
          </p>
        )}
      </div>
      <EnrollmentStatusBadge status={m.status} />
      {!readOnly && (
        <Select
          aria-label={`Status de ${m.personName}`}
          className="w-[160px]"
          value={m.status}
          disabled={disabled}
          onChange={(e) => onStatus(e.target.value as EnrollmentStatus)}
          options={ENROLLMENT_STATUS_ORDER.map((s) => ({ value: s, label: ENROLLMENT_STATUS_LABEL[s] }))}
        />
      )}
      <IconButton
        label={`Desvincular ${m.personName} da turma`}
        disabled={disabled || Boolean(blocked)}
        aria-describedby={blocked ? `block-${m.id}` : undefined}
        onClick={onUnlink}
      >
        <Trash2 aria-hidden className="size-4 text-destructive" />
      </IconButton>
    </Card>
  );
}
