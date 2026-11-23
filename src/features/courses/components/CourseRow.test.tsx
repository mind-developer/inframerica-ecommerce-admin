import { render, screen } from '@testing-library/react';
import { coursesSeed } from '@/mocks/courses';
import { CourseRow } from './CourseRow';

// Intl writes a no-break space in "R$ 185,00".
const meta = () => screen.getByTestId('course-meta').textContent?.replace(/\s/g, ' ');
const row = (patch: object) =>
  render(
    <CourseRow course={{ ...coursesSeed[0]!, ...patch }} sectorName="AVSEC" onEdit={() => {}} onDelete={() => {}} />,
  );

describe('CourseRow', () => {
  it('shows sector, workload, modules, price and instructor', () => {
    row({});
    expect(meta()).toBe('AVSEC · 8h · 2 módulos · R$ 185,00 · Cap. Roberto Alves');
  });

  it('leaves out what is blank, with no stray separator (#58)', () => {
    row({ instructor: '', duration: '' });
    expect(meta()).toBe('AVSEC · 2 módulos · R$ 185,00');
  });
});
