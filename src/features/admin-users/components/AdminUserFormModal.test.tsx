import { render, screen } from '@testing-library/react';
import { AdminUserFormModal } from './AdminUserFormModal';

vi.mock('../actions/adminUserActions', () => ({ saveAdminUser: vi.fn() }));

const show = (microsoft: boolean, password: boolean) =>
  render(
    <AdminUserFormModal user={null} sectors={[]} profiles={[]} methods={{ microsoft, password }} onClose={() => {}} />,
  );

describe('AdminUserFormModal', () => {
  it('asks for no password when only Microsoft is on', () => {
    show(true, false);
    expect(screen.queryByLabelText(/Senha/)).toBeNull();
    expect(screen.getByText(/mesmo e-mail da conta Microsoft/)).toBeInTheDocument();
  });

  it('keeps the password while that sign-in is on, optional next to Microsoft', () => {
    const { unmount } = show(true, true);
    expect(screen.getByLabelText(/Senha provisória \(opcional\)/)).toBeInTheDocument();
    unmount();
    show(false, true);
    expect(screen.getByLabelText(/^Senha provisória/)).toBeInTheDocument();
  });
});
