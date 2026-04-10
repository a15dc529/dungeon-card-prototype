/**
 * ゲームの初期状態生成と、
 * プレイヤーターン開始処理・補充処理を担当する。
 */

import { GameState, CardInstance, GeneratedRecord } from "./types";
import { COST_MAX, HAND_MAX, COLS } from "./defs";
import { mulberry32, shuffle } from "./rng";

let nextInstanceId = 1;

/**
 * CardInstance を作るヘルパー関数。
 *
 * fixed card 用:
 * - defId だけを指定して通常カードを作る
 */

function makeInstance(defId: string): CardInstance {
  return {
    instanceId: nextInstanceId++,
    defId,
  };
}

/**
 * 生成カード用の CardInstance を作る。
 *
 * 保管済み GeneratedRecord を、
 * 今回の Run 用の山札カードへ変換する。
 */
function makeGeneratedInstance(record: GeneratedRecord): CardInstance {
  return {
    instanceId: nextInstanceId++,
    defId: record.card.defId,
    seed: record.seed,
    rolled: record.card.rolled,
  };
}
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
 * 引数:
 * - seed: 乱数用
 * - selectedGeneratedCard: Run開始前画面で選ばれた生成カード（あれば）
 *
 * 仕様:
 * - 基本デッキ10枚
 * - 選択カードがあれば +1枚して 11枚スタート
 */

export function newRun(
  seed = Date.now(),
  selectedGeneratedCard: GeneratedRecord | null = null,
): GameState {
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

  /**
   * Run開始前で選んだ生成カードがある場合、
   * 初期デッキへ1枚追加する。
   */
  if (selectedGeneratedCard) {
    baseDeck.push(makeGeneratedInstance(selectedGeneratedCard));
  }

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
