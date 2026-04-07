/**
 * アプリ全体のルートレイアウト。
 *
 * App Router では layout.tsx が全画面の共通外枠になる。
 * ここで HeaderNav を読み込むことで、
 * 全ページで上部ナビゲーションを表示できる。
 */

import type { Metadata } from "next";
import "./globals.css";
import HeadNav from "@/components/layout/HeadNav";

export const metadata: Metadata = {
  title: "Dungeon Card Prototype",
  description: "外部設計書ベースのロジック確認用プロトタイプ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <HeadNav />
        {children}
      </body>
    </html>
  );
}
