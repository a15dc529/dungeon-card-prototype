"use client";

/**
 * 報酬画面。
 *
 * 外部設計では、
 * 戦闘勝利後にカード追加・キーワード獲得などを行う。
 * 今回は簡易的に「選べる一覧を表示」して確認する。
 */

import Link from "next/link";
import { useState } from "react";
import ScreenContainer from "@/components/layout/ScreenContainer";
import SectionBox from "@/components/common/SectionBox";
import CardBox from "@/components/common/CardBox";

const rewards = [
  {
    id: "reward-card-1",
    title: "基本キャラ追加",
    lines: ["種類: カード", "内容: 基本キャラを1枚追加"],
  },
  {
    id: "reward-card-2",
    title: "水属性キーワード",
    lines: ["種類: キーワード", "内容: kw_water を獲得"],
  },
  {
    id: "reward-card-3",
    title: "ゴシックキーワード",
    lines: ["種類: キーワード", "内容: kw_gothic を獲得"],
  },
];

export default function RewardPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <ScreenContainer
      title="報酬画面"
      description="戦闘勝利後のカード・キーワード報酬選択を確認する。"
    >
      <SectionBox title="報酬候補">
        <div className="flex flex-wrap gap-3">
          {rewards.map((reward) => (
            <CardBox
              key={reward.id}
              title={reward.title}
              selected={selectedId === reward.id}
              onClick={() => setSelectedId(reward.id)}
              lines={reward.lines}
            />
          ))}
        </div>
      </SectionBox>

      <div className="flex gap-3">
        <Link
          href="/dungeon"
          className="rounded-lg bg-slate-900 px-4 py-3 text-white hover:bg-slate-800"
        >
          選択して探索へ戻る
        </Link>
        <Link
          href="/generate"
          className="rounded-lg bg-purple-700 px-4 py-3 text-white hover:bg-purple-600"
        >
          ボス報酬として生成画面へ
        </Link>
      </div>
    </ScreenContainer>
  );
}
