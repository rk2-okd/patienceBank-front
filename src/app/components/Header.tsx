"use client";

import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <header className="relative w-full bg-emerald-400 text-white overflow-visible">
      <div className="mx-auto flex max-w-[75%] items-center justify-between px-5 py-3">

        {/* 左：タイトル＋メニュー */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide drop-shadow">
            がまんBank！！
          </h1>

          <nav className="flex flex-wrap gap-6 text-lg md:text-xl font-medium">
            <a href="/input" className="hover:underline">我慢入力</a>
            <a href="/result" className="hover:underline">先週の結果</a>
            <a href="/calendar" className="hover:underline">カレンダー</a>
            <a href="/goalSettings" className="hover:underline">目標設定変更</a>
          </nav>
        </div>

        {/* 右：シャボン玉（同じ画像をサイズ違いで使用） */}
        <div className="relative w-[340px] h-[200px] overflow-visible">

          <div className="absolute right-[-60px] top-[15px]">
            <div className="relative inline-block">
              <Image
                src="/bubble2.png"
                alt="目標金額バブル"
                width={240}
                height={240}
                className="opacity-90"
                priority
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center
                              text-2xl font-bold text-[#003344]">
                目標金額:5,000円
              </div>
            </div>
          </div>

          <div className="absolute left-[-70px] top-[100px]">
            <div className="relative inline-block">
              <Image
                src="/bubble2.png"
                alt="目標回数バブル"
                width={200}
                height={200}
                className="opacity-90"
                priority
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center
                              text-2xl font-bold text-[#004455]">
                目標回数:3回
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
