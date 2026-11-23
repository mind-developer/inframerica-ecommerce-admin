import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { coursesSeed } from '@/mocks/courses';
import { CourseRow } from './CourseRow';

// Intl writes a no-break space in "R$ 185,00".
const meta = () => screen.getByTestId('course-meta').textContent?.replace(/\s/g, ' ');
const onPublish = vi.fn();
const row = (patch: object) =>
  render(
    <CourseRow
      course={{ ...coursesSeed[0]!, ...patch }}
      sectorName="AVSEC"
      onEdit={() => {}}
      onDelete={() => {}}
      onPublish={onPublish}
    />,
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

  it('publishes or unpublishes from the row (#66)', async () => {
    row({ active: false });
    const toggle = screen.getByRole('switch', { name: /Publicar/ });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(toggle);
    expect(onPublish).toHaveBeenCalledWith(true);
  });

  it('marks a course with no seats left as sold out (#68)', () => {
    row({ spotsLeft: 0 });
    expect(screen.getByText('Esgotado')).toBeInTheDocument();
  });
});
