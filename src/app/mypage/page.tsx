"use client";
import { useState,useEffect } from 'react';

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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8080/getUser", {
                    credentials: "include",
                });
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
                <h2 className="text-4xl font-bold mb-24 text-text_green">マイページ</h2>
                <div className="space-y-6">
                    <h4 className="text-lg text-text_green font-bold">ようこそ、マイページへ！</h4>
                    <div className="text-left mx-48 space-y-4">
                        <p className="text-text_green">ユーザーID: {id}</p>
                        <p className="text-text_green">ユーザー名: {username}</p>
                        <p className="text-text_green">メールアドレス: {email}</p>
                        <p className="text-text_green">コメント: {comment}</p>
                        <p className="text-text_green">認証プロバイダー: {authProvider}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Mypage;