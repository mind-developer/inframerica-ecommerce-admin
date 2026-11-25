import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/renderWithProviders';
import { LoginOptions } from './LoginOptions';

vi.mock('../actions/authActions', () => ({ signIn: vi.fn() }));

const show = (microsoft: boolean, password: boolean, searchParams = '') =>
  renderWithProviders(<LoginOptions methods={{ microsoft, password }} />, { searchParams });
const button = () => screen.queryByRole('link', { name: 'Entrar com Microsoft' });

describe('LoginOptions', () => {
  it('offers only what is on', () => {
    const { unmount } = show(true, false);
    expect(button()).toHaveAttribute('href', '/auth/entra/start');
    expect(screen.queryByPlaceholderText('Senha')).toBeNull();
    unmount();
    show(false, true);
    expect(button()).toBeNull();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
  });

  it('keeps the page the admin was heading to', () => {
    show(true, true, '?redirect=/clientes?id=7');
    expect(button()).toHaveAttribute('href', '/auth/entra/start?redirect=%2Fclientes%3Fid%3D7');
  });

  it('explains a refused sign-in, and ignores unknown codes', () => {
    const { unmount } = show(true, false, '?erro=sem-acesso');
    expect(screen.getByRole('alert')).toHaveTextContent('Peça a um administrador');
    unmount();
    show(true, false, '?erro=constructor');
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
