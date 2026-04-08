"use client";

/**
 * 生成画面。
 *
 * 本来は:
 * - キーワード選択
 * - rarity抽選
 * - seed生成
 * - 能力生成
 * - 画像生成API呼び出し
 *
 * ただし今回は API なしなので、
 * ローカルロジックだけで生成結果を出す。
 */

import { useMemo, useState } from "react";
import ScreenContainer from "@/components/layout/ScreenContainer";
import SectionBox from "@/components/common/SectionBox";
import CardBox from "@/components/common/CardBox";
import { KEYWORD_DEFS } from "@/game/defs";
import { createGeneratedCard } from "@/game/generate";
import { saveCollection, loadCollection } from "@/lib/storage";

export default function GeneratePage() {
  const [selectedKeywordIds, setSelectedKeywordIds] = useState<string[]>([]);
  const [seedInput, setSeedInput] = useState<string>("10001");
  const [result, setResult] = useState<ReturnType<
    typeof createGeneratedCard
  > | null>(null);

  const selectedKeywords = useMemo(
    () => KEYWORD_DEFS.filter((kw) => selectedKeywordIds.includes(kw.id)),
    [selectedKeywordIds],
  );

  return (
    <ScreenContainer
      title="生成画面"
      description="キーワードを選択し、ローカルロジックで生成カードを確定する。"
    >
      <SectionBox title="キーワード選択">
        <div className="flex flex-wrap gap-3">
          {KEYWORD_DEFS.map((keyword) => {
            const selected = selectedKeywordIds.includes(keyword.id);

            return (
              <CardBox
                key={keyword.id}
                title={keyword.displayName}
                selected={selected}
                onClick={() => {
                  setSelectedKeywordIds((prev) =>
                    prev.includes(keyword.id)
                      ? prev.filter((id) => id !== keyword.id)
                      : [...prev, keyword.id],
                  );
                }}
                lines={[
                  `prompt: ${keyword.promptTags.join(", ")}`,
                  `gameTags: ${Object.values(keyword.gameTags).join(", ")}`,
                ]}
              />
            );
          })}
        </div>
      </SectionBox>

      <SectionBox title="seed入力">
        <input
          value={seedInput}
          onChange={(e) => setSeedInput(e.target.value)}
          className="w-64 rounded-lg border border-slate-300 px-3 py-2"
        />
      </SectionBox>

      <SectionBox title="操作">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              const seed = Number(seedInput) || Date.now();
              const generated = createGeneratedCard(selectedKeywordIds, seed);
              setResult(generated);
            }}
            className="rounded-lg bg-purple-700 px-4 py-3 text-white hover:bg-purple-600"
          >
            生成する
          </button>

          <button
            type="button"
            onClick={() => {
              if (!result) return;
              const current = loadCollection();
              const next = [...current, result];
              saveCollection(next);
              alert("保管カードへ保存しました");
            }}
            disabled={!result}
            className="rounded-lg bg-emerald-700 px-4 py-3 text-white disabled:bg-slate-300"
          >
            保存する
          </button>
        </div>
      </SectionBox>

      <SectionBox title="生成結果">
        {!result ? (
          <p className="text-sm text-slate-500">まだ生成していません。</p>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="font-bold">生成カード #{result.seed}</div>
            <div className="mt-2 text-sm text-slate-700">
              rarity: {result.rarity}
            </div>
            <div className="text-sm text-slate-700">
              atk: {result.card.rolled?.atk}
            </div>
            <div className="text-sm text-slate-700">
              def: {result.card.rolled?.def}
            </div>
            <div className="text-sm text-slate-700">
              keywords:{" "}
              {selectedKeywords.map((kw) => kw.displayName).join(", ")}
            </div>
          </div>
        )}
      </SectionBox>
    </ScreenContainer>
  );
}
