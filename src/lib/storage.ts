/**
 * localStorage の補助関数。
 *
 * 今回は API を使わないので、
 * 保管カード一覧などは localStorage に保存して確認できるようにする。
 */

import { GeneratedRecord } from "@/game/types";
import { mockCollection } from "@/game/mock";

const COLLECTION_KEY = "dungeon-card-collection";

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

export function saveCollection(collection: GeneratedRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
}
