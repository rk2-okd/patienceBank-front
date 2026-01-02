"use client";
import Body, { PART_LABELS_JA, type PartName } from "../components/Body";
import { useState } from "react";

const Input = () => {
  const [patienceThing, setPatienceThing] = useState("");
  const [patienceTime, setPatienceTime] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPart, setSelectedPart] = useState<PartName | null>(null);
  const timeOptions = [
    5,10,15,20,25,30,35,40,45,50,55,60
  ];

  const handleSubmit = async () => {
    const timeNum = Number(patienceTime);
    console.log("送信内容:", { patienceThing, patienceTime: timeNum });
    if (!patienceThing) {
      setMessage("鍛えた場所が選択されていません");
      return;
    }

    if (!patienceTime) {
      setMessage("時間を入力してください");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({
          gaman_time: timeNum,
          trained_part: patienceThing,
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
  };

  return (
    <div className="w-screen justify-center items-center my-12">
      <div className="text-center mx-100 pt-6 border-4 border-primary rounded-3xl">
        <h2 className="text-4xl font-bold mb-8 text-text_green">
          なにを我慢しましたか？
        </h2>

        <div className="flex flex-row items-center">
          <div className="basis-[45%]">
            <Body
              className="w-full h-[500px]"
              onSelect={(name) => {
                setSelectedPart(name);
                setPatienceThing(PART_LABELS_JA[name]); // ここでだけ更新
              }}
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
