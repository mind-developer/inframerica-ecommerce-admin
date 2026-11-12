import { deactivationWarning } from './sectorLinks';

describe('deactivationWarning', () => {
  it('names what is linked, in Portuguese', () => {
    expect(deactivationWarning({ courses: 2, credentials: 1 })).toBe(
      'Este setor tem 2 cursos e 1 credencial vinculados. Eles continuam no sistema, mas o setor deixa de aparecer como ativo.',
    );
    expect(deactivationWarning({ courses: 1, credentials: 0 })).toMatch(/^Este setor tem 1 curso vinculado\./);
  });

  it('has nothing to warn about a sector without links', () => {
    expect(deactivationWarning({ courses: 0, credentials: 0 })).toBeNull();
  });
});
