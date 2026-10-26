import { siteContentSeed } from '@/mocks/siteContent';
import { getSiteContent } from '@/services/content.service';
import { resetDb } from '@/services/mock/db';
import { cookieJar } from '@/test/cookieJar';
import { signInAs } from '@/test/session';
import { deleteBanner, resetContent, saveBanner, saveFaq, saveHero, setBannerActive } from './contentActions';

const banner = {
  title: 'Novo',
  subtitle: '',
  ctaLabel: '',
  ctaHref: '',
  imageUrl: '/x.webp',
  imageUrlTablet: '',
  imageUrlMobile: '',
  position: 9,
  active: true,
  scheduled: false,
  startDate: '2026-01-01',
  endDate: '',
  gaIntegrationId: '',
};

beforeEach(() => {
  resetDb();
  cookieJar.clear();
  signInAs('usr-0');
});

describe('content actions', () => {
  it('saves the hero and resets to the seed', async () => {
    await saveHero({ ...siteContentSeed.hero, title: 'Outro', heroImageUrl: '', heroVideoUrl: '' });
    expect((await getSiteContent()).hero.title).toBe('Outro');
    await resetContent();
    expect((await getSiteContent()).hero).toEqual(siteContentSeed.hero);
  });

  it('refuses FAQ items without a question', async () => {
    expect((await saveFaq([{ question: ' ', answer: 'x' }])).ok).toBe(false);
  });

  it('adds a banner, ignoring the period when not scheduled', async () => {
    await saveBanner(null, banner);
    const added = (await getSiteContent()).banners.find((b) => b.title === 'Novo')!;
    expect(added).toMatchObject({ startDate: null, endDate: null, imageUrlDesktop: '/x.webp' });
  });

  it('keeps the period when scheduled and checks its order', async () => {
    expect(
      (await saveBanner(null, { ...banner, scheduled: true, startDate: '2026-02-01', endDate: '2026-01-01' })).ok,
    ).toBe(false);
    await saveBanner(null, { ...banner, scheduled: true, startDate: '2026-01-01', endDate: '2026-02-01' });
    expect((await getSiteContent()).banners.at(-1)).toMatchObject({ startDate: '2026-01-01', endDate: '2026-02-01' });
  });

  it('toggles and deletes banners', async () => {
    const first = siteContentSeed.banners[0]!;
    await setBannerActive(first.id, false);
    expect((await getSiteContent()).banners[0]!.active).toBe(false);
    await deleteBanner(first.id);
    expect((await getSiteContent()).banners.some((b) => b.id === first.id)).toBe(false);
  });
});
