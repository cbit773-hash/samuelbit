const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWER = 'abcdefghijkmnopqrstuvwxyz';
const DIGITS = '23456789';
const SPECIAL = '#$%&*!';

function pick(chars: string): string {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return chars[arr[0] % chars.length];
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const j = arr[0] % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function generateSecurePassword(length = 12): string {
  const len = Math.max(8, length);
  const required = [pick(UPPER), pick(LOWER), pick(DIGITS), pick(SPECIAL)];
  const pool = UPPER + LOWER + DIGITS + SPECIAL;
  while (required.length < len) {
    required.push(pick(pool));
  }
  return shuffle(required).join('');
}
