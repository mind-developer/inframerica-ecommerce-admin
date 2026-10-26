'use client';

import { X } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import type { CourseLesson } from '@/types/catalog';

interface Props {
  lesson: CourseLesson;
  index: number;
  onChange: (patch: Partial<CourseLesson>) => void;
  onRemove: () => void;
}

export function LessonRow({ lesson, index, onChange, onRemove }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Input
        aria-label={`Título da aula ${index + 1}`}
        value={lesson.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Título da aula"
        className="h-8 flex-1"
      />
      <Input
        aria-label={`Duração da aula ${index + 1}`}
        value={lesson.duration}
        onChange={(e) => onChange({ duration: e.target.value })}
        placeholder="45min"
        className="h-8 w-24"
      />
      <label
        className="flex cursor-pointer items-center gap-1 text-[11px] whitespace-nowrap text-muted-foreground"
        title="Aula liberada como amostra grátis"
      >
        <input
          type="checkbox"
          checked={Boolean(lesson.free)}
          onChange={(e) => onChange({ free: e.target.checked })}
          className="accent-primary"
        />{' '}
        grátis
      </label>
      <IconButton label="Remover aula" className="size-8" onClick={onRemove}>
        <X aria-hidden className="size-3.5 text-destructive" />
      </IconButton>
    </div>
  );
}
