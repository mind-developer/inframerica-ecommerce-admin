import { render, screen } from '@testing-library/react';
import { cohortsSeed } from '@/mocks/cohorts';
import { CohortCard } from './CohortCard';

const card = (patch: object) =>
  render(
    <CohortCard
      cohort={{ ...cohortsSeed[0]!, totalSeats: 2, ...patch }}
      courseTitle="AVSEC"
      onEdit={() => {}}
      onCancel={() => {}}
      onDelete={() => {}}
    />,
  );

describe('CohortCard (#64)', () => {
  it('shows a full open cohort as closed, saying why', () => {
    card({ takenSeats: 2 });
    expect(screen.getByText('Fechada')).toBeInTheDocument();
    expect(screen.getByText('Vagas esgotadas')).toBeInTheDocument();
  });

  it('shows an open cohort with a free seat as open', () => {
    card({ takenSeats: 1 });
    expect(screen.getByText('Aberta')).toBeInTheDocument();
    expect(screen.queryByText('Vagas esgotadas')).toBeNull();
  });
});
