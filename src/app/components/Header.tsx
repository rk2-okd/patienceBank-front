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
  const [goal, setGoal] = React.useState("目標を設定してください");
  const navItems = React.useMemo<NavItem[]>(
    () => [
      { href: "/input", label: "がまん入力" },
      { href: "/record", label: "記録" },
      { href: "/mypage", label: "マイページ" },
    ],
    []
  );
  const fetchGoal = React.useCallback(async (signal: AbortSignal) => {
    const res = await fetch("http://localhost:8080/getgoal", {
      credentials: "include",
      signal,
    });
    const data: GoalResponse = await res.json();
    setGoal(data.goal);
    console.log("Fetched goal:", data.goal);
  }, []);
  React.useEffect(() => {
    const controller = new AbortController();
    fetchGoal(controller.signal);
    return () => controller.abort();
  }, [fetchGoal]);
  return (
    <header className="relative w-full overflow-visible">
      <div className="relative mx-auto flex max-w-[85%] items-center justify-between h-4/5">
        <div className="flex items-center gap-8">
          <Link href="/" className="block">
            <div className="relative h-[150px] w-[200px]">
              <Image
                src="/logo.png"
                alt="ロゴ"
                fill
                sizes="150vw, 200px"
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
              >{item.label}
              </Link>
            ))}
          </nav>
          <div className="relative ml-4 mt-4 w-[670px]">
            <img
              src="hatimaki.png"
              alt="目標"
              className="h-[70px] w-[670px] mt-5"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-black mr-16">
                {goal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
