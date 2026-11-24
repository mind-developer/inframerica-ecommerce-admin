import { render, screen } from '@testing-library/react';
import { ReadOnlyContext } from '@/components/ui/ReadOnly';
import { enrollmentsSeed } from '@/mocks/enrollments';
import type { Enrollment } from '@/types/enrollments';
import { EnrollmentRow } from './EnrollmentRow';

const row = (patch: Partial<Enrollment>, readOnly = false) =>
  render(
    <ReadOnlyContext.Provider value={readOnly}>
      <EnrollmentRow
        enrollment={{ ...enrollmentsSeed[0]!, ...patch }}
        disabled={false}
        onStatus={() => {}}
        onUnlink={() => {}}
      />
    </ReadOnlyContext.Provider>,
  );
const recent = { status: 'enrolled' as const, linkedAt: new Date().toISOString() };

describe('EnrollmentRow (#65)', () => {
  it('lets a recent link be undone', () => {
    row(recent);
    expect(screen.getByRole('button', { name: /Desvincular/ })).toBeEnabled();
  });

  it('says why a person can no longer be unlinked', () => {
    row({ status: 'in_progress' });
    expect(screen.getByRole('button', { name: /Desvincular/ })).toBeDisabled();
    expect(screen.getByText(/Curso já iniciado/)).toBeInTheDocument();
  });

  it('only shows the status on a read-only screen', () => {
    row(recent, true);
    expect(screen.queryByRole('combobox')).toBeNull();
    expect(screen.queryByRole('button', { name: /Desvincular/ })).toBeNull();
  });
});
