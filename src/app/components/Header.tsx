"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

type GoalResponse = {
  goal_money: number;
  goal_count: number;
};

const Header = () => {
  const [goalMoney, setGoalMoney] = useState<number>(0);
  const [goalCount, setGoalCount] = useState<number>(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkLogin = async () => {
      const res = await fetch("http://localhost:8080/me", {
        credentials: "include",
      });

      setIsLoggedIn(res.ok);
    };

    checkLogin();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await fetch("http://localhost:8080/getGoal");
        if (!res.ok) throw new Error("目標取得失敗");
        const data: GoalResponse = await res.json();

        setGoalMoney(data.goal_money);
        setGoalCount(data.goal_count);
      } catch (err) {
        console.error("getGoal error:", err);
      }
    };

    fetchGoal();
  }, []);

  return (
    <header className="relative w-full overflow-visible">
      <div className={clsx("relative mx-auto flex max-w-[80%] border-primary items-center justify-between border-b-[4px] h-4/5",
        "",
        "max-w-[80%]"
      )}>
        <div className="flex items-center gap-8">
          <div className="relative h-[170px] w-[170px]">
            <Image
              src="/からだlogo.png"
              alt="がまんBank ロゴ"
              fill
              className="object-contain"
              priority
            />
          </div>
          <nav className="flex flex-wrap gap-8 text-lg font-medium">
            <a href="/input" className="hover:underline text-text_green mt-4">がまん入力</a>
            <a href="/result" className="hover:underline text-text_green mt-4">先週の結果</a>
            <a href="/calendar" className="hover:underline text-text_green mt-4">カレンダー</a>
            <a href="/goalSettings" className="hover:underline text-text_green mt-4">目標設定変更</a>
            {isLoggedIn ? (
              <Link href="/mypage" className="hover:underline text-text_green mt-4">マイページ</Link>
            ) : (
              <Link href="/login" className="hover:underline text-text_green mt-4">ログイン</Link>
            )}
          </nav>
        </div>
      </div>
      <div className="pointer-events-none absolute right-[280px] top-[110px]">
        <div className="relative">
          <Image
            src="/bubble2.png"
            alt="バブル"
            width={220}
            height={220}
            className="opacity-70"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-900 font-bold text-sm">
            <p>目標回数</p>
            <p className="text-lg">{goalCount}回</p>
          </div>
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
            <p>目標時間</p>
            <p className="text-xl">
              {goalMoney.toLocaleString()}分
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;