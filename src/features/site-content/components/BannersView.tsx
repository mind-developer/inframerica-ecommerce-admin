'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmActionModal } from '@/components/ui/ConfirmActionModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Banner } from '@/types/content';
import { deleteBanner, setBannerActive } from '../actions/contentActions';
import { BannerFormModal } from './BannerFormModal';
import { BannersTable } from './BannersTable';

export function BannersView({ banners: all }: { banners: Banner[] }) {
  const banners = [...all].sort((a, b) => a.position - b.position);
  const [editing, setEditing] = useState<Banner | 'new' | null>(null);
  const [removing, setRemoving] = useState<Banner | null>(null);
  const { pending, run } = useServerAction();
  return (
    <>
      <PageHeader
        title="Banners"
        subtitle={`${banners.length} banner(s) cadastrados · exibidos no site público conforme ordem e período`}
        actions={
          <Button onClick={() => setEditing('new')}>
            <Plus aria-hidden className="size-4" /> Novo banner
          </Button>
        }
      />
      {banners.length === 0 ? (
        <EmptyState title="Nenhum banner cadastrado." />
      ) : (
        <BannersTable
          banners={banners}
          pending={pending}
          onToggle={(b, v) => run(() => setBannerActive(b.id, v), v ? 'Banner ativado' : 'Banner desativado')}
          onEdit={setEditing}
          onDelete={setRemoving}
        />
      )}
      {editing && (
        <BannerFormModal
          banner={editing === 'new' ? null : editing}
          nextPosition={banners.length + 1}
          onClose={() => setEditing(null)}
        />
      )}
      <ConfirmActionModal
        target={removing}
        title={(r) => `Excluir o banner "${r.title}"?`}
        confirmLabel="Excluir"
        success="Banner removido"
        action={(r) => deleteBanner(r.id)}
        onClose={() => setRemoving(null)}
      />
    </>
  );
}
