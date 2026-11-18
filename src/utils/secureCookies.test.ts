import { describe, expect, it } from 'vitest';
import { secureCookies } from './secureCookies';

describe('secureCookies', () => {
  it('follows the environment unless COOKIE_SECURE says otherwise', () => {
    expect(secureCookies({ NODE_ENV: 'production' })).toBe(true);
    expect(secureCookies({ NODE_ENV: 'development' })).toBe(false);
    expect(secureCookies({ NODE_ENV: 'production', COOKIE_SECURE: 'false' })).toBe(false);
    expect(secureCookies({ NODE_ENV: 'development', COOKIE_SECURE: 'true' })).toBe(true);
  });
});
