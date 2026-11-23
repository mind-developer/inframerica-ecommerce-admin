import type { CourseModule } from '@/types/catalog';

/** Trimmed, without the items left blank (a blank bullet would show on the public page). */
export const cleanList = (items: string[]) => items.map((i) => i.trim()).filter(Boolean);

/**
 * The curriculum as the public page shows it (#57): texts trimmed, wholly blank lessons and modules
 * dropped. A module or lesson with content but no title is refused, naming which one.
 */
export function cleanCurriculum(curriculum: CourseModule[]): { curriculum: CourseModule[] } | { error: string } {
  const out: CourseModule[] = [];
  for (const [m, mod] of curriculum.entries()) {
    const lessons = mod.lessons
      .map((l) => ({ ...l, title: l.title.trim(), duration: l.duration.trim() }))
      .filter((l) => l.title || l.duration);
    const title = mod.title.trim();
    if (!title && lessons.length === 0) continue;
    if (!title) return { error: `Informe o título do módulo ${m + 1}` };
    const untitled = lessons.findIndex((l) => !l.title);
    if (untitled >= 0) return { error: `Informe o título da aula ${untitled + 1} do módulo ${m + 1}` };
    out.push({ title, lessons });
  }
  return { curriculum: out };
}
