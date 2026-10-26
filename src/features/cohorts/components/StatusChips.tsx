'use client';

import { cn } from '@/utils/cn';
import type { Enrollment, EnrollmentStatus } from '@/types/enrollments';
import { ENROLLMENT_STATUS_ORDER } from '@/constants/labels';
import { EnrollmentStatusBadge } from './EnrollmentStatusBadge';

/** Status counters that double as a toggle filter. */
export function StatusChips({
  enrollments,
  value,
  onChange,
}: {
  enrollments: Enrollment[];
  value: EnrollmentStatus | null;
  onChange: (s: EnrollmentStatus | null) => void;
}) {
  return (
    <div className="mt-4 mb-5 flex flex-wrap gap-2">
      {ENROLLMENT_STATUS_ORDER.map((s) => (
        <button
          key={s}
          type="button"
          aria-pressed={value === s}
          onClick={() => onChange(value === s ? null : s)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5',
            value === s ? 'border-primary bg-muted/60' : 'border-border hover:bg-muted/30',
          )}
        >
          <EnrollmentStatusBadge status={s} />
          <span className="text-xs font-semibold">{enrollments.filter((m) => m.status === s).length}</span>
        </button>
      ))}
    </div>
  );
}
