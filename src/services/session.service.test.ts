import { signSession, verifySession } from './session.service';

describe('session token', () => {
  const now = Date.UTC(2026, 9, 19);

  it('round-trips a user id until it expires', () => {
    const token = signSession('usr-1', now + 1000);
    expect(verifySession(token, now)).toBe('usr-1');
    expect(verifySession(token, now + 2000)).toBeNull();
  });

  it('keeps user ids that contain dots', () => {
    expect(verifySession(signSession('a.b', now + 1000), now)).toBe('a.b');
  });

  it('rejects a tampered user id or signature, and missing tokens', () => {
    const token = signSession('usr-1', now + 1000);
    expect(verifySession(token.replace('usr-1', 'usr-2'), now)).toBeNull();
    expect(verifySession(`${token}x`, now)).toBeNull();
    expect(verifySession(undefined, now)).toBeNull();
    expect(verifySession('garbage', now)).toBeNull();
  });
});
