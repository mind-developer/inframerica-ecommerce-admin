import { Suspense } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireAdmin } from '@/features/auth/server';
import { StoreSettingsCard } from '../components/StoreSettingsCard';
import { getCachedStoreSettings } from '../data/settings';

export function SettingsPage() {
  return (
    <>
      <PageHeader title="Configurações" subtitle="Configurações operacionais da loja de treinamentos." />
      <Suspense fallback={<PageSkeleton rows={2} />}>
        <SettingsContent />
      </Suspense>
    </>
  );
}

async function SettingsContent() {
  await requireAdmin();
  return <StoreSettingsCard settings={await getCachedStoreSettings()} />;
}
