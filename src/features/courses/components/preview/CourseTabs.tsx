'use client';

import { parseAsStringLiteral, useQueryState } from 'nuqs';
import type { ReactNode } from 'react';
import { tabPanelProps, Tabs } from '@/components/ui/Tabs';

const TABS = ['sobre', 'conteudo'] as const;
type Tab = (typeof TABS)[number];

/** "Sobre o Curso" / "Conteúdo Programático". The open tab is kept in `?aba=` so links can point at it. */
export function CourseTabs({ about, curriculum }: { about: ReactNode; curriculum: ReactNode }) {
  const [tab, setTab] = useQueryState('aba', parseAsStringLiteral(TABS).withDefault('sobre'));
  return (
    <>
      <Tabs<Tab>
        idPrefix="curso"
        className="mb-8"
        value={tab}
        onChange={(t) => void setTab(t)}
        tabs={[
          { id: 'sobre', label: 'Sobre o Curso' },
          { id: 'conteudo', label: 'Conteúdo Programático' },
        ]}
      />
      <div key={tab} className="animate-fade-in" {...tabPanelProps('curso', tab)}>
        {tab === 'sobre' ? about : curriculum}
      </div>
    </>
  );
}
