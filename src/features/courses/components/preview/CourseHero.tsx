import { Award, BookOpen, ChevronRight, Clock, Users } from 'lucide-react';
import type { Course } from '@/types/catalog';

/** Same hero as the storefront's course page; breadcrumbs are inert inside the admin. */
export function CourseHero({ course }: { course: Course }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-12 md:pt-36 md:pb-20">
      <div className="absolute inset-0 gradient-navy" />
      <div className="relative container max-w-6xl">
        <nav aria-label="Trilha" className="mb-8 flex items-center gap-2 text-xs text-primary-foreground/50">
          <span>Home</span>
          <ChevronRight aria-hidden className="size-3" />
          <span>Cursos e Treinamentos</span>
          <ChevronRight aria-hidden className="size-3" />
          <span aria-current="page" className="text-primary-foreground/70">
            {course.title}
          </span>
        </nav>
        <div className="max-w-2xl">
          <span className="mb-4 inline-flex rounded-full bg-gold/20 px-3 py-1 text-[10px] font-bold tracking-wider text-gold uppercase">
            {course.category}
          </span>
          <h1 className="mb-4 font-heading text-3xl leading-tight font-bold text-primary-foreground md:text-4xl">
            {course.title}
          </h1>
          <p className="mb-6 text-primary-foreground/70">{course.description}</p>
          <ul className="mb-4 flex flex-wrap items-center gap-4 text-xs text-primary-foreground/60">
            <li className="inline-flex items-center gap-1">
              <Clock aria-hidden className="size-3.5 text-gold" /> {course.duration}
            </li>
            <li className="inline-flex items-center gap-1">
              <Users aria-hidden className="size-3.5 text-gold" /> {course.students.toLocaleString('pt-BR')}+ alunos
            </li>
            <li className="inline-flex items-center gap-1">
              <BookOpen aria-hidden className="size-3.5 text-gold" /> {course.modules} módulos
            </li>
            <li className="inline-flex items-center gap-1">
              <Award aria-hidden className="size-3.5 text-gold" /> Certificado incluso
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
