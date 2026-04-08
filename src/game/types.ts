/**
 * ゲーム全体で使う型定義。
 *
 * 先に型を固める理由:
 * - どのデータをどこで使うか分かりやすくなる
 * - バグが減る
 * - Godot移植時にも設計をそのまま使いやすい
 */

export type CardType = "character" | "effect" | "equip";
export type PostUse = "discard" | "exhaust";
export type PostEnemyAttack = "discard" | "exhaust" | "stay";
export type EffectKind = "battleLong" | "timed1";
export type Rarity = "N" | "R" | "SR" | "SSR";

export type Effect =
  | { kind: "battleLong"; id: string; value?: number }
  | { kind: "timed1"; id: string; value?: number };

export type CardDef = {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  atk?: number;
  def?: number;
  rarity?: Rarity;
  effects?: Effect[];
  postUse?: PostUse;
  postEnemyAttack?: PostEnemyAttack;
};

export type CardInstance = {
  instanceId: number;
  defId: string;
  seed?: number;
  rolled?: {
    atk?: number;
    def?: number;
    effects?: Effect[];
    rarity?: Rarity;
  };
};

export type EnemyIntent = {
  /**
   * 各列に対して次ターン何ダメージ飛ぶかを表す。
   * 例: [2, 1, 3, 0]
   */
  damageByCol: number[];
};

export type BattleEffects = {
  battleLong: Effect[];
  timed1: Effect[];
};

export type GeneratedRecord = {
  seed: number;
  rarity: Rarity;
  keywordIds: string[];
  card: CardInstance;
};

export type GameState = {
  runId: number;
  turn: number;

  costMax: number;
  cost: number;

  drawPile: CardInstance[];
  hand: CardInstance[];
  discardPile: CardInstance[];
  exhaustPile: CardInstance[];

  /**
   * プレイヤー側の4マス
   * null は空きマス
   */
  fieldPlayer: Array<CardInstance | null>;

  /**
   * 敵HPを列ごとに持つ
   * 敵がいないなら 0 でもよい
   */
  enemyHp: number[];

  enemyIntent: EnemyIntent;
  playerHp: number;
  effects: BattleEffects;

  /**
   * 保管済み生成カード
   */
  collection: GeneratedRecord[];
};

export type KeywordDef = {
  id: string;
  displayName: string;
  promptTags: string[];
  gameTags: {
    role?: string;
    element?: string;
    style?: string;
  };
};
