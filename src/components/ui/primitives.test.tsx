import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Button } from './Button';
import { Field } from './Field';
import { Modal } from './Modal';
import { Select } from './Select';
import { Switch } from './Switch';
import { Tabs } from './Tabs';
import { toast, useToastStore } from './toast/toastStore';

describe('Button', () => {
  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Ok</Button>);
    expect(screen.getByRole('button', { name: 'Ok' })).toHaveAttribute('type', 'button');
  });
});

describe('Modal', () => {
  function Harness() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Modal open={open} onClose={() => setOpen(false)} title="Título" footer={<Button>Ação</Button>}>
          Conteúdo
        </Modal>
        <span>{open ? 'aberto' : 'fechado'}</span>
      </>
    );
  }

  it('renders title, body and footer while open and closes from the close button', async () => {
    render(<Harness />);
    expect(screen.getByRole('heading', { name: 'Título' })).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.getByText('fechado')).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument();
  });
});

describe('Tabs', () => {
  it('marks the active tab and switches on click', async () => {
    const onChange = vi.fn();
    render(
      <Tabs
        idPrefix="t"
        tabs={[
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
        ]}
        value="a"
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });
});

describe('Switch', () => {
  it('exposes its state and toggles', async () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onChange} aria-label="Loja fechada" />);
    const sw = screen.getByRole('switch', { name: 'Loja fechada' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('Select', () => {
  it('renders the options with a disabled placeholder', () => {
    render(<Select aria-label="Curso" defaultValue="" placeholder="Escolha" options={[{ value: 'x', label: 'X' }]} />);
    expect(screen.getByRole('option', { name: 'Escolha' })).toBeDisabled();
    expect(screen.getByRole('option', { name: 'X' })).toBeInTheDocument();
  });
});

describe('Field', () => {
  it('links the label and announces the error', () => {
    render(
      <Field id="email" label="E-mail" error="Obrigatório">
        <input id="email" />
      </Field>,
    );
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Obrigatório');
  });
});

describe('toast', () => {
  beforeEach(() => useToastStore.setState({ toasts: [] }));

  it('keeps at most three toasts, dropping the oldest', () => {
    act(() => ['1', '2', '3', '4'].forEach((t) => toast(t)));
    expect(useToastStore.getState().toasts.map((t) => t.title)).toEqual(['2', '3', '4']);
  });
});
