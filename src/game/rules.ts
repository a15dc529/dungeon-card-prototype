/**
 * ゲームの主要ルール処理。
 *
 * ここに UI 依存を書かず、
 * 「state を受けて state を返す」純粋関数寄りにしておくと
 * 後で Godot に移植しやすい。
 */

import { GameState, CardInstance } from "./types";
import { COLS, HAND_MAX, getDef } from "./defs";
import { startPlayerTurn } from "./state";

/**
 * 補充ボタンを押せるかどうか。
 *
 * 条件:
 * - 手札が5未満
 * - 山札が1枚以上ある
 */
export function canRefill(state: GameState) {
  return state.hand.length < HAND_MAX && state.drawPile.length > 0;
}

/**
 * カード個体から攻撃力を取得する。
 * 生成カードなら rolled.atk を優先。
 */
function getAtk(card: CardInstance): number {
  const def = getDef(card.defId);
  return card.rolled?.atk ?? def.atk ?? 0;
}

/**
 * カード個体から防御力を取得する。
 * 生成カードなら rolled.def を優先。
 */
function getDefValue(card: CardInstance): number {
  const def = getDef(card.defId);
  return card.rolled?.def ?? def.def ?? 0;
}

/**
 * 手札からキャラカードを指定列に配置する。
 *
 * B案:
 * - 既にカードがある列にも配置可能
 * - その場合は入れ替え
 * - 追い出されたカードは discard / exhaust に移動
 */
export function placeCharacterFromHand(
  state: GameState,
  handIndex: number,
  col: number,
): GameState {
  if (handIndex < 0 || handIndex >= state.hand.length) return state;
  if (col < 0 || col >= COLS) return state;

  const selectedCard = state.hand[handIndex];
  const def = getDef(selectedCard.defId);

  if (def.type !== "character") return state;
  if (def.cost > state.cost) return state;

  let next = {
    ...state,
    cost: state.cost - def.cost,
  };

  const nextHand = next.hand.slice();
  nextHand.splice(handIndex, 1);

  const nextField = next.fieldPlayer.slice();
  const kicked = nextField[col];

  if (kicked) {
    const kickedDef = getDef(kicked.defId);
    const post = kickedDef.postEnemyAttack ?? "discard";

    if (post === "exhaust") {
      next = {
        ...next,
        exhaustPile: [...next.exhaustPile, kicked],
      };
    } else {
      next = {
        ...next,
        discardPile: [...next.discardPile, kicked],
      };
    }
  }

  nextField[col] = selectedCard;

  return {
    ...next,
    hand: nextHand,
    fieldPlayer: nextField,
  };
}

/**
 * ターン終了処理。
 *
 * 流れ:
 * 1. プレイヤー側のキャラが攻撃
 * 2. 敵全滅なら勝利
 * 3. 敵が Intent に従って攻撃
 * 4. 対象列のキャラは基本退場
 * 5. timed1 効果を消す
 * 6. 次ターン開始
 */
export function endTurn(state: GameState): GameState {
  let enemyHp = state.enemyHp.slice();

  /**
   * まずプレイヤー攻撃。
   * 今回は簡易版として「同じ列の敵を攻撃」。
   * 後で任意ターゲットに拡張できる。
   */
  for (let col = 0; col < COLS; col++) {
    const playerCard = state.fieldPlayer[col];
    if (!playerCard) continue;
    if (enemyHp[col] <= 0) continue;

    const atk = getAtk(playerCard);
    enemyHp[col] = Math.max(0, enemyHp[col] - atk);
  }

  /**
   * 敵が全滅したらこの時点で勝利。
   * 次ターンに進まずそのまま返す。
   */
  const isVictory = enemyHp.every((hp) => hp <= 0);
  if (isVictory) {
    return {
      ...state,
      enemyHp,
    };
  }

  let playerHp = state.playerHp;
  const nextField = state.fieldPlayer.slice();
  let discardPile = state.discardPile.slice();
  let exhaustPile = state.exhaustPile.slice();

  /**
   * 敵攻撃処理。
   *
   * ルール:
   * - その列にキャラがいれば、防御で軽減
   * - その列にキャラがいなければダイレクトダメージ
   * - 攻撃を受けた列のキャラは基本退場
   */
  for (let col = 0; col < COLS; col++) {
    if (enemyHp[col] <= 0) continue;
    // この列の敵がすでに倒れていたら攻撃しない

    const damage = state.enemyIntent.damageByCol[col] ?? 0;
    if (enemyHp[col] <= 0) continue;

    const playerCard = nextField[col];

    if (playerCard) {
      const defense = getDefValue(playerCard);
      const actualDamage = Math.max(0, damage - defense);
      playerHp -= actualDamage;

      const post = getDef(playerCard.defId).postEnemyAttack ?? "discard";

      if (post === "stay") {
        // stay の場合はそのまま盤面に残す
      } else if (post === "exhaust") {
        exhaustPile.push(playerCard);
        nextField[col] = null;
      } else {
        discardPile.push(playerCard);
        nextField[col] = null;
      }
    } else {
      playerHp -= damage;
    }
  }

  /**
   * 敵ターン終了時に timed1 効果を消す。
   */
  const nextState: GameState = {
    ...state,
    turn: state.turn + 1,
    enemyHp,
    playerHp,
    fieldPlayer: nextField,
    discardPile,
    exhaustPile,
    effects: {
      ...state.effects,
      timed1: [],
    },
  };

  return startPlayerTurn(nextState);
}
