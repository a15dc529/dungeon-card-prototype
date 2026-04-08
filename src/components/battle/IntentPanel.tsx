import SectionBox from "@/components/common/SectionBox";

type Props = {
  damageByCol: number[];
};

export default function IntentPanel({ damageByCol }: Props) {
  return (
    <SectionBox title="敵Intent（次ターン攻撃）">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {damageByCol.map((damage, index) => (
          <div
            key={index}
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-center"
          >
            <div className="text-sm text-slate-500">列 {index + 1}</div>
            <div className="mt-1 text-lg font-bold text-red-600">
              → {damage}
            </div>
          </div>
        ))}
      </div>
    </SectionBox>
  );
}
