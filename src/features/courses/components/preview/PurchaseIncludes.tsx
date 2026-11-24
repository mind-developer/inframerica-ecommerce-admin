import { Check } from 'lucide-react';
import type { Course } from '@/types/catalog';

/** "Este curso inclui": what every purchase comes with. */
export function PurchaseIncludes({ course }: { course: Pick<Course, 'duration' | 'certificate'> }) {
  const includes = [
    ...(course.duration ? [`${course.duration} de conteúdo`] : []),
    'Material didático PDF',
    ...(course.certificate ? ['Certificado reconhecido'] : []),
    'Acesso vitalício',
    'Suporte do instrutor',
  ];
  return (
    <div className="border-t border-border pt-4">
      <p className="mb-3 text-xs font-semibold text-foreground">Este curso inclui:</p>
      <ul className="space-y-2">
        {includes.map((item) => (
          <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check aria-hidden className="size-3 shrink-0 text-gold" /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
