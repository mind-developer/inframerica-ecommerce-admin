import type { Metadata } from 'next';
import { CoursePreviewPage } from '@/features/courses/server';

export const metadata: Metadata = { title: 'Pré-visualização do curso' };

export default function Page({ params }: PageProps<'/cursos/[id]/preview'>) {
  return <CoursePreviewPage params={params} />;
}
