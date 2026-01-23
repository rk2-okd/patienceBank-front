"use client";
import { useState,useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";

type UserDataResponse = {
  id: number;
  username: string;
  email: string;
  comment: string;
  auth_provider: string;
};
const Mypage = () => {
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [comment, setComment] = useState("");
    const [authProvider, setAuthProvider] = useState("");
    const [message, setMessage] = useState("");
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
        },[]
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
                setComment(data.comment);
                setAuthProvider(data.auth_provider);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);
    return (
        <div className="w-screen justify-center items-center my-12 text-center">
            <div className="text-center mx-100 pt-14 border-4 border-primary rounded-3xl">
                <p className="text-text-gray font-bold mb-4">{message}</p>
                <h2 className="text-4xl font-bold mb-24 text-text_green">マイページ</h2>
                <div className="space-y-6">
                    <h4 className="text-lg text-text_green font-bold">ようこそ、マイページへ！</h4>
                    <div className="text-left mx-48 space-y-4">
                        <p className="text-text_green">ユーザー名: {username}</p>
                        <p className="text-text_green">メールアドレス: {email}</p>
                        <p className="text-text_green">コメント: {comment}</p>
                        <button
                            className="mt-16 mb-4 bg-primary hover:bg-primary text-white font-bold py-2 px-8 rounded"
                            type="button" onClick={handleSubmit}>ログアウト
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Mypage;