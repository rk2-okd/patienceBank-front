"use client";
import Body, { PART_LABELS_JA, type PartName } from "../components/Body";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const Input = () => {
  const [patienceThing, setPatienceThing] = useState("");
  const [patienceTime, setPatienceTime] = useState("");
  const [message, setMessage] = useState("");
  const [userid, setUserid] = useState("");
  const router = useRouter();
  const [selectedPart, setSelectedPart] = useState<PartName | null>(null);
  const timeOptions =  useMemo(() => 
    [5,10,15,20,25,30,35,40,45,50,55,60],
    []
  );
  const handleSelectPart = useCallback((name: PartName) => {
    setSelectedPart(name);
    setPatienceThing(PART_LABELS_JA[name]);
    setMessage("");
  }, []);
  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:8080/me", {
        credentials: "include",
      });
      if (res.status === 401) router.push("/login");
      const { id }: { id: number } = await res.json();
      setUserid(id.toString());
    })();
  }, []);
  const handleSubmit = useCallback(async () => {
    if (!selectedPart) {
      setMessage("鍛えた場所が選択されていません");
      return;
    }
    if (!patienceTime) {
      setMessage("時間を選択してください");
      return;
    }
    const timeNum = Number(patienceTime);
    if (!Number.isFinite(timeNum) || timeNum <= 0) {
      setMessage("時間が不正です");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          workout_duration: timeNum,
          trained_part: PART_LABELS_JA[selectedPart],
        }),
      });
      if (!response.ok) throw new Error("送信に失敗しました");
      setMessage("送信が成功しました");
      setPatienceTime("");
      setPatienceThing("");
      setSelectedPart(null);
    } catch (error) {
      setMessage("送信中にエラーが発生しました");
      console.error("エラー:", error);
    }
  }, [patienceTime, selectedPart]);
  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPatienceTime(e.target.value);
    },
    []
  );
  return (
    <div className="w-screen justify-center items-center my-12">
      <div className="text-center mx-100 pt-6 border-4 border-primary rounded-3xl">
        <h2 className="text-4xl font-bold mb-8 text-text_green">
          なにを我慢しましたか？
        </h2>
        <div className="flex flex-row items-center">
          <div className="basis-[45%] my-3">
            <Body
              heightVh={70}
              onSelect={handleSelectPart}
              selectedPart={selectedPart}
            />
          </div>
          <div className="basis-[55%]">
            <div className="space-y-6">
              <div className="flex space-x-4 items-center">
                <h4 className="text-lg text-text_green">鍛えた場所：</h4>
                <input
                  type="text"
                  value={patienceThing}
                  readOnly
                  className="text-base border border-gray-300 rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
                  placeholder="モデルをタップして選択"
                />
              </div>
              <div className="flex space-x-4 items-center">
                <h4 className="text-lg text-text_green ml-13">時間：</h4>
                <select
                  value={patienceTime}
                  onChange={(e) => setPatienceTime(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="">選択してください</option>
                  {timeOptions.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <p className="ml-1">分</p>
              </div>
              <button
                className="mr-28 mt-10 bg-primary hover:bg-primary text-white font-bold py-2 px-8 rounded"
                type="button"
                onClick={handleSubmit}
              >
                追加
              </button>
            </div>
            <div className="text-center mt-8  mr-24 text-lg font-bold text-red-600">
              {message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Input;
