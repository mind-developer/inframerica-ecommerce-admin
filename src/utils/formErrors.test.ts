import { firstError } from './formErrors';

describe('firstError', () => {
  it('reads plain strings and Zod-like issues, skipping empties', () => {
    expect(firstError([undefined, '', { message: 'Inválido' }])).toBe('Inválido');
    expect(firstError(['Obrigatório'])).toBe('Obrigatório');
    expect(firstError([])).toBeUndefined();
  });
});
