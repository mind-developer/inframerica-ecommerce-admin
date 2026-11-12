import { coursesSeed } from '@/mocks/courses';
import { coursesService } from '@/services/catalog.service';
import { resetDb } from '@/services/mock/db';
import { cookieJar } from '@/test/cookieJar';
import { findCurrentAdmin } from '@/services/adminAuth.service';
import { ownerSession, signInAs } from '@/test/session';
import { emptyCourse, toCourseValues } from '../schemas/courseSchema';
import { deleteCourse, saveCourse } from './courseActions';

beforeEach(() => {
  resetDb();
  cookieJar.clear();
  signInAs('usr-0');
});

describe('saveCourse', () => {
  it('derives the slug from the title and the module count from the curriculum', async () => {
    const r = await saveCourse(null, {
      ...emptyCourse,
      title: 'Novo Curso Ágil',
      sectorId: 'set-avsec',
      modules: 9,
      curriculum: [
        { title: 'M1', lessons: [] },
        { title: 'M2', lessons: [] },
      ],
    });
    expect(r.ok).toBe(true);
    const saved = await coursesService.get(r.ok ? r.data.id : '');
    expect(saved).toMatchObject({ slug: 'novo-curso-agil', modules: 2 });
  });

  it('requires a title and a sector, and a unique slug', async () => {
    expect(await saveCourse(null, { ...emptyCourse, sectorId: 'set-avsec' })).toEqual({
      ok: false,
      error: 'Informe o título do curso',
    });
    expect(await saveCourse(null, { ...emptyCourse, title: 'X' })).toEqual({
      ok: false,
      error: 'Selecione o setor do curso',
    });
    expect(
      await saveCourse(null, { ...emptyCourse, title: 'Y', sectorId: 'set-avsec', slug: 'conscientizacao-avsec' }),
    ).toEqual({ ok: false, error: 'Já existe um curso com este endereço (slug)' });
  });

  it('edits an existing course keeping its own slug', async () => {
    const course = coursesSeed[0]!;
    expect((await saveCourse(course.id, { ...toCourseValues(course), price: 199 })).ok).toBe(true);
    expect((await coursesService.get(course.id))?.price).toBe(199);
  });
});

describe('an admin limited to one sector (#49)', () => {
  const avsec = coursesSeed.find((c) => c.sectorId === 'set-avsec')!;
  const other = coursesSeed.find((c) => c.sectorId !== 'set-avsec')!;
  const denied = { ok: false, error: 'Este curso é de outro setor.' };

  beforeEach(() => {
    vi.mocked(findCurrentAdmin).mockResolvedValue({ ...ownerSession, owner: false, sectorId: 'set-avsec' });
  });
  afterEach(() => vi.mocked(findCurrentAdmin).mockResolvedValue(ownerSession));

  it('edits courses of their sector only, and cannot move one away', async () => {
    expect((await saveCourse(avsec.id, toCourseValues(avsec))).ok).toBe(true);
    expect(await saveCourse(other.id, toCourseValues(other))).toEqual(denied);
    expect(await saveCourse(avsec.id, { ...toCourseValues(avsec), sectorId: other.sectorId })).toEqual(denied);
    expect(await saveCourse(null, { ...emptyCourse, title: 'Fora', sectorId: other.sectorId })).toEqual(denied);
  });

  it('removes courses of their sector only', async () => {
    expect(await deleteCourse(other.id)).toEqual(denied);
    expect(await coursesService.get(other.id)).not.toBeNull();
    expect((await deleteCourse(avsec.id)).ok).toBe(true);
  });
});
