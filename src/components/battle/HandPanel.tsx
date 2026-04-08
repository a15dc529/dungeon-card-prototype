/**
 * 手札表示。
 *
 * 手札をクリックすると選択状態になる。
 * そのあと盤面の列を押すと配置される。
 */

import CardBox from "@/components/common/CardBox";
import SectionBox from "@/components/common/SectionBox";
import { CardInstance } from "@/game/types";
import { getDef } from "@/game/defs";

type Props = {
  hand: CardInstance[];
  selectedHandIndex: number | null;
  currentCost: number;
  onSelectHand: (index: number) => void;
};

export default function HandPanel({
  hand,
  selectedHandIndex,
  currentCost,
  onSelectHand,
}: Props) {
  return (
    <SectionBox title="手札">
      <div className="flex flex-wrap gap-3">
        {hand.map((card, index) => {
          const def = getDef(card.defId);
          const canPlay = def.cost <= currentCost;

          return (
            <CardBox
              key={card.instanceId}
              title={def.name}
              selected={selectedHandIndex === index}
              disabled={!canPlay}
              onClick={() => onSelectHand(index)}
              lines={[
                `コスト: ${def.cost}`,
                `攻撃: ${card.rolled?.atk ?? def.atk ?? 0}`,
                `防御: ${card.rolled?.def ?? def.def ?? 0}`,
              ]}
            />
          );
        })}
      </div>
    </SectionBox>
  );
}
