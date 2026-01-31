"use client";
import CategoryPieChart from "../components/CategoryPieChart";
import { useMemo, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
type ApiRecord = {
  trained_part: string;
  workout_duration: number;
  workout_date: string;
  user_id: number;
};

type NavItem = {
  href: string;
  label: string;
};
const Record = () => {
  const [records, setRecords] = useState<ApiRecord[]>([]);
  const router = useRouter();
  const [zeroState, setZeroState] = useState(false);
  const navItems = useMemo<NavItem[]>(
    () => [
      { href: "/calendar", label: "カレンダー" },
      { href: "/record", label: "グラフ" },
    ],
    []
  );
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const handleChange = async (y: number, m: number) => {
    try {
      const res = await fetch(`http://localhost:8080/graph?year=${y}&month=${m}`, {
          credentials: "include",
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) throw new Error("データ取得失敗");
      const json = await res.json();
      if (Array.isArray(json)) {
        setRecords(json);
        setZeroState(false);
      } else {
        setRecords([]);
        setZeroState(true);
      }
    } catch (e) {
        console.error(e);
    }
  };
  useEffect(() => {
    handleChange(year, month);
  }, []);
  const handlePrevMonth = () => { // 先月
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
      handleChange(year - 1, 12);
    } else {
      setMonth(month - 1);
      handleChange(year, month - 1);
    }
  };
  const handleNextMonth = () => { // 来月
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
      handleChange(year + 1, 1);
    } else {
      setMonth(month + 1);
      handleChange(year, month + 1);
    }
  };
  const isCurrentMonth = (year: number, month: number) => {
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth() + 1;
  };
  return (
    <main style={{ padding: 16 }} className="mx-auto py-8">
      <nav className="flex flex-wrap gap-8 text-lg font-medium max-w-[80%] ">
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
      <h1 className="text-2xl font-bold text-center text-text_green my-4">{year}年 {month}月 の記録</h1>
      <div className="flex justify-center">
        <button type="button" onClick={handlePrevMonth} className="text-text_green text-2xl font-bold">＜</button>
        <div style={{ width: 440, height: 400, marginTop: 16}}>
          {zeroState ? (
            <p className="text-center text-text_green"> この月は記録がありません</p>
          ):(
            <CategoryPieChart records={records} />
          )}
        </div>
        {!isCurrentMonth(year, month) && (
          <button type="button" onClick={handleNextMonth} className="text-text_green text-2xl font-bold">＞</button>
        )}
      </div>
    </main>
  );
}
export default Record;