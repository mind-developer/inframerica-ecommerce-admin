import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireAdmin } from '@/features/auth/server';
import { BannersView } from '../components/BannersView';
import { ContentEditor } from '../components/ContentEditor';
import { getCachedSiteContent } from '../data/siteContent';

export function SiteContentPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SiteContentLoader />
    </Suspense>
  );
}

export function BannersPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <BannersLoader />
    </Suspense>
  );
}

async function SiteContentLoader() {
  await requireAdmin();
  return <ContentEditor content={await getCachedSiteContent()} />;
}

async function BannersLoader() {
  await requireAdmin();
  return <BannersView banners={(await getCachedSiteContent()).banners} />;
}
