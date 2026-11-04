import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireScreen } from '@/features/auth/server';
import { getCourses } from '@/features/courses/server';
import { CohortPeopleView } from '../components/CohortPeopleView';
import { CohortsView } from '../components/CohortsView';
import { getCohorts, getConcessionaires, getEnrollments } from '../data/cohorts';

export function CohortsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CohortsContent />
    </Suspense>
  );
}

export function CohortPeoplePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<PageSkeleton rows={6} />}>
      <CohortPeopleContent params={params} />
    </Suspense>
  );
}

async function CohortsContent() {
  await requireScreen('cohorts');
  const [cohorts, courses] = await Promise.all([getCohorts(), getCourses()]);
  return <CohortsView cohorts={cohorts} courses={courses} />;
}

async function CohortPeopleContent({ params }: { params: Promise<{ id: string }> }) {
  await requireScreen('cohorts');
  const { id } = await params;
  const [cohorts, courses, enrollments, concessionaires] = await Promise.all([
    getCohorts(),
    getCourses(),
    getEnrollments(),
    getConcessionaires(),
  ]);
  const cohort = cohorts.find((c) => c.id === id);
  if (!cohort) notFound();
  const people = enrollments
    .filter((e) => e.cohortId === id)
    .sort((a, b) => a.personName.localeCompare(b.personName, 'pt-BR'));
  return (
    <CohortPeopleView
      cohort={cohort}
      courseTitle={courses.find((c) => c.id === cohort.courseId)?.title ?? 'Curso removido'}
      enrollments={people}
      concessionaires={concessionaires}
    />
  );
}
