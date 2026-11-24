import { render, screen } from '@testing-library/react';
import { credentialsSeed } from '@/mocks/credentials';
import { CredentialCard } from './CredentialCard';

const card = (courses: number) =>
  render(
    <CredentialCard
      credential={credentialsSeed[0]!}
      courses={courses}
      sectorName={() => 'AVSEC'}
      onEdit={() => {}}
      onDelete={() => {}}
    />,
  );

it.each([
  [0, 'Nenhum curso vinculado'],
  [1, '1 curso vinculado'],
  [3, '3 cursos vinculados'],
])('shows how many courses enable it: %i (#69)', (n, text) => {
  card(n);
  expect(screen.getByText(text)).toBeInTheDocument();
});
