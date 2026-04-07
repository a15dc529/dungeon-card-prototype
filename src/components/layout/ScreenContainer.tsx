/**
 * 各画面の共通コンテナ。
 *
 * 役割:
 * - タイトル表示
 * - 画面幅の統一
 * - 余白の統一
 *
 * これを使うことで、全ページの見た目が揃いやすくなる。
 */

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function ScreenContainer({
  title,
  description,
  children,
}: Props) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        )}
      </header>
      {children}
    </main>
  );
}
