import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { coursesSeed } from '@/mocks/courses';
import { renderWithProviders } from '@/test/renderWithProviders';
import type { Course } from '@/types/catalog';
import { CoursePreview } from './CoursePreview';

const show = (patch: Partial<Course> = {}) =>
  renderWithProviders(<CoursePreview course={{ ...coursesSeed[0]!, ...patch }} />);

describe('CoursePreview (#70)', () => {
  it('warns when the course is not published', () => {
    show({ active: false });
    expect(screen.getByRole('status')).toHaveTextContent('Este curso não está publicado');
  });

  it('gives no warning for a published course', () => {
    show({ active: true });
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('has the tabs of the public page', async () => {
    show();
    expect(screen.getByRole('heading', { name: 'O que você vai aprender' })).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo Programático do Curso')).toBeNull();
    await userEvent.click(screen.getByRole('tab', { name: 'Conteúdo Programático' }));
    expect(screen.getByText('Conteúdo Programático do Curso')).toBeInTheDocument();
  });

  it('shows the purchase card as the store does, with buying off', () => {
    show({ price: 80, originalPrice: 100, minPerPurchase: 2, maxPerPurchase: 4 });
    expect(screen.getByText('-20% off')).toBeInTheDocument();
    expect(screen.getByText('Mínimo de 2 e máximo de 4 vagas por compra')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Comprar Agora/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Adicionar ao Carrinho/ })).toBeDisabled();
  });

  it('prices the minimum purchase, like the store', () => {
    show({ price: 80, originalPrice: 100, minPerPurchase: 2 });
    expect(screen.getByText(/R\$\s200,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s160,00/)).toBeInTheDocument();
  });

  it('tells sold out from too few seats', () => {
    show({ spotsLeft: 0 });
    expect(screen.getByRole('button', { name: /Esgotado/ })).toBeDisabled();
  });

  it('tells too few seats for the minimum', () => {
    show({ spotsLeft: 1, minPerPurchase: 2 });
    expect(screen.getByRole('button', { name: /Vagas insuficientes/ })).toBeDisabled();
  });

  it('promises no certificate the course does not issue, nor empty sections', () => {
    show({ certificate: false, prerequisites: [] });
    expect(screen.queryByText(/Certificado/)).toBeNull();
    expect(screen.queryByText('Pré-requisitos')).toBeNull();
  });
});
