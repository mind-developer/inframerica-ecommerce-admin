import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/renderWithProviders';
import { saveSector } from '../actions/sectorActions';
import { SectorFormModal } from './SectorFormModal';

vi.mock('../actions/sectorActions', () => ({ saveSector: vi.fn().mockResolvedValue({ ok: true, data: null }) }));

const sector = { id: 'set-avsec', name: 'AVSEC', description: '', manager: '', active: true };

beforeEach(() => vi.mocked(saveSector).mockClear());

describe('SectorFormModal (#52)', () => {
  it('warns before deactivating a sector with links, and saves only after confirming', async () => {
    renderWithProviders(<SectorFormModal sector={sector} links={{ courses: 2, credentials: 0 }} onClose={() => {}} />);
    await userEvent.click(screen.getByRole('switch'));
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(await screen.findByText(/Este setor tem 2 cursos vinculados/)).toBeInTheDocument();
    expect(saveSector).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Desativar setor' }));
    await waitFor(() =>
      expect(saveSector).toHaveBeenCalledWith('set-avsec', expect.objectContaining({ active: false })),
    );
  });

  it('going back from the warning keeps the form open with what was typed', async () => {
    renderWithProviders(<SectorFormModal sector={sector} links={{ courses: 2, credentials: 0 }} onClose={() => {}} />);
    await userEvent.click(screen.getByRole('switch'));
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Voltar' }));
    expect(screen.queryByText(/Este setor tem/)).not.toBeInTheDocument();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    expect(saveSector).not.toHaveBeenCalled();
  });

  it('saves at once when nothing is linked', async () => {
    renderWithProviders(<SectorFormModal sector={sector} links={{ courses: 0, credentials: 0 }} onClose={() => {}} />);
    await userEvent.click(screen.getByRole('switch'));
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    await waitFor(() => expect(saveSector).toHaveBeenCalled());
    expect(screen.queryByText(/vinculad/)).not.toBeInTheDocument();
  });
});
