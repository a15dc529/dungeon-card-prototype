"use client";

/**
 * 画面確認用の上部ナビゲーション。
 *
 * 今回は「画面遷移の自然さ」よりも
 * 「各画面をすぐ確認できること」が大事なので、
 * 常に上部から各画面へ飛べるようにしている。
 */

import Link from "next/link";

const links = [
  { href: "/", label: "ホーム" },
  { href: "/run-start", label: "Run開始前" },
  { href: "/dungeon", label: "探索" },
  { href: "/battle", label: "戦闘" },
  { href: "/reward", label: "報酬" },
  { href: "/generate", label: "生成" },
  { href: "/collection", label: "保管一覧" },
];

export default function HeaderNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md bg-slate-800 px-3 py-2 text-sm text-white transition hover:bg-slate-700"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
