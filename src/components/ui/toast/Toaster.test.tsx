import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';
import { Toaster, toast } from '.';
import { useToastStore } from './toastStore';

const page = (a: boolean, b = false, onClose = () => {}) => (
  <>
    <Modal open={a} onClose={onClose} title="Primeiro" />
    <Modal open={b} onClose={onClose} title="Segundo" />
    <Toaster />
  </>
);
const dialog = (name: string) => screen.getByRole('dialog', { name });
const notice = () => screen.getByText('Falhou');

describe('Toaster and modals', () => {
  beforeEach(() => useToastStore.setState({ toasts: [], hosts: [] }));
  const show = () => act(() => toast('Falhou', undefined, 'error'));

  it('stays on the page without a modal', () => {
    render(page(false));
    show();
    expect(notice().closest('dialog')).toBeNull();
  });

  it('shows inside the open modal, the last one opened, and follows as they close', () => {
    const { rerender } = render(page(true));
    show();
    expect(dialog('Primeiro')).toContainElement(notice());
    rerender(page(true, true));
    expect(dialog('Segundo')).toContainElement(notice());
    rerender(page(true, false));
    expect(dialog('Primeiro')).toContainElement(notice());
    rerender(page(false));
    expect(notice().closest('dialog')).toBeNull();
  });

  it('goes back to the page when the modal unmounts', () => {
    const { rerender } = render(page(true));
    show();
    rerender(
      <>
        <Toaster />
      </>,
    );
    expect(notice().closest('dialog')).toBeNull();
  });

  it('can be dismissed without closing the modal', async () => {
    const onClose = vi.fn();
    render(page(true, false, onClose));
    show();
    // jsdom has no popover support and treats it as hidden.
    await userEvent.click(within(dialog('Primeiro')).getByRole('button', { name: 'Fechar aviso', hidden: true }));
    expect(screen.queryByText('Falhou')).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
  });
});
