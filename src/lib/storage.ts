/**
 * localStorage の補助関数。
 *
 * 今回は API を使わないので、
 * 保管カード一覧や、今回のRun開始時に使う選択カード情報を
 * localStorage に保存して扱う。
 */

import { GeneratedRecord } from "@/game/types";
import { mockCollection } from "@/game/mock";

/**
 * 保管カード一覧の保存キー
 */
const COLLECTION_KEY = "dungeon-card-collection";

/**
 * 今回の Run で使う「選択済み生成カードseed」の保存キー
 *
 * ここにはカード本体全部ではなく、
 * 「どのカードを今回使うか」を識別できる seed を保存する。
 */
const RUN_SELECTED_CARD_SEED_KEY = "dungeon-card-run-selected-seed";

/**
 * 保管カード一覧を読む
 *
 * - ブラウザ環境でなければモックを返す
 * - 保存がなければモックを返す
 * - JSONが壊れていてもモックを返す
 */
export function loadCollection(): GeneratedRecord[] {
  if (typeof window === "undefined") return mockCollection;

  const raw = window.localStorage.getItem(COLLECTION_KEY);
  if (!raw) {
    return mockCollection;
  }

  try {
    return JSON.parse(raw) as GeneratedRecord[];
  } catch {
    return mockCollection;
  }
}

/**
 * 保管カード一覧を保存する
 */
export function saveCollection(collection: GeneratedRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
}

/**
 * 今回のRunで使うカードseedを保存する
 *
 * null を渡した場合は「選択なし」として保存を消す
 */
export function saveRunSelectedCardSeed(seed: number | null) {
  if (typeof window === "undefined") return;

  if (seed === null) {
    window.localStorage.removeItem(RUN_SELECTED_CARD_SEED_KEY);
    return;
  }

  window.localStorage.setItem(RUN_SELECTED_CARD_SEED_KEY, String(seed));
}

/**
 * 今回のRunで使うカードseedを読み込む
 *
 * 保存がなければ null
 */
export function loadRunSelectedCardSeed(): number | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(RUN_SELECTED_CARD_SEED_KEY);
  if (!raw) return null;

  const parsed = Number(raw);
  if (Number.isNaN(parsed)) return null;

  return parsed;
}

/**
 * 今回のRun用に選ばれた生成カードそのものを取得する
 *
 * 流れ:
 * - seed を読む
 * - 保管一覧から一致するものを探す
 * - 見つかれば返す
 * - 無ければ null
 */
export function loadRunSelectedCard(): GeneratedRecord | null {
  const seed = loadRunSelectedCardSeed();
  if (seed === null) return null;

  const collection = loadCollection();
  const found = collection.find((item) => item.seed === seed);

  return found ?? null;
}

/**
 * Run設定をクリアする
 *
 * 例:
 * - Run終了後
 * - 選択し直したい時
 */
export function clearRunSelection() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(RUN_SELECTED_CARD_SEED_KEY);
}
