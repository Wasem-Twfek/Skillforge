import crypto from 'crypto';

// Helpers for the Google OAuth CSRF `state` round-trip (see ADR-003).
// The state travels out in the Google redirect URL and comes back twice:
// once as a query parameter and once as the `oauth_state` cookie set in
// GET /auth/google. The callback accepts the exchange only when both are
// present, well-formed, and byte-identical. No session/Redis store is used;
// single-use is enforced by clearing the cookie during verification.

export const OAUTH_STATE_COOKIE = 'oauth_state';

// 256-bit unpredictable state, hex-encoded (safe for cookies and URLs).
export function generateState(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Minimal `Cookie`-header parser. The backend has no cookie-parser
// dependency on purpose; the state value is hex so it never contains
// separators, which keeps this exact. Returns undefined when absent.
export function getStateCookie(cookieHeader: string | undefined): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(';')) {
    const index = part.indexOf('=');
    if (index === -1) continue;
    const name = part.slice(0, index).trim();
    if (name !== OAUTH_STATE_COOKIE) continue;
    const value = part.slice(index + 1).trim();
    if (!/^[0-9a-f]{64}$/.test(value)) return undefined;
    return value;
  }
  return undefined;
}

// Constant-time comparison that fails closed on type/length mismatch.
export function statesMatch(expected: string | undefined, actual: unknown): boolean {
  if (typeof expected !== 'string' || typeof actual !== 'string') return false;
  if (!/^[0-9a-f]{64}$/.test(expected) || !/^[0-9a-f]{64}$/.test(actual)) return false;
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(actual, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Escape a string for embedding inside a single-quoted JS string in inline
// HTML. Used by GET /auth/callback, which renders the token into a
// <script> block: without this, a crafted `token` query value breaks out
// of the string (reflected XSS). Escapes backslashes, quotes, line
// separators, and the `</script` sequence (case-insensitive).
export function escapeForInlineScript(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/`/g, '\\`')
    .replace(/</g, '\\x3c')
    .replace(/>/g, '\\x3e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
