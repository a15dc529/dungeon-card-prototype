/**
 * ゲームの初期状態生成と、
 * プレイヤーターン開始処理・補充処理を担当する。
 */

import { GameState, CardInstance } from "./types";
import { COST_MAX, HAND_MAX, COLS } from "./defs";
import { mulberry32, shuffle } from "./rng";

let nextInstanceId = 1;

/**
 * CardInstance を作るヘルパー関数。
 * 同じ定義のカードでも instanceId を分けることで個体として扱える。
 */
function makeInstance(defId: string): CardInstance {
  return {
    instanceId: nextInstanceId++,
    defId,
  };
}

/**
 * runId や turn から簡易的な seed を作る。
 */
function hashSeed(a: number, b: number, c: number) {
  let x = (a * 73856093) ^ (b * 19349663) ^ (c * 83492791);
  x >>>= 0;
  return x;
}

/**
 * 手札が5枚未満なら5枚になるまで補充する。
 *
 * ルール:
 * - 山札があれば引く
 * - 山札が0ならそのターンは補充できない
 */
export function refillHandToMax(state: GameState): GameState {
  if (state.hand.length >= HAND_MAX) return state;
  if (state.drawPile.length === 0) return state;

  const need = HAND_MAX - state.hand.length;
  const drawCards = state.drawPile.slice(0, need);
  const rest = state.drawPile.slice(need);

  return {
    ...state,
    hand: [...state.hand, ...drawCards],
    drawPile: rest,
  };
}

/**
 * プレイヤーターン開始。
 *
 * 順番:
 * 1. 山札0 & 捨て札ありならリロード
 * 2. コストを最大まで回復
 * 3. 手札を5まで補充
 */
export function startPlayerTurn(state: GameState): GameState {
  let next = { ...state };

  if (next.drawPile.length === 0 && next.discardPile.length > 0) {
    const rng = mulberry32(hashSeed(next.runId, next.turn, 999));

    next = {
      ...next,
      drawPile: shuffle([...next.discardPile], rng),
      discardPile: [],
    };
  }

  next = {
    ...next,
    cost: next.costMax,
  };

  next = refillHandToMax(next);

  return next;
}

/**
 * 新しい Run を開始する。
 *
 * この段階では:
 * - 初期デッキ10枚固定
 * - 敵HPは仮固定
 * - enemyIntent も仮固定
 */
export function newRun(seed = Date.now()): GameState {
  const rng = mulberry32(seed);

  const baseDeck = [
    makeInstance("char_basic"),
    makeInstance("char_basic"),
    makeInstance("char_basic"),
    makeInstance("char_basic"),
    makeInstance("char_guard"),
    makeInstance("char_guard"),
    makeInstance("char_guard"),
    makeInstance("char_attacker"),
    makeInstance("char_attacker"),
    makeInstance("char_attacker"),
  ];

  const drawPile = shuffle(baseDeck, rng);

  const initialState: GameState = {
    runId: Math.floor(rng() * 1_000_000_000),
    turn: 1,
    costMax: COST_MAX,
    cost: COST_MAX,
    drawPile,
    hand: [],
    discardPile: [],
    exhaustPile: [],
    fieldPlayer: Array.from({ length: COLS }, () => null),
    enemyHp: [6, 5, 7, 4],
    enemyIntent: {
      damageByCol: [2, 1, 3, 2],
    },
    playerHp: 20,
    effects: {
      battleLong: [],
      timed1: [],
    },
    collection: [],
  };

  return startPlayerTurn(initialState);
}
