"use client";

/**
 * 保管カード一覧画面。
 *
 * 外部設計では最大100枚まで保管し、
 * 超過時は削除が必要になる。
 *
 * 今回は localStorage 上の一覧を表示して削除確認する。
 */

import { useEffect, useState } from "react";
import ScreenContainer from "@/components/layout/ScreenContainer";
import SectionBox from "@/components/common/SectionBox";
import CardBox from "@/components/common/CardBox";
import { GeneratedRecord } from "@/game/types";
import { loadCollection, saveCollection } from "@/lib/storage";

export default function CollectionPage() {
  const [collection, setCollection] = useState<GeneratedRecord[]>([]);

  useEffect(() => {
    setCollection(loadCollection());
  }, []);

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
      <SectionBox title={`保管枚数: ${collection.length} / 100`}>
        <div className="flex flex-wrap gap-3">
          {collection.map((item) => (
            <div key={item.seed} className="space-y-2">
              <CardBox
                title={`生成カード #${item.seed}`}
                lines={[
                  `rarity: ${item.rarity}`,
                  `atk: ${item.card.rolled?.atk ?? 0}`,
                  `def: ${item.card.rolled?.def ?? 0}`,
                  `keyword: ${item.keywordIds.join(", ")}`,
                ]}
              />
              <button
                type="button"
                onClick={() => handleDelete(item.seed)}
                className="w-full rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-500"
              >
                削除
              </button>
            </div>
          ))}
        </div>
      </SectionBox>
    </ScreenContainer>
  );
}
