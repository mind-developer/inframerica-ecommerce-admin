'use client';

import { RotateCcw } from 'lucide-react';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { PageHeader } from '@/components/ui/PageHeader';
import { tabPanelProps, Tabs } from '@/components/ui/Tabs';
import { useServerAction } from '@/components/ui/useServerAction';
import type { SiteContent } from '@/types/content';
import { resetContent } from '../actions/contentActions';
import { AboutForm } from './AboutForm';
import { ContactForm } from './ContactForm';
import { FaqEditor } from './FaqEditor';
import { HeroForm } from './HeroForm';

const TABS = ['cabecalho', 'faq', 'contato', 'institucional'] as const;
type Tab = (typeof TABS)[number];

export function ContentEditor({ content }: { content: SiteContent }) {
  const [tab, setTab] = useQueryState('aba', parseAsStringLiteral(TABS).withDefault('cabecalho'));
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useServerAction();
  // Forms are keyed by the content's stamp, so they reload after a save or a reset.
  const key = content.updatedAt;
  return (
    <>
      <PageHeader
        title="Conteúdo do Site"
        subtitle="Textos exibidos no site público — alterações refletem imediatamente para os visitantes."
        actions={
          <Button variant="outline" onClick={() => setConfirming(true)}>
            <RotateCcw aria-hidden className="size-4" /> Restaurar padrão
          </Button>
        }
      />
      <Tabs<Tab>
        idPrefix="conteudo"
        className="mb-4"
        value={tab}
        onChange={(t) => void setTab(t)}
        tabs={[
          { id: 'cabecalho', label: 'Cabeçalho' },
          { id: 'faq', label: 'FAQ' },
          { id: 'contato', label: 'Contato' },
          { id: 'institucional', label: 'Textos institucionais' },
        ]}
      />
      <div {...tabPanelProps('conteudo', tab)}>
        {tab === 'cabecalho' && <HeroForm key={key} hero={content.hero} />}
        {tab === 'faq' && <FaqEditor key={key} faq={content.faq ?? []} />}
        {tab === 'contato' && <ContactForm key={key} contact={content.contact} />}
        {tab === 'institucional' && <AboutForm key={key} about={content.about ?? ''} />}
      </div>
      <ConfirmModal
        open={confirming}
        title="Restaurar todo o conteúdo do site para o padrão de fábrica?"
        confirmLabel="Restaurar"
        destructive
        pending={pending}
        onClose={() => setConfirming(false)}
        onConfirm={() =>
          run(
            () => resetContent(),
            'Conteúdo restaurado para o padrão',
            () => setConfirming(false),
          )
        }
      />
    </>
  );
}
