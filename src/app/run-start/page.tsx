"use client";

/**
 * Run開始前画面。
 *
 * 外部設計では、
 * 保管済み生成カードから1枚だけ初期デッキに追加して
 * 11枚スタートにできる。
 *
 * 今回は localStorage + モックデータで確認する。
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import ScreenContainer from "@/components/layout/ScreenContainer";
import SectionBox from "@/components/common/SectionBox";
import CardBox from "@/components/common/CardBox";
import { GeneratedRecord } from "@/game/types";
import { loadCollection } from "@/lib/storage";

export default function RunStartPage() {
  const [collection, setCollection] = useState<GeneratedRecord[]>([]);
  const [selectedSeed, setSelectedSeed] = useState<number | null>(null);

  useEffect(() => {
    setCollection(loadCollection());
  }, []);

  return (
    <ScreenContainer
      title="Run開始前画面"
      description="保管済み生成カードから1枚選び、次Runの初期デッキに加える想定。"
    >
      <SectionBox title="選択ルール">
        <ul className="list-disc space-y-2 pl-6 text-sm text-slate-700">
          <li>1枚だけ選択可能</li>
          <li>選ばなくても開始可能</li>
          <li>本実装では選択内容を Run 初期化処理へ渡す</li>
        </ul>
      </SectionBox>

      <SectionBox title="保管済み生成カード">
        <div className="flex flex-wrap gap-3">
          {collection.map((item) => (
            <CardBox
              key={item.seed}
              title={`生成カード #${item.seed}`}
              selected={selectedSeed === item.seed}
              onClick={() => setSelectedSeed(item.seed)}
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
      </div>
    </ScreenContainer>
  );
}
