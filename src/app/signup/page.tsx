"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [mailAddress, setMailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setMessage("");
    try {

      const res = await fetch("http://localhost:8080/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userName,
          email: mailAddress,
          password: password,
        }),
      });
      if (!res.ok) {
        setMessage("登録に失敗しました");
        return;
      }
      const loginRes = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: mailAddress,
          password: password,
        }),
      });
      if (!loginRes.ok) {
        setMessage("登録はできたけどログインに失敗しました");
        return;
      }
      setMessage("登録・ログイン成功");
      router.push("/mypage"); // 好きな遷移先に
    } catch (e) {
      console.error(e);
      setMessage("通信エラー");
    }
  };

  return (
    <div className="w-screen justify-center items-center my-12 text-center">
      <div className="text-center mx-100 pt-14 border-4 border-primary rounded-3xl">
        <h2 className="text-4xl font-bold mb-24 text-text_green">新規登録</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <h4 className="text-lg text-text_green font-bold">ユーザーネーム：</h4>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ユーザー名"
            />
          </div>
          <div className="flex items-center justify-center space-x-4">
            <h4 className="text-lg text-text_green font-bold">メールアドレス：</h4>
            <input
              type="text"
              value={mailAddress}
              onChange={(e) => setMailAddress(e.target.value)}
              className="text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="a@a.com"
            />
          </div>

          <div className="flex items-center justify-center">
            <h4 className="text-lg mr-6 text-text_green font-bold">パスワード：</h4>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="password"
            />
          </div>
        </div>
        {message && <p className="mt-6 text-text_green font-bold">{message}</p>}
        <button
          className="mt-16 mb-4 bg-primary hover:bg-primary text-white font-bold py-2 px-8 rounded"
          type="button"onClick={handleSubmit}>登録</button>
      </div>
      <Link href="/login" className="font-bold text-yellow-500 text-2xl">登録済の方はこちら</Link>
    </div>
  );
};

export default SignUp;
