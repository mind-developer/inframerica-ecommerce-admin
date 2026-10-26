import Image from 'next/image';
import { MODALITY_LABEL } from '@/constants/labels';
import type { Course } from '@/types/catalog';
import { formatBRL } from '@/utils/format';
import { DetailSection } from './DetailSection';

export function OrderCoursesSection({ courses }: { courses: Course[] }) {
  return (
    <DetailSection title="Cursos">
      {courses.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum curso identificado para este pedido.</p>
      ) : (
        <ul className="space-y-2">
          {courses.map((c) => (
            <li key={c.id} className="flex items-center gap-3 rounded-xl border border-border p-2.5">
              {c.imageUrl ? (
                <Image
                  src={c.imageUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-lg bg-muted object-cover"
                />
              ) : (
                <span aria-hidden className="size-10 shrink-0 rounded-lg bg-muted" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{c.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {MODALITY_LABEL[c.modality]} · {c.duration} · {formatBRL(c.price)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DetailSection>
  );
}
