"use client";

import Body from "../app/components/Body";
import Link from "next/link";

const Hello = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 flex flex-col gap-8 ml-60 mt-16">
        <div className="space-y-8">
          <h1 className="text-text-gray text-5xl font-medium tracking-wide mt-8" style={{ fontFamily: "var(--font-logo)" }}>
            w<span className="text-text-accent">I</span>th
            <span className="text-text-accent">I</span>n
          </h1>
          <h2 className="text-text-white text-5xl font-semibold leading-tight mt-30 font-sans">
            日々を、このカラダで。
          </h2>
          <div className="space-y-2 mt-8">
            <p className="text-text-gray leading-relaxed font-sans">
              このアプリには、他人と比べる機能やSNS共有機能はありません。
            </p>
            <p className="text-text-gray leading-relaxed font-sans">
              自分の体の変化を、静かに記録するためのアプリです。
            </p>
          </div>
          <Link
            href="/login"
            className="mt-10 inline-block rounded-full border border-white/10 bg-white/5 px-14 py-3 text-text-white text-xl hover:bg-white/10 transition"
          >
            はじめる
          </Link>
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center mr-40">
        <Body heightVh={90} maxWidthPx={1000} />
      </div>
    </div>
  );
};

export default Hello;
