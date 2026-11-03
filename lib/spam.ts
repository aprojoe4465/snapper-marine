// Lightweight anti-spam checks for the booking form. Prefer false negatives.
const MIN_FILL_MS = 3000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
}

/** Best-effort in-memory rate limit (per serverless instance). */
export function rateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > RATE_MAX;
}

export function timingProblem(raw: string | undefined, now = Date.now()): string | null {
  const started = Number(raw);
  if (!raw || !Number.isFinite(started)) return "missing formStartedAt";
  if (started > now + 60_000) return "formStartedAt in future";
  if (now - started < MIN_FILL_MS) return "submitted too fast";
  if (now - started > MAX_FORM_AGE_MS) return "form too old";
  return null;
}

/** Looks like a random token, e.g. "vnKhpUrMRTVgKxQiNLHKWZ". */
export function looksRandom(value: string): boolean {
  const v = value.trim();
  if (v.length < 12) return false;
  const words = v.split(/\s+/);
  const longest = words.reduce((a, w) => (w.length > a.length ? w : a), "");
  if (/^[A-Za-z0-9]{16,}$/.test(v) && !/^\d+$/.test(v)) {
    // single long token: random if low vowel ratio or many case switches
    const vowels = (v.match(/[aeiouy]/gi) || []).length / v.length;
    const switches = (v.match(/[a-z][A-Z]/g) || []).length;
    if (vowels < 0.3 || switches >= 3) return true;
  }
  if (longest.length > 20) {
    const letters = longest.replace(/[^A-Za-z]/g, "");
    const vowels = (letters.match(/[aeiouy]/gi) || []).length;
    if (letters.length > 0 && vowels / letters.length < 0.2) return true;
    if ((longest.match(/[a-z][A-Z]/g) || []).length >= 4) return true;
  }
  if (/[bcdfghjklmnpqrstvwxz]{6,}/i.test(v.replace(/\s+/g, " ")) && words.length <= 2) return true;
  return false;
}

export function suspiciousEmail(email: string): boolean {
  const local = email.split("@")[0] || "";
  const dots = (local.match(/\./g) || []).length;
  if (local.length > 25 && dots >= 3) return true;
  if (dots >= 5) return true;
  if (/^[A-Za-z0-9]{20,}$/.test(local) && looksRandom(local)) return true;
  return false;
}

export function badPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length < 10 || digits.length > 11;
}

export function badPreferredDate(value: string, now = new Date()): boolean {
  if (!value) return false;
  const m = value.match(/^(\d{4})-\d{2}-\d{2}$/);
  if (!m) return true;
  const year = Number(m[1]);
  return year < 2020 || year > now.getFullYear() + 2;
}

export function contentSpamReason(f: {
  name: string; phone: string; email: string; boatType: string;
  locationDetail: string; problem: string; preferredDate: string;
}): string | null {
  if (badPreferredDate(f.preferredDate)) return "bad preferredDate";
  if (badPhone(f.phone)) return "bad phone";
  if (suspiciousEmail(f.email)) return "suspicious email";
  for (const key of ["name", "boatType", "locationDetail", "problem"] as const) {
    if (looksRandom(f[key])) return `random ${key}`;
  }
  return null;
}
