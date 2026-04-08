/**
 * seed つき乱数。
 *
 * 後で生成カードの再現性を持たせたいので、
 * 最初から seed ベースで作っておく。
 */

export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(rng: () => number, min: number, maxInclusive: number) {
  return Math.floor(rng() * (maxInclusive - min + 1)) + min;
}

export function shuffle<T>(items: T[], rng: () => number) {
  const copied = items.slice();

  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }

  return copied;
}
