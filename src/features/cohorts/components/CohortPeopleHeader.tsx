import { ArrowLeft, Calendar, Clock, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { buttonStyles } from '@/components/ui/buttonStyles';
import type { Cohort } from '@/types/cohorts';
import { formatDate } from '@/utils/format';

export function CohortPeopleHeader({
  cohort,
  courseTitle,
  enrolled,
}: {
  cohort: Cohort;
  courseTitle: string;
  enrolled: number;
}) {
  return (
    <>
      <Link href="/turmas" className={buttonStyles({ variant: 'outline', size: 'sm', className: 'mb-4' })}>
        <ArrowLeft aria-hidden className="size-4" /> Voltar para Turmas
      </Link>
      <h1 className="font-heading text-2xl font-bold">Pessoas da Turma</h1>
      <p className="mt-1 text-sm text-muted-foreground">{courseTitle}</p>
      <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <li className="inline-flex items-center gap-1.5">
          <Calendar aria-hidden className="size-3.5" /> {formatDate(cohort.startDate)}
          {cohort.endDate ? ` — ${formatDate(cohort.endDate)}` : ''}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Clock aria-hidden className="size-3.5" /> {cohort.schedule}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <MapPin aria-hidden className="size-3.5" /> {cohort.location || '—'}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Users aria-hidden className="size-3.5" /> {enrolled}/{cohort.totalSeats} vagas
        </li>
      </ul>
    </>
  );
}
