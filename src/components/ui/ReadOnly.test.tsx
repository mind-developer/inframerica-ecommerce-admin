import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { ReadOnlyContext } from './ReadOnly';

describe('read-only screens', () => {
  it('hides what acts and keeps what only looks', () => {
    render(
      <ReadOnlyContext.Provider value>
        <Button variant="accent">Salvar</Button>
        <Button variant="outline">Cancelar</Button>
        <IconButton label="Remover">x</IconButton>
        <IconButton label="Copiar" safeInReadOnly>
          x
        </IconButton>
      </ReadOnlyContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remover' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copiar' })).toBeInTheDocument();
  });
});
