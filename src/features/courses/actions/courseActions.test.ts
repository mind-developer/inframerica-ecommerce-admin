import { coursesSeed } from '@/mocks/courses';
import { coursesService } from '@/services/courses.service';
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

  it('drops the default location of an online course (#56)', async () => {
    const course = coursesSeed.find((c) => c.modality === 'online')!;
    const values = { ...toCourseValues(course), defaultLocation: 'Sala antiga' };
    expect((await saveCourse(course.id, values)).ok).toBe(true);
    expect((await coursesService.get(course.id))?.defaultLocation).toBeUndefined();
    await saveCourse(course.id, { ...values, modality: 'hybrid' });
    expect((await coursesService.get(course.id))?.defaultLocation).toBe('Sala antiga');
  });

  it('takes an image path of the site or an http(s) address (#56)', async () => {
    const values = toCourseValues(coursesSeed[0]!);
    for (const imageUrl of ['/images/x.webp', 'https://cdn.exemplo.com/x.png', ''])
      expect((await saveCourse(coursesSeed[0]!.id, { ...values, imageUrl })).ok).toBe(true);
    expect((await saveCourse(coursesSeed[0]!.id, { ...values, imageUrl: '//outro.com/x.png' })).ok).toBe(false);
    expect(await saveCourse(coursesSeed[0]!.id, { ...values, imageUrl: 'imagem.png' })).toEqual({
      ok: false,
      error: 'Use um caminho do site (/images/…) ou um endereço http(s)',
    });
  });

  it('drops blank list items and blank lessons (#57)', async () => {
    const course = coursesSeed[0]!;
    const r = await saveCourse(course.id, {
      ...toCourseValues(course),
      learningPoints: ['  A  ', '', '   '],
      targetAudience: [' '],
      prerequisites: ['B'],
      curriculum: [
        {
          title: ' M1 ',
          lessons: [
            { title: ' L1 ', duration: ' 1h ', free: true },
            { title: ' ', duration: '' },
          ],
        },
        { title: '', lessons: [{ title: '', duration: ' ' }] },
      ],
    });
    expect(r.ok).toBe(true);
    expect(await coursesService.get(course.id)).toMatchObject({
      learningPoints: ['A'],
      targetAudience: [],
      prerequisites: ['B'],
      curriculum: [{ title: 'M1', lessons: [{ title: 'L1', duration: '1h', free: true }] }],
      modules: 1,
    });
  });

  it('names the module or lesson that has content but no title (#57)', async () => {
    const values = toCourseValues(coursesSeed[0]!);
    expect(
      await saveCourse(coursesSeed[0]!.id, {
        ...values,
        curriculum: [{ title: '', lessons: [{ title: 'L', duration: '' }] }],
      }),
    ).toEqual({
      ok: false,
      error: 'Informe o título do módulo 1',
    });
    expect(
      await saveCourse(coursesSeed[0]!.id, {
        ...values,
        curriculum: [
          {
            title: 'M',
            lessons: [
              { title: 'L', duration: '' },
              { title: '', duration: '30m' },
            ],
          },
        ],
      }),
    ).toEqual({ ok: false, error: 'Informe o título da aula 2 do módulo 1' });
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
