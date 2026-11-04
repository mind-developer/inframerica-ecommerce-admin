import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { PermissionMatrix } from './PermissionMatrix';

function Harness({ held }: { held: string[] }) {
  const [value, setValue] = useState<string[]>([]);
  return <PermissionMatrix value={value} held={held} onChange={setValue} />;
}

describe('PermissionMatrix', () => {
  it('needs Visualizar before Ações, and unticking it drops both', async () => {
    render(<Harness held={['orders.read', 'orders.manage']} />);
    const view = screen.getByRole('checkbox', { name: 'Visualizar Pedidos' });
    const act = screen.getByRole('checkbox', { name: 'Ações em Pedidos' });
    expect(act).toBeDisabled();
    await userEvent.click(view);
    await userEvent.click(act);
    expect(act).toBeChecked();
    await userEvent.click(view);
    expect(act).not.toBeChecked();
    expect(act).toBeDisabled();
  });

  it('locks what the admin does not hold', () => {
    render(<Harness held={['orders.read']} />);
    expect(screen.getByRole('checkbox', { name: 'Visualizar Cursos' })).toBeDisabled();
  });
});
