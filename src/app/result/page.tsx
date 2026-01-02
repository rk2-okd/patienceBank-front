"use client";
import { useState, useEffect } from "react";
import { FaXTwitter } from "react-icons/fa6";

type LastWeekResponse = {
  count: number;
  total: number;
  start: string;
  end: string;
};

type GoalResponse = {
  goal_money: number;
  goal_count: number;
};

const Result = () => {
  const [goal, setGoal] = useState("");
  const [count, setCount] = useState(0);
  const [money, setMoney] = useState(0);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("ja-JP");
  };

  useEffect(() => {
    const fetchLastWeekData = async () => {
      try {
        const res = await fetch("http://localhost:8080/lastweek", {
            credentials: "include",
        });
        if (!res.ok) throw new Error("データ取得失敗");
        const data: LastWeekResponse = await res.json();

        setCount(data.count);
        setMoney(data.total);
        setStart(data.start);
        setEnd(data.end);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchGoal = async () => {
      try {
        const res = await fetch("http://localhost:8080/getGoal", {
            credentials: "include",
        });
        if (!res.ok) throw new Error("目標取得失敗");
        const data: GoalResponse = await res.json();

        const text = `目標回数：${data.goal_count}回 / 目標金額：${data.goal_money.toLocaleString()}円`;
        setGoal(text);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLastWeekData();
    fetchGoal();
  }, []);

  const createTweetText = () => {
    const period = `${formatDate(start)} 〜 ${formatDate(end)}`;
    const moneyText = money.toLocaleString("ja-JP");

    return [
      "【がまんBank 先週の結果】",
      `期間：${period}`,
      `我慢回数：${count}回`,
      `我慢結果：${moneyText}円 貯まった！`,
      "#がまんBank",
    ].join("\n");
  };

  const handleTweet = () => {
    const text = createTweetText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-screen flex justify-center items-center my-22">
      <div
        className="
          text-center
          w-full
          max-w-3xl
          mx-4
          py-6
          border-2
          border-black
          rounded-3xl
        "
      >
        <div className="my-4 mb-10">
          <h2 className="text-5xl font-bold">~先週の結果~</h2>
          <div className="flex justify-center space-x-8">
            <p className="mt-2 text-xl">
              日付：{formatDate(start)} 〜 {formatDate(end)}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-8">目標：{goal}</h2>
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex justify-center">
            <p className="text-2xl font-bold">我慢回数：{count}</p>
            <p className="text-2xl font-bold">回</p>
          </div>
          <div className="flex justify-center">
            <p className="text-2xl font-bold">合計金額：{money}</p>
            <p className="text-2xl font-bold">円</p>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleTweet}
            className="
              px-6
              py-2
              rounded-full
              border
              border-black
              text-xl
              font-semibold
              hover:bg-gray-100
              flex
              items-center
              justify-center
              space-x-2
            "
          >
            <FaXTwitter className="w-6 h-6" />
            <span>に結果をシェア</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
