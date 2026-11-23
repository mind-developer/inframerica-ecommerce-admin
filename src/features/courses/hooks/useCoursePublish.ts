'use client';

import { useTransition } from 'react';
import { toast } from '@/components/ui/toast';
import type { Course } from '@/types/catalog';
import { setCoursePublished } from '../actions/courseActions';

/** Publish or unpublish a course from the list, with a toast for the outcome (#66). */
export function useCoursePublish() {
  const [publishing, start] = useTransition();
  const publish = (c: Course, active: boolean) =>
    start(async () => {
      const r = await setCoursePublished(c.id, active);
      if (r.ok) toast(active ? 'Curso publicado' : 'Curso despublicado', c.title, 'success');
      else toast('Não foi possível alterar', r.error, 'error');
    });
  return { publish, publishing };
}
