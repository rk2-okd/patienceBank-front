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
  useEffect(() => {
    const fetchData = async () => {
      try {
          const res = await fetch("http://localhost:8080/graph", {
              credentials: "include",
          });
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          if (!res.ok) throw new Error("データ取得失敗");
          const data: ApiRecord[] = await res.json();
          setRecords(data);
        } catch (e) {
            console.error(e);
        }
    };
    fetchData();
  }, []);
  const navItems = useMemo<NavItem[]>(
    () => [
      { href: "/calendar", label: "カレンダー" },
      { href: "/record", label: "グラフ" },
    ],
    []
  );
  return (
    <main style={{ padding: 16 }} className="max-w-[80%] mx-auto">
      <nav className="flex flex-wrap gap-8 text-lg font-medium">
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
      <div style={{ width: 550, height: 350, margin: "0 auto", marginTop: 16}}>
        <CategoryPieChart records={records} />
      </div>
    </main>
  );
}
export default Record;