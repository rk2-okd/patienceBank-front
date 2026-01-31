"use client";
import { useState,useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";

type UserDataResponse = {
  id: number;
  username: string;
  email: string;
  goal: string;
  auth_provider: string;
};
const Mypage = () => {
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [goal, setGoal] = useState("");
    const [message, setMessage] = useState("ユーザ情報取得中です");
    const router = useRouter();
    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault();
            try {
                const res = await fetch("http://localhost:8080/logout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                setMessage("ログアウトしたため画面が切り替わります。")
                if (!res.ok) {
                    throw new Error("ログアウト失敗");
                }
                window.location.href = "/";
            } catch (err) {
                console.error(err);
                alert("ログアウトに失敗しました");
            }
        }, []
    );
    const handleTarget= useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault();
            try {
                console.log("sending goal:", JSON.stringify(goal));
                const res = await fetch("http://localhost:8080/goalsetting", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        goal: goal,
                    }),
                });
                setMessage("目標変更完了しました。")
                if (!res.ok) {
                    throw new Error("目標変更失敗");
                }
            } catch (err) {
                console.error(err);
                alert("目標変更に失敗しました");
            }
        }, [goal]
    );
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8080/getUser", {
                    credentials: "include",
                });
                if (res.status === 401) {
                    router.push("/login");
                    return;
                }
                if (!res.ok) throw new Error("データ取得失敗");
                const data: UserDataResponse = await res.json();
                setId(data.id.toString());
                setUsername(data.username);
                setEmail(data.email);
                setGoal(data.goal);
                setMessage("ようこそ、マイページへ！");
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, [setGoal]);
    return (
        <div className="w-screen justify-center [background-image:var(--bg-gradient)] py-6">
            <div className="text-center mx-100">
                <h2 className="text-4xl font-bold text-text_green mb-10">マイページ</h2>
                <div className="space-y-6">
                    <h4 className="text-lg text-text_green font-bold mb-8">{message}</h4>
                    <div className="ml-52 space-y-4 text-left">
                        <div className="grid grid-cols-[160px_1fr] gap-y-4 justify-items-start mr-10">
                            <p className="text-text_green">ユーザー名:</p>
                            <p className="text-text_green">{username}</p>
                            <p className="text-text_green">メールアドレス:</p>
                            <p className="text-text_green">{email}</p>
                            <p className="text-text_green">目標:</p>
                            <div className="flex items-center">
                                <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder='20文字以内'
                                    className="text-text_green border border-bg-primary bg-transparent px-2" />
                                <button className="ml-4 bg-primary hover:text-text_green text-white font-bold py-1 px-3 rounded" onClick={handleTarget}>変更</button>
                            </div>
                            
                        </div>
                    </div>
                    <button type="button" onClick={handleSubmit}
                        className="mt-10 mb-4 bg-primary hover:text-text_green text-white font-bold py-2 px-8 rounded"
                    >ログアウト
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Mypage;