import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireScreen } from '@/features/auth/server';
import { cohortsInSector, sectorOf } from '@/domain/sectorScope';
import { getSectorCourses } from '@/features/courses/server';
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
  const admin = await requireScreen('cohorts');
  // Only the sector's courses (#49): the list and the course choices in the form follow them.
  const [cohorts, courses] = await Promise.all([getCohorts(), getSectorCourses(admin)]);
  return <CohortsView cohorts={cohortsInSector(cohorts, courses, sectorOf(admin))} courses={courses} />;
}

async function CohortPeopleContent({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireScreen('cohorts');
  const { id } = await params;
  const [cohorts, courses, enrollments, concessionaires] = await Promise.all([
    getCohorts(),
    getSectorCourses(admin),
    getEnrollments(),
    getConcessionaires(),
  ]);
  const cohort = cohortsInSector(cohorts, courses, sectorOf(admin)).find((c) => c.id === id);
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
