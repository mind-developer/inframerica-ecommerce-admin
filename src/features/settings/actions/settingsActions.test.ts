import { getOrderSettings, getStoreSettings } from '@/services/content.service';
import { resetDb } from '@/services/mock/db';
import * as storefront from '@/services/storefront.service';
import { cookieJar } from '@/test/cookieJar';
import { signInAs } from '@/test/session';
import { regenerateBiToken, saveAutoCancelDays, saveStoreSettings } from './settingsActions';

beforeEach(() => {
  resetDb();
  cookieJar.clear();
  signInAs('usr-0');
});

describe('settings actions', () => {
  it('closes the store and tells the storefront', async () => {
    const notify = vi.spyOn(storefront, 'notifyStorefront').mockResolvedValue(true);
    expect((await saveStoreSettings({ storeClosed: true })).ok).toBe(true);
    expect((await getStoreSettings()).storeClosed).toBe(true);
    expect(notify).toHaveBeenCalledWith(['store-settings']);
  });

  it('rejects an empty maintenance message', async () => {
    expect(await saveStoreSettings({ message: ' ' })).toEqual({
      ok: false,
      error: 'Informe a mensagem da tela de manutenção',
    });
  });

  it('saves the auto-cancel days (at least 1) and regenerates the BI token', async () => {
    expect((await saveAutoCancelDays(0)).ok).toBe(false);
    await saveAutoCancelDays(10);
    const before = (await getOrderSettings()).biToken;
    await regenerateBiToken();
    expect(await getOrderSettings()).toMatchObject({ autoCancelDays: 10 });
    expect((await getOrderSettings()).biToken).not.toBe(before);
    expect((await getOrderSettings()).biToken).toMatch(/^sk_live_bi_[0-9a-f]{24}$/);
  });
});
