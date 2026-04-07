"use client";

/**
 * アプリ全体のルートレイアウト。
 *
 * App Router では layout.tsx が全画面の共通外枠になる。
 * ここで HeaderNav を読み込むことで、
 * 全ページで上部ナビゲーションを表示できる。
 */

import Link from "next/link";

const links = [
  { href: "/", label: "ホーム" },
  { href: "/run-start", label: "Run開始前" },
  { href: "/dungeon", label: "探索" },
  { href: "/battle", label: "戦闘" },
  { href: "/reward", label: "報酬" },
  { href: "/generate", label: "生成 " },
  { href: "/collection", label: "保管一覧" },
];

export default function HeadNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900 text-slate-300">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="rounded-md bg-slate-500 px-3 py-2 text-sm transition-colors hover:bg-slate-700"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
