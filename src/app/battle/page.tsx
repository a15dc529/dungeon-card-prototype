"use client";

/**
 * 戦闘画面。
 *
 * この画面が今回の中心。
 * 外部設計の主要ルールをローカル state で確認する。
 */

import { useState } from "react";
import ScreenContainer from "@/components/layout/ScreenContainer";
import StatusPanel from "@/components/battle/StatusPanel";
import IntentPanel from "@/components/battle/IntentPanel";
import BattleBoard from "@/components/battle/BattleBoard";
import HandPanel from "@/components/battle/HandPanel";
import SectionBox from "@/components/common/SectionBox";
import { newRun, refillHandToMax } from "@/game/state";
import { canRefill, endTurn, placeCharacterFromHand } from "@/game/rules";

export default function BattlePage() {
  /**
   * 戦闘用の state。
   * 画面表示とロジック更新の中心。
   */
  const [state, setState] = useState(() => newRun());

  /**
   * 手札のどのカードを今選択しているか。
   * null なら未選択。
   */
  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(
    null,
  );

  const isVictory = state.enemyHp.every((hp) => hp <= 0);
  const isDefeat = state.playerHp <= 0;

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

        <SectionBox title="操作">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setState((prev) => refillHandToMax(prev))}
              disabled={!canRefill(state) || isVictory || isDefeat}
              className="rounded-lg bg-slate-900 px-4 py-3 text-white disabled:bg-slate-300"
            >
              補充（手札を5まで）
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedHandIndex(null);
                setState((prev) => endTurn(prev));
              }}
              disabled={isVictory || isDefeat}
              className="rounded-lg bg-blue-700 px-4 py-3 text-white disabled:bg-slate-300"
            >
              ターン終了
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedHandIndex(null);
                setState(newRun());
              }}
              className="rounded-lg bg-slate-300 px-4 py-3 text-slate-900 hover:bg-slate-200"
            >
              戦闘リセット
            </button>
          </div>

          <div className="mt-3 text-sm text-slate-600">
            {isVictory && "戦闘勝利です。報酬画面に進めます。"}
            {isDefeat && "敗北しました。Run終了想定です。"}
            {!isVictory &&
              !isDefeat &&
              "手札を選択して下段マスをクリックすると配置できます。"}
          </div>
        </SectionBox>

        <BattleBoard
          enemyHp={state.enemyHp}
          playerField={state.fieldPlayer}
          onPlaceToColumn={(col) => {
            if (selectedHandIndex === null) return;
            setState((prev) =>
              placeCharacterFromHand(prev, selectedHandIndex, col),
            );
            setSelectedHandIndex(null);
          }}
        />

        <HandPanel
          hand={state.hand}
          selectedHandIndex={selectedHandIndex}
          currentCost={state.cost}
          onSelectHand={(index) => setSelectedHandIndex(index)}
        />
      </div>
    </ScreenContainer>
  );
}
