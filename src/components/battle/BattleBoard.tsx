/**
 * 4×2 盤面表示。
 *
 * 上段: 敵
 * 下段: プレイヤー
 *
 * プレイヤー側のマスをクリックすると、
 * 選択中の手札カードをその列に配置する。
 */

import { CardInstance } from "@/game/types";
import { getDef } from "@/game/defs";
import SectionBox from "@/components/common/SectionBox";

type Props = {
  enemyHp: number[];
  playerField: Array<CardInstance | null>;
  onPlaceToColumn: (col: number) => void;
};

export default function BattleBoard({
  enemyHp,
  playerField,
  onPlaceToColumn,
}: Props) {
  return (
    <SectionBox title="盤面（4×2）">
      <div className="grid grid-cols-4 gap-3">
        {enemyHp.map((hp, index) => (
          <div
            key={`enemy-${index}`}
            className="rounded-xl border border-red-300 bg-red-50 p-4 text-center"
          >
            <div className="text-sm text-slate-500">敵 {index + 1}</div>
            <div className="mt-2 font-bold">HP: {hp}</div>
          </div>
        ))}

        {playerField.map((card, index) => (
          <button
            key={`player-${index}`}
            type="button"
            onClick={() => onPlaceToColumn(index)}
            className="rounded-xl border border-blue-300 bg-blue-50 p-4 text-left transition hover:bg-blue-100"
          >
            <div className="text-sm text-slate-500">自列 {index + 1}</div>

            {card ? (
              <div className="mt-2">
                <div className="font-bold">{getDef(card.defId).name}</div>
                <div className="text-sm text-slate-700">
                  A:{card.rolled?.atk ?? getDef(card.defId).atk} / D:
                  {card.rolled?.def ?? getDef(card.defId).def}
                </div>
              </div>
            ) : (
              <div className="mt-2 text-sm text-slate-500">空きマス</div>
            )}
          </button>
        ))}
      </div>
    </SectionBox>
  );
}
