import { createCrudService } from './crud';
import { MockTable } from './table';

type Row = { id: string; name: string; createdAt: string };
const seed: Row[] = [{ id: 'r-1', name: 'Um', createdAt: '2026-01-01' }];

const setup = () => {
  const table = new MockTable(seed);
  const service = createCrudService<Row, { name: string }>(
    () => table,
    (input) => ({ ...input, createdAt: 'stamped' }),
    'r',
  );
  return { table, service };
};

describe('createCrudService', () => {
  it('lists the seed and gets by id (null when missing, no throw)', async () => {
    const { service } = setup();
    expect(await service.list()).toEqual(seed);
    expect(await service.get('r-1')).toEqual(seed[0]);
    expect(await service.get('nope')).toBeNull();
  });

  it('creates with a prefixed id and server stamps, appended at the end', async () => {
    const { service } = setup();
    const created = await service.create({ name: 'Dois' });
    expect(created.id).toMatch(/^r-[0-9a-f]{8}$/);
    expect(created.createdAt).toBe('stamped');
    expect((await service.list()).map((r) => r.name)).toEqual(['Um', 'Dois']);
  });

  it('updates partially, and throws for a missing id without changing anything', async () => {
    const { service } = setup();
    expect(await service.update('r-1', { name: 'Novo' })).toEqual({ ...seed[0], name: 'Novo' });
    await expect(service.update('nope', { name: 'x' })).rejects.toThrow('Registro nope não encontrado');
    expect(await service.list()).toHaveLength(1);
  });

  it('removes, idempotently', async () => {
    const { service } = setup();
    await service.remove('r-1');
    await service.remove('r-1');
    expect(await service.list()).toEqual([]);
  });
});
