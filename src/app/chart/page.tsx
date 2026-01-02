import CategoryPieChart from "../components/CategoryPieChart";

type ApiRecord = {
  trained_part: string;
  workout_duration: number;
  workout_date: string;
  user_id: number;
};

async function fetchRecords(): Promise<ApiRecord[]> {
  const res = await fetch("http://patienceBank_api:8080/graph", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch records");
  return res.json();
}

export default async function Page() {
  const records = await fetchRecords();

  return (
    <main style={{ padding: 16 }}>
      <div style={{ width: 700, height: 450, margin: "0 auto" }}>
        <CategoryPieChart records={records} />
      </div>
    </main>
  );
}
