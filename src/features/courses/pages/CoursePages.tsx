import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { sectorOf } from '@/domain/sectorScope';
import { requireScreen } from '@/features/auth/server';
import { getCredentials } from '@/features/credentials/server';
import { getSectors } from '@/features/sectors/server';
import { CoursesView } from '../components/CoursesView';
import { CoursePreview } from '../components/preview/CoursePreview';
import { getSectorCourses } from '../data/courses';

export function CoursesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CoursesContent />
    </Suspense>
  );
}

export function CoursePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<PageSkeleton rows={2} />}>
      <CoursePreviewContent params={params} />
    </Suspense>
  );
}

async function CoursesContent() {
  const admin = await requireScreen('courses');
  const [courses, sectors, credentials] = await Promise.all([getSectorCourses(admin), getSectors(), getCredentials()]);
  // A sector-limited admin creates and moves courses only within their sector.
  const sector = sectorOf(admin);
  const usable = sector ? sectors.filter((s) => s.id === sector) : sectors;
  return <CoursesView courses={courses} sectors={usable} credentials={credentials} />;
}

async function CoursePreviewContent({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireScreen('courses');
  const { id } = await params;
  const course = (await getSectorCourses(admin)).find((c) => c.id === id);
  if (!course) notFound();
  return <CoursePreview course={course} />;
}
