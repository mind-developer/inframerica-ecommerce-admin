import { ArrowRight, Calendar, ShoppingCart, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MODALITY_LABEL } from '@/constants/labels';
import { purchaseLimitHint, purchaseRange } from '@/domain/purchaseLimits';
import type { Course } from '@/types/catalog';
import { formatBRL } from '@/utils/format';
import { discountPercent } from '../../utils/discountPercent';
import { PurchaseIncludes } from './PurchaseIncludes';

/** The purchase card as a signed-in customer sees it, without buying actions. */
export function PreviewPurchaseBox({ course }: { course: Course }) {
  const { min, max } = purchaseRange(course);
  const soldOut = course.spotsLeft <= 0;
  const tooFew = !soldOut && max < min;
  const discount = discountPercent(course);
  const total = course.price * min;
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
        <span className="font-semibold text-destructive">{soldOut ? 'Esgotado' : course.spotsLeft}</span>
      </p>
      <div className="border-t border-border pt-3">
        {course.originalPrice !== null && discount !== null && (
          <p className="mb-1 flex items-center gap-2">
            <span className="text-sm text-muted-foreground line-through">{formatBRL(course.originalPrice * min)}</span>
            <span className="text-xs font-bold text-gold">-{discount}% off</span>
          </p>
        )}
        <p className="font-heading text-3xl font-bold">{formatBRL(total)}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {min > 1 && <>{formatBRL(course.price)}/vaga · </>}ou 6x {formatBRL(total / 6)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Visitantes veem &quot;Faça login para ver o valor&quot;.</p>
      </div>
      <p className="flex items-center justify-between text-xs font-semibold">
        Quantidade de vagas <span className="text-sm">{min}</span>
      </p>
      {purchaseLimitHint(course) && (
        <p className="text-right text-xs text-muted-foreground">{purchaseLimitHint(course)}</p>
      )}
      <Button className="w-full" disabled>
        {soldOut ? 'Esgotado' : tooFew ? 'Vagas insuficientes' : 'Comprar Agora'}{' '}
        <ArrowRight aria-hidden className="size-3.5" />
      </Button>
      <Button variant="outline" className="w-full" disabled>
        <ShoppingCart aria-hidden className="size-3.5" /> Adicionar ao Carrinho
      </Button>
      <PurchaseIncludes course={course} />
    </aside>
  );
}
