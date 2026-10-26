'use client';

import { ChevronDown, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import type { CourseLesson, CourseModule } from '@/types/catalog';
import { cn } from '@/utils/cn';
import { LessonRow } from './LessonRow';

export function CurriculumModule({
  module: m,
  index,
  open,
  onToggle,
  onChange,
  onRemove,
}: {
  module: CourseModule;
  index: number;
  open: boolean;
  onToggle: () => void;
  onChange: (m: CourseModule) => void;
  onRemove: () => void;
}) {
  const setLesson = (i: number, patch: Partial<CourseLesson>) =>
    onChange({ ...m, lessons: m.lessons.map((l, idx) => (idx === i ? { ...l, ...patch } : l)) });
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex items-center gap-2 bg-muted/40 px-3 py-2">
        <button
          type="button"
          aria-label={open ? 'Recolher módulo' : 'Expandir módulo'}
          aria-expanded={open}
          onClick={onToggle}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <ChevronDown aria-hidden className={cn('size-4 transition-transform', open && 'rotate-180')} />
        </button>
        <Input
          aria-label={`Título do módulo ${index + 1}`}
          value={m.title}
          onChange={(e) => onChange({ ...m, title: e.target.value })}
          placeholder="Título do módulo"
          className="h-8 flex-1"
        />
        <span className="text-[11px] whitespace-nowrap text-muted-foreground">{m.lessons.length} aulas</span>
        <IconButton label="Remover módulo" className="size-8" onClick={onRemove}>
          <X aria-hidden className="size-3.5 text-destructive" />
        </IconButton>
      </div>
      {open && (
        <div className="space-y-2 p-3">
          {m.lessons.map((lesson, i) => (
            <LessonRow
              key={i}
              index={i}
              lesson={lesson}
              onChange={(patch) => setLesson(i, patch)}
              onRemove={() => onChange({ ...m, lessons: m.lessons.filter((_, idx) => idx !== i) })}
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onChange({ ...m, lessons: [...m.lessons, { title: '', duration: '' }] })}
          >
            <Plus aria-hidden className="size-3.5" /> Adicionar aula
          </Button>
        </div>
      )}
    </div>
  );
}
