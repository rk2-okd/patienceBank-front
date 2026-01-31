"use client";
import React from 'react';
import Link from 'next/link';
type LoginResponse = {
  message?: string;
};
const Login = () => {
    const [mailAddress, setMailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const handleSubmit = React.useCallback(
        async (e?: React.FormEvent) => {
            if (isSubmitting) return;
            setMessage("");
            if (!mailAddress || !password) {
                setMessage("メールアドレスとパスワードを入力してください");
                return;
            }
            setIsSubmitting(true);
            try {
                const res = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email: mailAddress,
                    password: password,
                }),
                });
                const data: LoginResponse = await res.json().catch(() => ({}));
                if (!res.ok) {
                setMessage(data?.message ?? "ログイン失敗");
                return;
                }
                setMessage("ログイン成功");
                window.location.href = "/input";
                // ここで遷移したいなら router.push("/mypage") 等にする（あなたの方針次第）
            } catch {
                setMessage("通信エラー");
            } finally {
                setIsSubmitting(false);
            }
        },
        [mailAddress, password, isSubmitting]
    );
    const guestSubmit = React.useCallback(
        async (e?: React.FormEvent) => {
            if (isSubmitting) return;
            setMessage("");
            setIsSubmitting(true);
            try {
                const res = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email: "guest@example.com",
                    password: "guest_password",
                }),
                });
                const data: LoginResponse = await res.json().catch(() => ({}));
                if (!res.ok) {
                setMessage(data?.message ?? "ログイン失敗");
                return;
                }
                setMessage("ログイン成功");
                window.location.href = "/input";
            } catch {
                setMessage("通信エラー");
            } finally {
                setIsSubmitting(false);
            }
        },
        [mailAddress, password, isSubmitting]
    );
    return (
        <div className="w-screen min-h-screen justify-center items-center my-32 text-center">
            <div className="text-center mx-100 pt-14 border-4 border-primary rounded-3xl">
                <h2 className="text-4xl font-bold mb-24 text-text_green">ログイン</h2>
                <div className="flex justify-center">
                    <div className="grid grid-cols-[160px_1fr] gap-y-8 justify-items-start">
                        <p className="text-lg text-text_green font-bold">メールアドレス：</p> 
                        <input
                            type="text"
                            value={mailAddress}
                            onChange={(e) => setMailAddress(e.target.value)}
                            className="text-base border border-gray-300 rounded px-2 py-1 bg-white"
                            placeholder="a@a.com"/>
                        <p className="text-lg mr-6 text-text_green font-bold">パスワード：</p>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}   
                            className="text-base border border-gray-300 rounded px-2 py-1  bg-white"
                            placeholder="password"/>
                    </div>
                </div>
                <button
                    className="mt-16 mb-4 bg-primary hover:bg-primary text-white font-bold py-2 px-8 rounded"
                    type="button" onClick={handleSubmit}>ログイン
                </button>
                {message && (
                    <p className="mt-4 text-red-500 font-bold">{message}</p>
                )}
            </div>
            <button
                className="mt-10 bg-secondary hover:bg-secondary text-white font-bold py-2 px-8 rounded"
                type="button" onClick={guestSubmit}>ゲストログイン
            </button>
            <Link href="/signup" className='font-bold text-yellow-500 text-2xl'>新規登録はこちら</Link>
        </div>
    );
}
export default Login;