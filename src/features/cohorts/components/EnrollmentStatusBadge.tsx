import { CheckCircle2, CircleDashed, ClipboardCheck, PlayCircle } from 'lucide-react';
import { Badge, type Tone } from '@/components/ui/Badge';
import { ENROLLMENT_STATUS_LABEL } from '@/constants/labels';
import type { EnrollmentStatus } from '@/types/enrollments';

const STYLE: Record<EnrollmentStatus, { tone: Tone; Icon: typeof CircleDashed }> = {
  pending: { tone: 'warning', Icon: CircleDashed },
  enrolled: { tone: 'info', Icon: ClipboardCheck },
  in_progress: { tone: 'violet', Icon: PlayCircle },
  completed: { tone: 'success', Icon: CheckCircle2 },
};

export function EnrollmentStatusBadge({ status }: { status: EnrollmentStatus }) {
  const { tone, Icon } = STYLE[status];
  return (
    <Badge tone={tone} className="text-[11px]">
      <Icon aria-hidden className="size-3" /> {ENROLLMENT_STATUS_LABEL[status]}
    </Badge>
  );
}
