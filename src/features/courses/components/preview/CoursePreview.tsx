import { ArrowLeft, Eye, Pencil } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { buttonStyles } from '@/components/ui/buttonStyles';
import type { Course } from '@/types/catalog';
import { CourseAbout } from './CourseAbout';
import { CourseCurriculum } from './CourseCurriculum';
import { CourseHero } from './CourseHero';
import { PreviewPurchaseBox } from './PreviewPurchaseBox';

/**
 * Preview of the public course page. It mirrors the storefront's layout (hero, "Sobre o Curso",
 * "Conteúdo Programático", purchase card) so it shows what customers actually see (prototype pending 8).
 */
export function CoursePreview({ course }: { course: Course }) {
  const lessons = course.curriculum.reduce((n, m) => n + m.lessons.length, 0);
  return (
    <div className="-m-4 lg:-m-6">
      <div className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/cursos" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
            <ArrowLeft aria-hidden className="size-4" /> Voltar
          </Link>
          <div className="min-w-0">
            <p className="flex items-center gap-2 truncate text-sm font-semibold">
              <Eye aria-hidden className="size-4 shrink-0 text-accent" /> Pré-visualização
            </p>
            <p className="truncate text-[11px] text-muted-foreground">/treinamentos/{course.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!course.active && <Badge tone="warning">Não publicado</Badge>}
          <Link href={`/cursos?editar=${course.id}` as Route} className={buttonStyles({ size: 'sm' })}>
            <Pencil aria-hidden className="size-4" /> Editar
          </Link>
        </div>
      </div>
      <div className="bg-background">
        <CourseHero course={course} />
        <section className="container max-w-6xl py-12">
          <div className="flex flex-col gap-8 lg:flex-row-reverse">
            <div className="lg:w-[360px] lg:shrink-0">
              <PreviewPurchaseBox course={course} />
            </div>
            <div className="min-w-0 flex-1 space-y-12">
              <CourseAbout course={course} />
              <div>
                <h3 className="mb-5 font-heading text-lg font-bold text-foreground">Conteúdo Programático do Curso</h3>
                <p className="mb-5 text-xs text-muted-foreground">
                  {course.curriculum.length} módulos · {lessons} aulas · {course.duration} total
                </p>
                <CourseCurriculum curriculum={course.curriculum} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
