'use client';

import { ArrowUp, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';

/** Bullet list editor ("o que vai aprender", "para quem é", "pré-requisitos"). */
export function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  const add = () => {
    if (!draft.trim()) return;
    onChange([...items, draft.trim()]);
    setDraft('');
  };
  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...items];
    [next[i - 1], next[i]] = [next[i]!, next[i - 1]!];
    onChange(next);
  };
  return (
    <fieldset>
      <legend className="text-xs font-medium">{label}</legend>
      <ul className="mt-2 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Mover para cima"
              disabled={i === 0}
              onClick={() => moveUp(i)}
              className="text-muted-foreground hover:text-foreground disabled:opacity-25"
            >
              <ArrowUp aria-hidden className="size-3.5" />
            </button>
            <Input
              aria-label={`${label} ${i + 1}`}
              value={item}
              onChange={(e) => onChange(items.map((v, idx) => (idx === i ? e.target.value : v)))}
              className="flex-1"
            />
            <IconButton label="Remover item" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
              <X aria-hidden className="size-4 text-destructive" />
            </IconButton>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2">
        <Input
          aria-label={`Novo item: ${label}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <IconButton label="Adicionar item" onClick={add}>
          <Plus aria-hidden className="size-4" />
        </IconButton>
      </div>
      {items.length === 0 && (
        <p className="mt-1.5 text-xs text-muted-foreground">Nenhum item — esta seção não aparecerá na página.</p>
      )}
    </fieldset>
  );
}
