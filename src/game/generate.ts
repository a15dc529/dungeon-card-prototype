/**
 * 生成カードの簡易ロジック。
 *
 * API なし版なので、
 * キーワードと seed から仮の能力を決めるだけにする。
 */

import { GeneratedRecord, KeywordDef, Rarity } from "./types";
import { randInt, mulberry32 } from "./rng";

/**
 * rarity を簡易抽選する。
 * 本番では確率テーブルをもっときちんと持つ。
 */
export function rollRarity(seed: number): Rarity {
  const rng = mulberry32(seed);
  const value = rng();

  if (value < 0.7) return "N";
  if (value < 0.95) return "R";
  if (value < 0.995) return "SR";
  return "SSR";
}

/**
 * rarity に応じて基礎値を決める。
 */
function getBasePower(rarity: Rarity) {
  switch (rarity) {
    case "N":
      return { atkMin: 2, atkMax: 4, defMin: 0, defMax: 2 };
    case "R":
      return { atkMin: 4, atkMax: 5, defMin: 1, defMax: 3 };
    case "SR":
      return { atkMin: 5, atkMax: 7, defMin: 2, defMax: 4 };
    case "SSR":
      return { atkMin: 7, atkMax: 9, defMin: 3, defMax: 5 };
  }
}

/**
 * キーワード選択から簡易生成カードを作る。
 *
 * 今回は画像生成はしない。
 * 代わりに seed / rarity / atk / def を決めて返す。
 */
export function createGeneratedCard(
  keywordIds: string[],
  seed: number,
): GeneratedRecord {
  const rarity = rollRarity(seed);
  const power = getBasePower(rarity);
  const rng = mulberry32(seed);

  const atk = randInt(rng, power.atkMin, power.atkMax);
  const def = randInt(rng, power.defMin, power.defMax);

  return {
    seed,
    rarity,
    keywordIds,
    card: {
      instanceId: seed,
      defId: "char_basic",
      seed,
      rolled: {
        atk,
        def,
        rarity,
      },
    },
  };
}
