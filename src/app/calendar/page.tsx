"use client";

import { useState, useEffect, useMemo } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "react-day-picker/dist/style.css";

type NavItem = {
  href: string;
  label: string;
};
type HistoryRecord = {
  trained_part: string;
  workout_duration: number;
};
const CalendarPage = () => {
  const router = useRouter();
  const navItems = useMemo<NavItem[]>(
    () => [
      { href: "/calendar", label: "カレンダー" },
      { href: "/record", label: "グラフ" },
    ],
    []
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  useEffect(() => {
    setSelectedDate(new Date());
  }, []);
  useEffect(() => {
    if (!selectedDate) return;
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth() + 1;
    setYear(y);
    setMonth(m);
    const fetchHistory = async () => {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      try {
        const res = await fetch(
          `http://localhost:8080/history?days=${formattedDate}`,
          { credentials: "include" }
        );
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error("データ取得失敗");
        const json = await res.json();
        const data: HistoryRecord[] = Array.isArray(json) ? json : [];
        setRecords(data);
        setTotalAmount(data.reduce((sum, r) => sum + r.workout_duration, 0));
      } catch (err) {
        console.error(err);
        setRecords([]);
        setTotalAmount(0);
      }
    };

    fetchHistory();
  }, [selectedDate, router]);
  const handleGraphClick = () => {
    router.push(`/record?year=${year}&month=${month}`);
  };
  return (
    <div className="[background-image:var(--bg-gradient)]">
      <nav className="flex flex-wrap gap-8 text-lg font-medium max-w-[80%] mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:underline text-text_green"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 flex flex-col justify-center items-center">
        <div className="flex justify-center space-x-8 mr-12">
          <div className="w-1xl px-12 py-2 border-2 border-black rounded-3xl bg-white">
            <DayPicker
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={setSelectedDate}
              required
              className="mx-auto text-lg"
              modifiersClassNames={{
                selected: "bg-blue-500 text-white",
                today: "border border-blue-500",
              }}
            />
            <button type="button" onClick={handleGraphClick} className="text-text_green font-bold underline my-2">
              グラフを見る
            </button>
          </div>
          {selectedDate && (
            <div className="w-84 px-4 pt-6 pb-3 border-2 border-black rounded-3xl bg-white flex flex-col">
              <h3 className="px-4 font-bold text-1g text-left">
                選択した日付:{" "}
                <span className="text-cyan-800">
                  {selectedDate.toLocaleDateString("ja-JP")}
                </span>
              </h3>
              <div className="space-y-6 mt-10 px-4">
                {records.length > 0 ? (
                  records.map((r, i) => (
                    <div key={i}>
                      <p>筋トレ部位：{r.trained_part}</p>
                      <p>時間：{r.workout_duration}分</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">記録がありません</p>
                )}
              </div>
              <div className="ml-8 flex space-x-4 mt-auto text-emerald-800 font-bold">
                <p>合計回数:{records.length}回</p>
                <p>合計時間:{totalAmount}分</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
