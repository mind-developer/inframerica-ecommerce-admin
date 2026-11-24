import type { Enrollment } from '@/types/enrollments';
import { filterPeople } from './peopleFilters';

const person = (id: string, over: Partial<Enrollment>) =>
  ({ id, personName: 'Ana', personCpf: '', concessionaireId: null, status: 'enrolled', ...over }) as Enrollment;
const people = [
  person('a', { personName: 'João Conceição', personCpf: '123.456.789-00', concessionaireId: 'ces-1' }),
  person('b', { personName: 'Maria', personCpf: '98765432100', status: 'completed' }),
];
const none = { nome: '', cpf: '', cessionaria: null, status: null };
const ids = (patch: object) => filterPeople(people, { ...none, ...patch }).map((p) => p.id);

describe('filterPeople (#65)', () => {
  it('shows everyone without filters', () => expect(ids({})).toEqual(['a', 'b']));

  it('finds names ignoring case and accents', () => {
    expect(ids({ nome: ' joao conceicao ' })).toEqual(['a']);
    expect(ids({ nome: 'CONCEIÇÃO' })).toEqual(['a']);
  });

  it('finds the CPF typed with or without its mask', () => {
    expect(ids({ cpf: '123.456' })).toEqual(['a']);
    expect(ids({ cpf: '123456789' })).toEqual(['a']);
    expect(ids({ cpf: '987.654.321-00' })).toEqual(['b']);
  });

  it('filters by concessionaire and status, together', () => {
    expect(ids({ cessionaria: 'ces-1' })).toEqual(['a']);
    expect(ids({ status: 'completed' })).toEqual(['b']);
    expect(ids({ cessionaria: 'ces-1', status: 'completed' })).toEqual([]);
  });
});
