import { FileText, PlayCircle } from 'lucide-react';
import { AccordionItem } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';
import type { CourseModule } from '@/types/catalog';

const isAssessment = (title: string) => /avaliação|projeto/i.test(title);

export function CourseCurriculum({ curriculum }: { curriculum: CourseModule[] }) {
  return (
    <div className="space-y-3">
      {curriculum.map((mod, i) => (
        <AccordionItem
          key={mod.title}
          defaultOpen={i === 0}
          className="overflow-hidden rounded-xl border border-border bg-card [&>div]:pb-0"
          summaryClassName="px-5 py-4 hover:bg-muted/30"
          title={
            <span>
              <span className="block font-heading text-sm font-bold text-foreground">{mod.title}</span>
              <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
                {mod.lessons.length} aulas
              </span>
            </span>
          }
        >
          <ul className="border-t border-border">
            {mod.lessons.map((lesson) => {
              const Icon = isAssessment(lesson.title) ? FileText : PlayCircle;
              return (
                <li key={lesson.title} className="flex items-center justify-between px-5 py-3 hover:bg-muted/20">
                  <span className="flex items-center gap-3">
                    <Icon aria-hidden className="size-3.5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{lesson.title}</span>
                    {lesson.free && (
                      <Badge tone="success" className="text-[9px] uppercase">
                        Grátis
                      </Badge>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                </li>
              );
            })}
          </ul>
        </AccordionItem>
      ))}
    </div>
  );
}
