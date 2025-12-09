"use client";

import React from "react";

type BubbleProps = {
  size?: number;         // シャボン玉のサイズ
  color?: string;        // メインカラー
  highlight?: string;    // ハイライト部分の色
  className?: string;    // 追加クラス
};

const Bubble: React.FC<BubbleProps> = ({
  size = 120,
  color = "rgba(184, 242, 225, 0.45)",   // ミント系
  highlight = "rgba(255, 255, 255, 0.7)",
  className = "",
}) => {
  return (
    <div
      className={`relative rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: "0 0 25px rgba(184, 242, 225, 0.6)",
      }}
    >
      {/* ハイライト */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.35,
          height: size * 0.35,
          top: size * 0.12,
          left: size * 0.12,
          background: highlight,
          filter: "blur(3px)",
          opacity: 0.85,
        }}
      />
    </div>
  );
};

export default Bubble;
