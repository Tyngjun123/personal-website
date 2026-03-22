// src/lib/auth.ts
// HMAC-SHA256 session token — no external packages, Web Crypto API only

export const SESSION_COOKIE = 'admin_session';
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 8, // 8 hours
};

const TTL_MS = 8 * 60 * 60 * 1000;

let _key: CryptoKey | null = null;

async function getKey(): Promise<CryptoKey> {
  if (_key) return _key;
  const secret = process.env.ADMIN_SECRET ?? 'dev-secret-change-me';
  _key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  return _key;
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createToken(username: string): Promise<string> {
  const key = await getKey();
  const payload = `${username}:${Date.now()}`;
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return `${payload}.${toHex(sig)}`;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const lastDot = token.lastIndexOf('.');
    if (lastDot === -1) return false;
    const payload = token.slice(0, lastDot);
    const sigHex = token.slice(lastDot + 1);

    // Check TTL
    const ts = Number(payload.split(':')[1]);
    if (!ts || Date.now() - ts > TTL_MS) return false;

    // Re-sign and compare
    const key = await getKey();
    const expected = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    const expectedHex = toHex(expected);

    // Constant-time compare
    if (sigHex.length !== expectedHex.length) return false;
    let diff = 0;
    for (let i = 0; i < sigHex.length; i++) {
      diff |= sigHex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}
