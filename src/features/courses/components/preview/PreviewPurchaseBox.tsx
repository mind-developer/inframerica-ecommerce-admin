import { Calendar, Users } from 'lucide-react';
import { MODALITY_LABEL } from '@/constants/labels';
import type { Course } from '@/types/catalog';
import { formatBRL } from '@/utils/format';

/** The purchase card as a signed-in customer sees it, without buying actions. */
export function PreviewPurchaseBox({ course }: { course: Course }) {
  return (
    <aside className="space-y-3 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl lg:sticky lg:top-20">
      {/* eslint-disable-next-line @next/next/no-img-element -- CMS image URL of any host */}
      <img src={course.imageUrl} alt="" className="-mx-6 -mt-6 mb-3 h-44 w-[calc(100%+3rem)] max-w-none object-cover" />
      <p className="text-sm font-medium">{MODALITY_LABEL[course.modality]}</p>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar aria-hidden className="size-3.5 text-gold" /> Próxima turma:{' '}
        <span className="font-medium text-foreground">{course.nextDate || '—'}</span>
      </p>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users aria-hidden className="size-3.5 text-gold" /> Vagas restantes:{' '}
        <span className="font-semibold text-destructive">{course.spotsLeft}</span>
      </p>
      <div className="border-t border-border pt-3">
        {course.originalPrice && (
          <p className="text-sm text-muted-foreground line-through">{formatBRL(course.originalPrice)}</p>
        )}
        <p className="font-heading text-3xl font-bold">{formatBRL(course.price)}</p>
        <p className="mt-1 text-xs text-muted-foreground">Visitantes veem &quot;Faça login para ver o valor&quot;.</p>
      </div>
    </aside>
  );
}
