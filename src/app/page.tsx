import Link from "next/link";
import ScreenContainer from "@/components/layout/ScreenContainer";
import SectionBox from "@/components/common/SectionBox";

export default function HomePage() {
  return (
    <ScreenContainer
      title="ダンジョンカードRPG プロトタイプ"
      description="外部設計をもとに、ロジック確認用の各画面を Next.js + Tailwind で確認する。"
    >
      <SectionBox title="このプロトタイプで確認すること">
        <ul className="list-disc space-y-2 pl-6 text-sm text-slate-700">
          <li>Run開始前の生成カード選択</li>
          <li>探索から戦闘への遷移イメージ</li>
          <li>4×2盤面・手札・コスト・Intent のロジック確認</li>
          <li>戦闘後報酬画面の確認</li>
          <li>生成画面の仮ロジック確認</li>
          <li>保管カード一覧の確認</li>
        </ul>
      </SectionBox>

      <SectionBox title="開始">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/run-start"
            className="rounded-lg bg-slate-900 px-4 py-3 text-white hover:bg-slate-800"
          >
            Run開始前画面へ
          </Link>
          <Link
            href="/battle"
            className="rounded-lg bg-blue-700 px-4 py-3 text-white hover:bg-blue-600"
          >
            戦闘画面へ
          </Link>
          <Link
            href="/collection"
            className="rounded-lg bg-emerald-700 px-4 py-3 text-white hover:bg-emerald-600"
          >
            保管カード一覧へ
          </Link>
        </div>
      </SectionBox>
    </ScreenContainer>
  );
}
