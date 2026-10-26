import { siteContentSeed } from '@/mocks/siteContent';
import { getSiteContent, resetSiteContent, updateSiteContent } from './content.service';
import { resetDb } from './mock/db';

beforeEach(() => resetDb());

describe('site content', () => {
  it('starts from the seed', async () => {
    expect(await getSiteContent()).toEqual(siteContentSeed);
  });

  it('merges hero and contact field by field, keeping the rest', async () => {
    const r = await updateSiteContent({ hero: { title: 'Novo' } as never, contact: { phone: '1' } as never });
    expect(r.hero).toEqual({ ...siteContentSeed.hero, title: 'Novo' });
    expect(r.contact).toEqual({ ...siteContentSeed.contact, phone: '1' });
    expect(r.banners).toEqual(siteContentSeed.banners);
    expect(r.updatedAt).not.toBe(siteContentSeed.updatedAt);
    expect((await getSiteContent()).hero.title).toBe('Novo');
  });

  it('replaces banners only when given, and resets back to the seed', async () => {
    expect((await updateSiteContent({ faq: [] })).banners).toEqual(siteContentSeed.banners);
    await updateSiteContent({ banners: [] });
    expect(await resetSiteContent()).toEqual(siteContentSeed);
  });
});
