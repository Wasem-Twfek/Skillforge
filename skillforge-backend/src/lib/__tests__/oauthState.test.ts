/// <reference types="jest" />

import {
  generateState,
  getStateCookie,
  statesMatch,
  escapeForInlineScript,
} from '../oauthState';

describe('generateState', () => {
  it('produces a 64-char hex string', () => {
    const state = generateState();
    expect(state).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces unique values', () => {
    const values = new Set([generateState(), generateState(), generateState()]);
    expect(values.size).toBe(3);
  });
});

describe('getStateCookie', () => {
  const valid = generateState();

  it('extracts the state from a Cookie header', () => {
    expect(getStateCookie(`other=1; oauth_state=${valid}; x=y`)).toBe(valid);
  });

  it('returns undefined when the header is missing', () => {
    expect(getStateCookie(undefined)).toBeUndefined();
  });

  it('returns undefined when the cookie is absent', () => {
    expect(getStateCookie('other=1; x=y')).toBeUndefined();
  });

  it('rejects non-hex or wrong-length values', () => {
    expect(getStateCookie('oauth_state=short')).toBeUndefined();
    expect(getStateCookie('oauth_state=</script>')).toBeUndefined();
    expect(getStateCookie('oauth_state=')).toBeUndefined();
  });
});

describe('statesMatch', () => {
  const expected = generateState();

  it('accepts identical states', () => {
    expect(statesMatch(expected, expected)).toBe(true);
  });

  it('rejects a wrong state', () => {
    expect(statesMatch(expected, generateState())).toBe(false);
  });

  it('rejects missing or non-string inputs', () => {
    expect(statesMatch(undefined, expected)).toBe(false);
    expect(statesMatch(expected, undefined)).toBe(false);
    expect(statesMatch(expected, 42)).toBe(false);
    expect(statesMatch(expected, '')).toBe(false);
  });

  it('rejects malformed values even when equal', () => {
    expect(statesMatch('not-hex-at-all', 'not-hex-at-all')).toBe(false);
  });
});

describe('escapeForInlineScript', () => {
  it('leaves a well-formed JWT-shaped token untouched', () => {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEyMyJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    expect(escapeForInlineScript(token)).toBe(token);
  });

  it('neutralizes script breakout payloads', () => {
    const payload = `x';</ScRiPt><script>alert(1)</script>`;
    const escaped = escapeForInlineScript(payload);
    expect(escaped).not.toContain('</script');
    expect(escaped).not.toContain('</ScRiPt');
    // No unescaped single quote may remain (every ' must follow a backslash).
    expect(escaped.match(/(?<!\\)'/)).toBeNull();
    expect(escaped).toContain("\\'");
  });
});
