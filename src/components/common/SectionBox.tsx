/**
 * 画面内の各ブロックを囲む共通ボックス。
 *
 * 例:
 * - ステータス表示エリア
 * - 盤面エリア
 * - 報酬一覧エリア
 * - 保管カード一覧エリア
 */

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function SectionBox({ title, children }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {title && <h2 className="m-4 text-lg font-semibold">{title}</h2>}
      {children}
    </section>
  );
}
