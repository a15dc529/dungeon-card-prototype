"use client";

/**
 * Run開始前画面。
 *
 * 役割:
 * - 保管済み生成カードを読み込む
 * - 1枚だけ選択する
 * - 選択内容を localStorage に保存する
 * - 探索画面へ進む
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import ScreenContainer from "@/components/layout/ScreenContainer";
import SectionBox from "@/components/common/SectionBox";
import CardBox from "@/components/common/CardBox";
import { GeneratedRecord } from "@/game/types";
import {
  loadCollection,
  saveRunSelectedCardSeed,
  loadRunSelectedCardSeed,
} from "@/lib/storage";

export default function RunStartPage() {
  const [collection, setCollection] = useState<GeneratedRecord[]>([]);
  const [selectedSeed, setSelectedSeed] = useState<number | null>(null);

  useEffect(() => {
    const loadedCollection = loadCollection();
    const loadedSelectedSeed = loadRunSelectedCardSeed();

    setCollection(loadedCollection);
    setSelectedSeed(loadedSelectedSeed);
  }, []);

  return (
    <ScreenContainer
      title="Run開始前画面"
      description="保管済み生成カードから1枚選び、今回のRunの初期デッキへ追加する。"
    >
      <SectionBox title="選択ルール">
        <ul className="list-disc space-y-2 pl-6 text-sm text-slate-700">
          <li>保管カードから1枚だけ選択可能</li>
          <li>選択しなくても開始可能</li>
          <li>選択したカードは次の戦闘開始時に初期デッキへ1枚追加される</li>
        </ul>
      </SectionBox>

      <SectionBox title="保管済み生成カード">
        <div className="flex flex-wrap gap-3">
          {collection.map((item) => (
            <CardBox
              key={item.seed}
              title={`生成カード #${item.seed}`}
              selected={selectedSeed === item.seed}
              onClick={() => {
                /**
                 * クリック時に選択状態を更新し、
                 * localStorage にも保存する。
                 */
                setSelectedSeed(item.seed);
                saveRunSelectedCardSeed(item.seed);
              }}
              lines={[
                `rarity: ${item.rarity}`,
                `atk: ${item.card.rolled?.atk ?? 0}`,
                `def: ${item.card.rolled?.def ?? 0}`,
                `keyword: ${item.keywordIds.join(", ")}`,
              ]}
            />
          ))}
        </div>
      </SectionBox>
      <SectionBox title="現在の選択">
        <div className="test-sm text-slate-700">
          {selectedSeed === null
            ? "カードが選択されていません"
            : `seed: ${selectedSeed} の生成カードを初期デッキへ追加予定`}
        </div>
      </SectionBox>

      <div className="flex gap-3">
        <Link
          href="/dungeon"
          className="rounded-lg bg-slate-900 px-4 py-3 text-white hover:bg-slate-800"
        >
          選択して探索開始
        </Link>
        <Link
          href="/dungeon"
          className="rounded-lg bg-slate-300 px-4 py-3 text-slate-900 hover:bg-slate-200"
        >
          選択せず探索開始
        </Link>
        <button
          type="button"
          onClick={() => {
            setSelectedSeed(null);
            saveRunSelectedCardSeed(null);
          }}
          className="rounded-lg bg-slate-300 px-4 py-3 text-slate-900 hover:bg-slate-200"
        >
          選択を解除する
        </button>
      </div>
    </ScreenContainer>
  );
}
