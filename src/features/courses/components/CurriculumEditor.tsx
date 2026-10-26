'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { CourseModule } from '@/types/catalog';
import { CurriculumModule } from './CurriculumModule';

/** Modules and lessons, mirroring the "Conteúdo Programático" tab of the public page. */
export function CurriculumEditor({
  curriculum,
  onChange,
}: {
  curriculum: CourseModule[];
  onChange: (c: CourseModule[]) => void;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const lessons = curriculum.reduce((n, m) => n + m.lessons.length, 0);
  return (
    <fieldset>
      <div className="flex items-center justify-between">
        <legend className="text-xs font-medium">Currículo</legend>
        <span className="text-xs text-muted-foreground">
          {curriculum.length} módulos · {lessons} aulas
        </span>
      </div>
      <div className="mt-2 space-y-2">
        {curriculum.map((m, i) => (
          <CurriculumModule
            key={i}
            module={m}
            index={i}
            open={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
            onChange={(next) => onChange(curriculum.map((x, idx) => (idx === i ? next : x)))}
            onRemove={() => {
              onChange(curriculum.filter((_, idx) => idx !== i));
              setOpen(null);
            }}
          />
        ))}
      </div>
      <Button
        variant="outline"
        className="mt-2 w-full"
        onClick={() => {
          onChange([...curriculum, { title: `Módulo ${curriculum.length + 1}`, lessons: [] }]);
          setOpen(curriculum.length);
        }}
      >
        <Plus aria-hidden className="size-4" /> Adicionar módulo
      </Button>
    </fieldset>
  );
}
