"use client";
import { useState,useEffect } from 'react';
import Link from 'next/link';
const Login = () => {
    const [mailAddress, setMailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const handleSubmit = async () => {
        setMessage("");
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

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
            setMessage(data?.message ?? "ログイン失敗");
            return;
            }

            setMessage("ログイン成功");
            // ここで router.push("/") とかは好きに
        } catch (e) {
            setMessage("通信エラー");
        }
    };
    return (
        <div className="w-screen justify-center items-center my-12 text-center">
            <div className="text-center mx-100 pt-14 border-4 border-primary rounded-3xl">
                <h2 className="text-4xl font-bold mb-24 text-text_green">ログイン</h2>
                <div className="space-y-6">
                    <div className="flex items-center justify-center space-x-4">
                        <h4 className="text-lg text-text_green font-bold">メールアドレス：</h4> 
                        <input
                            type="text"
                            value={mailAddress}
                            onChange={(e) => setMailAddress(e.target.value)}
                            className="text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="a@a.com"/>
                    </div>
                    <div className='flex items-center justify-center'>
                        <h4 className="text-lg mr-6 text-text_green font-bold">パスワード：</h4>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}   
                            className="text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <Link href="/signup" className='font-bold text-yellow-500 text-2xl'>新規登録はこちら</Link>
        </div>
    );
}
export default Login;