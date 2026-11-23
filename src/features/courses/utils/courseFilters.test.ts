import { coursesSeed } from '@/mocks/courses';
import { filterCourses } from './courseFilters';

const courses = coursesSeed.map((c, i) => ({ ...c, active: i !== 0 }));

describe('filterCourses', () => {
  it('searches title, category and instructor, ignoring case', () => {
    expect(filterCourses(courses, 'roberto', null).map((c) => c.id)).toEqual(['cur-1', 'cur-4']);
  });

  it('keeps only published or only unpublished courses (#66)', () => {
    expect(filterCourses(courses, '', 'draft').map((c) => c.id)).toEqual(['cur-1']);
    expect(filterCourses(courses, '', 'published')).toHaveLength(courses.length - 1);
    expect(filterCourses(courses, 'roberto', 'published').map((c) => c.id)).toEqual(['cur-4']);
  });
});
