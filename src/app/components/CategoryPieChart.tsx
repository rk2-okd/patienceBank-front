"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type ApiRecord = {
  trained_part: string;
  workout_duration: number;
  workout_date: string;
  user_id: number;
};

export default function CategoryPieChart({
  records,
}: {
  records: ApiRecord[];
}) {
  const categories = Array.from(
    new Set(records.map((r) => r.trained_part))
  ).sort();
  const totals = categories.map((category) =>
    records
      .filter((r) => r.trained_part === category)
      .reduce((sum, r) => sum + r.workout_duration, 0)
  );

  // 分類 → 色 の対応表（全部定義）
  const colorMap: Record<string, string> = {
    "体感": "#4FD1C5",
    "背骨": "#63B3ED",
    "顔": "#F6AD55",
    "首": "#FC8181",
    "背中": "#68D391",
    "お腹": "#FBD38D",
    "肩": "#90CDF4",
    "二の腕": "#B794F4",
    "腕（ひじ下）": "#A0AEC0",
    "手": "#CBD5E0",
    "おしり": "#F687B3",
    "太もも": "#FBB6CE",
    "内もも": "#FEB2B2",
    "ふくらはぎ": "#9AE6B4",
    "足": "#81E6D9",
  };

  const data = {
    labels: categories,
    datasets: [
      {
        data: totals,
        backgroundColor: categories.map(
          (c) => colorMap[c] ?? "#E2E8F0"
        ),
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <div style={{ width: 440, height: 400 }}>
      <Pie
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: {
                color: "#E6ECE8",
                boxWidth: 14,
                boxHeight: 14,
                padding: 14,
              },
            },
          },
        }}
      />
    </div>
  );
}
