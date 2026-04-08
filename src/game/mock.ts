/**
 * ローカルデータのモック。
 *
 * 今回は API を使わないので、
 * 画面確認用の固定データをここに置く。
 */

import { GeneratedRecord } from "./types";

export const mockCollection: GeneratedRecord[] = [
  {
    seed: 1001,
    rarity: "R",
    keywordIds: ["kw_water", "kw_knight"],
    card: {
      instanceId: 9001,
      defId: "char_basic",
      rolled: {
        atk: 4,
        def: 2,
        rarity: "R",
      },
    },
  },
  {
    seed: 1002,
    rarity: "SR",
    keywordIds: ["kw_gothic", "kw_water"],
    card: {
      instanceId: 9002,
      defId: "char_basic",
      rolled: {
        atk: 6,
        def: 2,
        rarity: "SR",
      },
    },
  },
];
