"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

type GoalResponse = {
  goal: string;
};
type NavItem = {
  href: string;
  label: string;
};
const Header: React.FC = React.memo(function Header() {
  const [goal, setGoal] = React.useState("");
  const navItems = React.useMemo<NavItem[]>(
    () => [
      { href: "/input", label: "がまん入力" },
      { href: "/goalSettings", label: "目標設定変更" },
      { href: "/record", label: "記録" },
      { href: "/mypage", label: "マイページ" },
    ],
    []
  );
  const fetchGoal = React.useCallback(async (signal: AbortSignal) => {
    const res = await fetch("http://localhost:8080/getGoal", {
      credentials: "include",
      signal,
    });
    const data: GoalResponse = await res.json();
    const nextGoal = data.goal ?? "";
    setGoal((prev) => (prev === nextGoal ? prev : nextGoal));
  }, []);
  React.useEffect(() => {
    const controller = new AbortController();
    fetchGoal(controller.signal).catch((e: any) => {
      if (e?.name === "AbortError") return;
      console.error("getGoal error:", e);
    });
    return () => controller.abort();
  }, [fetchGoal]);
  return (
    <header className="relative w-full overflow-visible">
      <div className="relative mx-auto flex max-w-[80%] border-primary items-center justify-between border-b-[4px] h-4/5">
        <div className="flex items-center gap-8">
          <Link href="/" className="block">
            <div className="relative h-[170px] w-[170px]">
              <Image
                src="/からだlogo.png"
                alt="がまんBank ロゴ"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <nav className="flex flex-wrap gap-8 text-lg font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:underline text-text_green mt-4"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="pointer-events-none absolute right-[-20px] top-[-10px]">
        <div className="relative">
          <Image
            src="/bubble2.png"
            alt="バブル"
            width={260}
            height={260}
            className="opacity-65"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-900 font-bold text-base">
            <p>目標</p>
            <p className="text-xl">{goal}</p>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
