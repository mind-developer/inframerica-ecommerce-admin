'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useServerAction } from '@/components/ui/useServerAction';
import type { FaqItem } from '@/types/content';
import { saveFaq } from '../actions/contentActions';
import { SaveRow } from './SaveRow';

export function FaqEditor({ faq }: { faq: FaqItem[] }) {
  const [items, setItems] = useState(faq);
  const { pending, run } = useServerAction();
  const edit = (i: number, patch: Partial<FaqItem>) =>
    setItems((all) => all.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  return (
    <Card>
      <CardContent className="pt-6">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => saveFaq(items), 'FAQ salvo');
          }}
        >
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma pergunta cadastrada — esta seção não aparecerá no site.
            </p>
          )}
          {items.map((item, i) => (
            <fieldset key={i} className="space-y-2 rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <legend className="text-xs text-muted-foreground">Pergunta {i + 1}</legend>
                <IconButton
                  label={`Remover pergunta ${i + 1}`}
                  onClick={() => setItems((all) => all.filter((_, idx) => idx !== i))}
                >
                  <Trash2 aria-hidden className="size-4 text-destructive" />
                </IconButton>
              </div>
              <Input
                aria-label={`Pergunta ${i + 1}`}
                value={item.question}
                onChange={(e) => edit(i, { question: e.target.value })}
                placeholder="Pergunta"
              />
              <Textarea
                aria-label={`Resposta ${i + 1}`}
                rows={2}
                value={item.answer}
                onChange={(e) => edit(i, { answer: e.target.value })}
                placeholder="Resposta"
              />
              <p className="text-[11px] text-muted-foreground">
                Para incluir um link na resposta, use o formato{' '}
                <code className="rounded bg-muted px-1">[texto do link](https://url.com)</code> — ele aparece clicável
                no site.
              </p>
            </fieldset>
          ))}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setItems((all) => [...all, { question: '', answer: '' }])}>
              <Plus aria-hidden className="size-4" /> Adicionar pergunta
            </Button>
            <SaveRow label="Salvar FAQ" pending={pending} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
