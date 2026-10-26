import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { CourseModule } from '@/types/catalog';
import { CurriculumEditor } from './CurriculumEditor';
import { StringListEditor } from './StringListEditor';

function Harness({ onValue }: { onValue: (c: CourseModule[]) => void }) {
  const [value, setValue] = useState<CourseModule[]>([]);
  return (
    <CurriculumEditor
      curriculum={value}
      onChange={(c) => {
        setValue(c);
        onValue(c);
      }}
    />
  );
}

describe('CurriculumEditor', () => {
  it('adds a module, a lesson and marks it free', async () => {
    const onValue = vi.fn();
    render(<Harness onValue={onValue} />);
    await userEvent.click(screen.getByRole('button', { name: /Adicionar módulo/ }));
    await userEvent.click(screen.getByRole('button', { name: /Adicionar aula/ }));
    await userEvent.type(screen.getByLabelText('Título da aula 1'), 'Abertura');
    await userEvent.click(screen.getByLabelText(/grátis/));
    expect(onValue).toHaveBeenLastCalledWith([
      { title: 'Módulo 1', lessons: [{ title: 'Abertura', duration: '', free: true }] },
    ]);
  });
});

describe('StringListEditor', () => {
  it('adds with Enter, edits and reorders items', async () => {
    function ListHarness() {
      const [items, setItems] = useState(['a', 'b']);
      return (
        <>
          <StringListEditor label="Pontos" items={items} onChange={setItems} />
          <output>{items.join(',')}</output>
        </>
      );
    }
    render(<ListHarness />);
    await userEvent.type(screen.getByLabelText('Novo item: Pontos'), 'c{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('a,b,c');
    await userEvent.click(screen.getAllByRole('button', { name: 'Mover para cima' })[2]!);
    expect(screen.getByRole('status')).toHaveTextContent('a,c,b');
  });
});
