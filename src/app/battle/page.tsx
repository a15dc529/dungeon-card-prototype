"use client";

/**
 * 戦闘画面。
 *
 * 今回の修正ポイント:
 * - Run開始前で選んだ生成カードを読み込む
 * - newRun() に渡して初期デッキへ追加する
 * - 勝利時に報酬画面へ進める
 * - 敗北時に探索へ戻れる
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import ScreenContainer from "@/components/layout/ScreenContainer";
import StatusPanel from "@/components/battle/StatusPanel";
import IntentPanel from "@/components/battle/IntentPanel";
import BattleBoard from "@/components/battle/BattleBoard";
import HandPanel from "@/components/battle/HandPanel";
import SectionBox from "@/components/common/SectionBox";
import { GameState } from "@/game/types";
import { newRun, refillHandToMax } from "@/game/state";
import { canRefill, endTurn, placeCharacterFromHand } from "@/game/rules";
import { loadRunSelectedCard } from "@/lib/storage";

export default function BattlePage() {
  /**
   * 戦闘state本体。
   * localStorage から選択カードを読んでから初期化するため、
   * 最初は null にしている。
   */
  const [state, setState] = useState<GameState | null>(null);

  /**
   * 現在選択中の手札インデックス。
   * null の場合は未選択。
   */
  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const selectedCard = loadRunSelectedCard();
    const initialState = newRun(Date.now(), selectedCard);
    setState(initialState);
  }, []);

  if (!state) {
    return (
      <ScreenContainer
        title="戦闘画面"
        description="戦闘データを準備しています。"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          読み込み中...
        </div>
      </ScreenContainer>
    );
  }

  const isVictory = state.enemyHp.every((hp) => hp <= 0);
  const isDefeat = state.playerHp <= 0;

  /**
   * 現在存在する総カード枚数。
   * 初期デッキが 10 枚か 11 枚かの確認用。
   */
  const totalCardCount =
    state.drawPile.length +
    state.hand.length +
    state.discardPile.length +
    state.exhaustPile.length +
    state.fieldPlayer.filter(Boolean).length;

  return (
    <ScreenContainer
      title="戦闘画面"
      description="4×2盤面、手札5枚補充、コスト、Intent、ターン終了の流れを確認する。"
    >
      <div className="grid gap-4">
        <StatusPanel
          turn={state.turn}
          playerHp={state.playerHp}
          cost={state.cost}
          costMax={state.costMax}
          drawCount={state.drawPile.length}
          discardCount={state.discardPile.length}
          exhaustCount={state.exhaustPile.length}
        />

        <IntentPanel damageByCol={state.enemyIntent.damageByCol} />

        <BattleBoard
          enemyHp={state.enemyHp}
          playerField={state.fieldPlayer}
          onPlaceToColumn={(col) => {
            if (selectedHandIndex === null) return;
            setState((prev) =>
              prev
                ? placeCharacterFromHand(prev, selectedHandIndex, col)
                : prev,
            );
            setSelectedHandIndex(null);
          }}
        />
        <SectionBox title="操作">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                setState((prev) => (prev ? refillHandToMax(prev) : prev))
              }
              disabled={!canRefill(state) || isVictory || isDefeat}
              className="rounded-lg bg-slate-900 px-4 py-3 text-white disabled:bg-slate-300"
            >
              補充（手札を5まで）
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedHandIndex(null);
                setState((prev) => (prev ? endTurn(prev) : prev));
              }}
              disabled={isVictory || isDefeat}
              className="rounded-lg bg-blue-700 px-4 py-3 text-white disabled:bg-slate-300"
            >
              ターン終了
            </button>

            <button
              type="button"
              onClick={() => {
                const selectedCard = loadRunSelectedCard();
                setSelectedHandIndex(null);
                setState(newRun(Date.now(), selectedCard));
              }}
              className="rounded-lg bg-slate-300 px-4 py-3 text-slate-900 hover:bg-slate-200"
            >
              戦闘リセット
            </button>

            {isVictory && (
              <Link
                href="/reward"
                className="rounded-lg bg-emerald-700 px-4 py-3 text-white hover:bg-emerald-600"
              >
                報酬画面へ進む
              </Link>
            )}

            {isDefeat && (
              <Link
                href="/dungeon"
                className="rounded-lg bg-red-700 px-4 py-3 text-white hover:bg-red-600"
              >
                探索へ戻る
              </Link>
            )}
          </div>

          <div className="mt-3 text-sm text-slate-600">
            {isVictory && "戦闘勝利です。報酬画面へ進めます。"}
            {isDefeat && "敗北しました。探索画面へ戻れます。"}
            {!isVictory &&
              !isDefeat &&
              "手札を選択して下段マスをクリックすると配置できます。"}
          </div>
        </SectionBox>

        <HandPanel
          hand={state.hand}
          selectedHandIndex={selectedHandIndex}
          currentCost={state.cost}
          onSelectHand={(index) => setSelectedHandIndex(index)}
        />

        <SectionBox title="今回の初期デッキ確認">
          <div className="text-sm text-slate-700">
            現在の山札 + 手札 + 捨て札 + 除外 + 場 の合計を見れば、 初期デッキが
            10枚 か 11枚 か確認できます。
          </div>
          <div className="mt-2 font-bold">総カード枚数: {totalCardCount}</div>
        </SectionBox>
      </div>
    </ScreenContainer>
  );
}
