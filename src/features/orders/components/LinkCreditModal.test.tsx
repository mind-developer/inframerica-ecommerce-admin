import { render, screen } from '@testing-library/react';
import type { Enrollment } from '@/types/enrollments';
import { LinkCreditModal } from './LinkCreditModal';

const student = { id: 'mat-1', personName: 'Ana', courseTitle: 'AVSEC' } as Enrollment;

it('stays a link, with nothing to confirm, when no cohort has a free seat (#64)', () => {
  render(<LinkCreditModal target={{ student, cohortId: '' }} cohorts={[]} customerEmail={null} onClose={() => {}} />);
  expect(screen.getByText('Vincular crédito')).toBeInTheDocument();
  expect(screen.getByText('Nenhuma turma com vaga livre para este curso.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Confirmar' })).toBeDisabled();
});
