import { ArrowRight, Check } from 'lucide-react';
import type { Course } from '@/types/catalog';

const heading = 'mb-4 font-heading text-lg font-bold text-foreground';

/** A section with nothing in it doesn't show (#70). Same file in the admin's preview: change both. */
export function CourseAbout({ course }: { course: Course }) {
  return (
    <div className="space-y-10">
      {course.learningPoints.length > 0 && (
        <div>
          <h3 className={heading}>O que você vai aprender</h3>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {course.learningPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-gold" />
                <span className="text-sm text-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {course.targetAudience.length > 0 && (
        <div>
          <h3 className={heading}>Para quem é este curso</h3>
          <ul className="space-y-2">
            {course.targetAudience.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                <ArrowRight aria-hidden className="size-3 shrink-0 text-gold" /> {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {course.prerequisites.length > 0 && (
        <div>
          <h3 className={heading}>Pré-requisitos</h3>
          <ul className="space-y-2">
            {course.prerequisites.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                <Check aria-hidden className="size-3 shrink-0" /> {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {course.longDescription && (
        <div>
          <h3 className={heading}>Descrição Completa</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{course.longDescription}</p>
        </div>
      )}
    </div>
  );
}
