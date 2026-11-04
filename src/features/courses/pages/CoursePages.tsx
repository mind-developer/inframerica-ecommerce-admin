import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireScreen } from '@/features/auth/server';
import { getCredentials } from '@/features/credentials/server';
import { getSectors } from '@/features/sectors/server';
import { CoursesView } from '../components/CoursesView';
import { CoursePreview } from '../components/preview/CoursePreview';
import { getCourses } from '../data/courses';

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
  await requireScreen('courses');
  const [courses, sectors, credentials] = await Promise.all([getCourses(), getSectors(), getCredentials()]);
  return <CoursesView courses={courses} sectors={sectors} credentials={credentials} />;
}

async function CoursePreviewContent({ params }: { params: Promise<{ id: string }> }) {
  await requireScreen('courses');
  const { id } = await params;
  const course = (await getCourses()).find((c) => c.id === id);
  if (!course) notFound();
  return <CoursePreview course={course} />;
}
