import Link from "next/link";
import ScreenContainer from "@/components/layout/ScreenContainer";
import SectionBox from "@/components/common/SectionBox";

export default function DungeonPage() {
  return (
    <ScreenContainer
      title="探索画面"
      description="本段階では簡易画面。イベント/戦闘/ボスへの遷移を確認する。"
    >
      <SectionBox title="現在地（仮）">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            1層: 通常マス
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            2層: イベントマス
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            3層: ボスマス
          </div>
        </div>
      </SectionBox>

      <SectionBox title="遷移確認">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/battle"
            className="rounded-lg bg-blue-700 px-4 py-3 text-white hover:bg-blue-600"
          >
            通常戦闘へ
          </Link>
          <Link
            href="/reward"
            className="rounded-lg bg-amber-600 px-4 py-3 text-white hover:bg-amber-500"
          >
            報酬画面へ
          </Link>
          <Link
            href="/generate"
            className="rounded-lg bg-purple-700 px-4 py-3 text-white hover:bg-purple-600"
          >
            ボス生成画面へ
          </Link>
        </div>
      </SectionBox>
    </ScreenContainer>
  );
}
