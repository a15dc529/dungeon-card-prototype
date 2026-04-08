/**
 * 固定値と固定カード定義。
 *
 * 本来は JSON 化してもよいが、
 * 今回はプロトタイプなので TypeScript に直書きする。
 */

import { CardDef, KeywordDef } from "./types";

export const COST_MAX = 5;
export const HAND_MAX = 5;
export const COLS = 4;

export const CARD_DEFS: Record<string, CardDef> = {
  char_basic: {
    id: "char_basic",
    name: "基本キャラ",
    type: "character",
    cost: 2,
    atk: 3,
    def: 1,
    postEnemyAttack: "discard",
  },
  char_guard: {
    id: "char_guard",
    name: "守備キャラ",
    type: "character",
    cost: 1,
    atk: 1,
    def: 3,
    postEnemyAttack: "discard",
  },
  char_attacker: {
    id: "char_attacker",
    name: "攻撃キャラ",
    type: "character",
    cost: 3,
    atk: 5,
    def: 0,
    postEnemyAttack: "discard",
  },
};

export const KEYWORD_DEFS: KeywordDef[] = [
  {
    id: "kw_water",
    displayName: "水属性",
    promptTags: ["water magic", "blue aura"],
    gameTags: {
      element: "water",
    },
  },
  {
    id: "kw_knight",
    displayName: "騎士",
    promptTags: ["knight armor", "fantasy warrior"],
    gameTags: {
      role: "knight",
    },
  },
  {
    id: "kw_gothic",
    displayName: "ゴシック",
    promptTags: ["gothic dress", "dark ornament"],
    gameTags: {
      style: "gothic",
    },
  },
];

export function getDef(id: string): CardDef {
  const found = CARD_DEFS[id];
  if (!found) {
    throw new Error(`Unknown card def: ${id}`);
  }
  return found;
}
