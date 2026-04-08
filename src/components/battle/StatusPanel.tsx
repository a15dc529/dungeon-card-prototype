import SectionBox from "@/components/common/SectionBox";

type Props = {
  turn: number;
  playerHp: number;
  cost: number;
  costMax: number;
  drawCount: number;
  discardCount: number;
  exhaustCount: number;
};

export default function StatusPanel({
  turn,
  playerHp,
  cost,
  costMax,
  drawCount,
  discardCount,
  exhaustCount,
}: Props) {
  return (
    <SectionBox title="戦闘ステータス">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-lg bg-slate-100 p-3">ターン: {turn}</div>
        <div className="rounded-lg bg-slate-100 p-3">HP: {playerHp}</div>
        <div className="rounded-lg bg-slate-100 p-3">
          コスト: {cost} / {costMax}
        </div>
        <div className="rounded-lg bg-slate-100 p-3">山札: {drawCount}</div>
        <div className="rounded-lg bg-slate-100 p-3">
          捨て札: {discardCount}
        </div>
        <div className="rounded-lg bg-slate-100 p-3">除外: {exhaustCount}</div>
      </div>
    </SectionBox>
  );
}
