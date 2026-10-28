// In-memory abuse guards. State lives in this Node process only: it resets on every
// deploy and is not shared between instances. Fine for a single Render web service.

const MAX_TRACKED = 500;

const windows = new Map<string, { count: number; resetAt: number }>();
const usedLinks = new Map<string, number>();

function sweep(now: number) {
  for (const [k, v] of windows) if (v.resetAt <= now) windows.delete(k);
  for (const [k, expiresAt] of usedLinks) if (expiresAt <= now) usedLinks.delete(k);
}

/** Fixed-window rate limit. Returns true while the caller is still under `limit`. */
export function allow(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  if (windows.size + usedLinks.size > MAX_TRACKED) sweep(now);
  const w = windows.get(key);
  if (!w || w.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (w.count >= limit) return false;
  w.count += 1;
  return true;
}

/** Best-effort single use for sign-in links. Returns false if `id` was already used. */
export function consumeOnce(id: string, expiresAtMs: number, now = Date.now()): boolean {
  if (windows.size + usedLinks.size > MAX_TRACKED) sweep(now);
  const seen = usedLinks.get(id);
  if (seen !== undefined && seen > now) return false;
  usedLinks.set(id, expiresAtMs);
  return true;
}
