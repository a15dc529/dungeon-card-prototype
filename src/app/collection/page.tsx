"use client";

/**
 * 保管カード一覧画面。
 *
 * 見た目改善のポイント:
 * - カードを1枚のパネルとしてまとめる
 * - 削除ボタンをカードの内側下部へ配置する
 * - 一覧は flex ではなく grid で整列させる
 * - rarity をバッジ表示する
 * - keyword はタグ風に見せる
 */

import { useEffect, useState } from "react";
import ScreenContainer from "@/components/layout/ScreenContainer";
import SectionBox from "@/components/common/SectionBox";
import { GeneratedRecord, Rarity } from "@/game/types";
import { loadCollection, saveCollection } from "@/lib/storage";

/**
 * rarity ごとの見た目用クラス
 *
 * ロジックには影響せず、表示上の強弱だけをつける。
 */
function getRarityBadgeClass(rarity: Rarity) {
  switch (rarity) {
    case "N":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "R":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "SR":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "SSR":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export default function CollectionPage() {
  /**
   * 保管済み生成カード一覧
   */
  const [collection, setCollection] = useState<GeneratedRecord[]>([]);

  useEffect(() => {
    setCollection(loadCollection());
  }, []);

  /**
   * 削除処理
   *
   * 1. seed が一致しないカードだけ残す
   * 2. 画面状態を更新
   * 3. localStorage に保存
   */
  const handleDelete = (seed: number) => {
    const next = collection.filter((item) => item.seed !== seed);
    setCollection(next);
    saveCollection(next);
  };

  return (
    <ScreenContainer
      title="保管カード一覧画面"
      description="保存済み生成カードを確認し、必要に応じて削除する。"
    >
      <div className="space-y-6">
        {/* 上部サマリー */}
        <SectionBox>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                保管枚数: {collection.length} / 100
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                生成したカードを保管しています。上限を超えた場合は整理が必要です。
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                選択・削除のみ実装
              </div>
            </div>
          </div>
        </SectionBox>

        {/* 一覧本体 */}
        <SectionBox title="保管カード一覧">
          {collection.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
              保管カードはありません。
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {collection.map((item) => {
                const atk = item.card.rolled?.atk ?? 0;
                const def = item.card.rolled?.def ?? 0;

                return (
                  <article
                    key={item.seed}
                    className="flex min-h-[320px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* カード上部 */}
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Generated Card
                        </p>
                        <h3 className="mt-1 text-xl font-bold text-slate-900">
                          #{item.seed}
                        </h3>
                      </div>

                      <span
                        className={[
                          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold",
                          getRarityBadgeClass(item.rarity),
                        ].join(" ")}
                      >
                        {item.rarity}
                      </span>
                    </div>

                    {/* ステータス */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">攻撃力</div>
                        <div className="mt-1 text-lg font-bold text-slate-900">
                          {atk}
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">防御力</div>
                        <div className="mt-1 text-lg font-bold text-slate-900">
                          {def}
                        </div>
                      </div>
                    </div>

                    {/* keyword */}
                    <div className="mt-4">
                      <div className="mb-2 text-sm font-semibold text-slate-700">
                        キーワード
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {item.keywordIds.length > 0 ? (
                          item.keywordIds.map((keyword) => (
                            <span
                              key={keyword}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {keyword}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400">
                            キーワードなし
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 下部余白を押し広げてボタンを一番下へ */}
                    <div className="mt-auto pt-6">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.seed)}
                        className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-500 active:scale-[0.99]"
                      >
                        削除
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </SectionBox>
      </div>
    </ScreenContainer>
  );
}
