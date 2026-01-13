"use client";

import Body from "../app/components/Body";
import Link from "next/link";

const Hello = () => {
  return (
    <div className="flex min-h-screen items-center">
      <div className="w-1/2 flex flex-col justify-center gap-6 px-20">
        <div className="space-y-8">
          <h1 className="text-text-gray text-3xl font-medium tracking-wide">
            w<span className="text-text-accent">I</span>th
            <span className="text-text-accent">I</span>n
          </h1>
          <h2 className="text-text-white text-5xl font-semibold leading-tight">
            日々を、このカラダで。
          </h2>
          <div className="space-y-2">
            <p className="text-text-gray leading-relaxed">
              このアプリには、他人と比べる機能やSNS共有はありません。
            </p>
            <p className="text-text-gray leading-relaxed">
              自分の体の変化を、静かに記録するためのアプリです。
            </p>
          </div>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-full border border-white/10 bg-white/5 px-8 py-3 text-text-white hover:bg-white/10 transition"
          >
            はじめる
          </Link>
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <Body heightVh={90} maxWidthPx={500} />
      </div>
    </div>
  );
};

export default Hello;
