import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/renderWithProviders';
import { LoginForm } from './LoginForm';

vi.mock('../actions/authActions', () => ({ signIn: vi.fn() }));

describe('LoginForm', () => {
  it('offers no demo account shortcut', () => {
    renderWithProviders(<LoginForm />);
    expect(screen.queryByText(/demonstração/i)).not.toBeInTheDocument();
    expect(screen.getAllByRole('button').map((b) => b.textContent?.trim() || b.getAttribute('aria-label'))).toEqual([
      'Mostrar senha',
      'Entrar',
    ]);
  });

  it('shows and hides the password with the eye button', async () => {
    renderWithProviders(<LoginForm />);
    const password = screen.getByPlaceholderText('Senha');
    expect(password).toHaveAttribute('type', 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }));
    expect(password).toHaveAttribute('type', 'text');
    await userEvent.click(screen.getByRole('button', { name: 'Ocultar senha' }));
    expect(password).toHaveAttribute('type', 'password');
  });
});
