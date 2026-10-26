import { Ban, Calendar, Clock, MapPin, Pencil, Trash2, Users } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { Badge, type Tone } from '@/components/ui/Badge';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { COHORT_STATUS_LABEL } from '@/constants/labels';
import type { Cohort, CohortStatus } from '@/types/cohorts';
import { formatDate } from '@/utils/format';

const TONE: Record<CohortStatus, Tone> = {
  open: 'success',
  closed: 'warning',
  completed: 'neutral',
  canceled: 'danger',
};

export function CohortCard({
  cohort: t,
  courseTitle,
  onEdit,
  onCancel,
  onDelete,
}: {
  cohort: Cohort;
  courseTitle: string;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="flex flex-wrap items-center justify-between gap-4 rounded-xl px-6 py-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-semibold text-foreground">{courseTitle}</h2>
          <Badge tone={TONE[t.status]}>{COHORT_STATUS_LABEL[t.status]}</Badge>
        </div>
        <ul className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <li className="inline-flex items-center gap-1.5">
            <Calendar aria-hidden className="size-3.5" /> {formatDate(t.startDate)}
            {t.endDate ? ` — ${formatDate(t.endDate)}` : ''}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-3.5" /> {t.schedule}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden className="size-3.5" /> {t.location || '—'}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Users aria-hidden className="size-3.5" /> {t.takenSeats}/{t.totalSeats} vagas
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-2">
        <Link href={`/turmas/${t.id}/pessoas` as Route} className={buttonStyles({ variant: 'outline', size: 'sm' })}>
          <Users aria-hidden className="size-4" /> Pessoas
        </Link>
        <IconButton label="Editar turma" onClick={onEdit}>
          <Pencil aria-hidden className="size-4" />
        </IconButton>
        {t.status !== 'canceled' && (
          <IconButton label="Cancelar turma" onClick={onCancel}>
            <Ban aria-hidden className="size-4 text-destructive" />
          </IconButton>
        )}
        <IconButton label="Remover turma" onClick={onDelete}>
          <Trash2 aria-hidden className="size-4 text-destructive" />
        </IconButton>
      </div>
    </Card>
  );
}
