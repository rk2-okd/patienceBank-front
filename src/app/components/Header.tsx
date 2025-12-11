"use client";

import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <header className="relative w-full text-white overflow-visible">
      <div className="relative mx-auto flex max-w-[80%]  border-primary items-center justify-between py-2 border-b-[4px] h-[160px]">
        <div className="flex items-center gap-8">
          <div className="relative h-[170px] w-[170px]">
            <Image src="/logo.png"  alt="がまんBank ロゴ" fill className="object-contain" priority/>
          </div>

          <nav className="flex flex-wrap gap-8 text-lg font-medium">
            <a href="/input" className="hover:underline text-text_green mt-8">がまん入力</a>
            <a href="/result" className="hover:underline text-text_green mt-8">先週の結果</a>
            <a href="/calendar" className="hover:underline text-text_green mt-8">カレンダー</a>
            <a href="/goalSettings" className="hover:underline text-text_green mt-8">目標設定変更</a>
          </nav>
        </div>
      </div>

      <div className="pointer-events-none absolute right-[280px] top-[110px]">
        <Image
          src="/bubble2.png"
          alt="バブル"
          width={220}
          height={220}
          className="opacity-70"
          priority
        />
      </div>

      <div className="pointer-events-none absolute right-[-20px] top-[-10px]">
        <Image
          src="/bubble2.png"
          alt="バブル"
          width={260}
          height={260}
          className="opacity-65"
          priority
        />
      </div>
    </header>
  );
};

export default Header;
