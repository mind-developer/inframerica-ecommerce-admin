import type { Metadata } from 'next';
import { CoursesPage } from '@/features/courses/server';

export const metadata: Metadata = { title: 'Cursos' };

export default function Page() {
  return <CoursesPage />;
}
