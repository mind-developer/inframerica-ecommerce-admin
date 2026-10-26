'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { useServerAction } from '@/components/ui/useServerAction';
import { saveAbout } from '../actions/contentActions';
import { SaveRow } from './SaveRow';

/** Institutional text. No store page shows it yet (prototype pending item 3). */
export function AboutForm({ about }: { about: string }) {
  const [text, setText] = useState(about);
  const { pending, run } = useServerAction();
  return (
    <Card>
      <CardContent className="pt-6">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => saveAbout(text), 'Texto institucional salvo');
          }}
        >
          <label htmlFor="about" className="text-xs font-medium">
            Texto institucional
          </label>
          <Textarea
            id="about"
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Texto livre sobre a empresa, exibido em páginas institucionais do site."
          />
          <SaveRow label="Salvar texto" pending={pending} />
        </form>
      </CardContent>
    </Card>
  );
}
