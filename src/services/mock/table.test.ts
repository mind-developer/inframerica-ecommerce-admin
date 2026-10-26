import { MockTable } from './table';

type Row = { id: string; name: string; tags: string[] };
const seed: Row[] = [{ id: 'a', name: 'Alpha', tags: ['x'] }];

describe('MockTable', () => {
  it('starts with a copy of the seed and never mutates it', () => {
    const table = new MockTable(seed);
    table.update('a', { name: 'Changed' });
    expect(seed[0]!.name).toBe('Alpha');
    expect(table.find('a')!.name).toBe('Changed');
  });

  it('returns copies, so callers cannot mutate stored rows', () => {
    const table = new MockTable(seed);
    table.all()[0]!.tags.push('y');
    table.find('a')!.tags.push('z');
    expect(table.find('a')!.tags).toEqual(['x']);
  });

  it('inserts, updates and removes rows', () => {
    const table = new MockTable(seed);
    table.insert({ id: 'b', name: 'Beta', tags: [] });
    expect(table.all().map((r) => r.id)).toEqual(['a', 'b']);
    expect(table.update('b', { name: 'Bravo' })).toEqual({ id: 'b', name: 'Bravo', tags: [] });
    table.remove('a');
    expect(table.all().map((r) => r.id)).toEqual(['b']);
  });

  it('throws when updating a missing row', () => {
    expect(() => new MockTable(seed).update('nope', { name: 'x' })).toThrow('Registro nope não encontrado');
  });

  it('resets back to the seed', () => {
    const table = new MockTable(seed);
    table.replaceAll([]);
    table.reset();
    expect(table.all()).toEqual(seed);
  });
});
