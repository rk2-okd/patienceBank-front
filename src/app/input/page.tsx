"use client";

import { useState } from 'react';
const Input = () => {
    const [patienceThing, setPatienceThing] = useState("");
    const [patienceTime, setPatienceTime] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        console.log("送信前", patienceThing, patienceTime);
        const timeNum = Number(patienceTime);
        try {
            const response = await fetch("http://localhost:8080/input", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                gaman_time: timeNum,
                gaman_thing: patienceThing,
                }),
            });

            if (!response.ok) throw new Error("送信に失敗しました");
            setMessage("送信が成功しました");
            setPatienceTime("");
            setPatienceThing("");
        } catch (error) {
            setMessage("送信中にエラーが発生しました");
            console.error("エラー:", error);
        }
    };
    return (
        <>
        <div className="w-screen justify-center items-center my-12">
            <div className="text-center mx-100 pt-14 border-4 border-primary rounded-3xl">
                <h2 className="text-4xl font-bold mb-24 text-text_green">なにを我慢しましたか？</h2>
                <div className="space-y-6">
                    <div className="flex items-center justify-center space-x-4">
                        <h4 className="text-lg text-text_green">体動かしたこと：</h4>
                        <input
                            type="text"
                            value={patienceThing}
                            onChange={(e) => setPatienceThing(e.target.value)}
                            className="text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="腕立て"/>
                    </div>
                    <div className='flex items-center justify-center'>
                        <h4 className="text-lg mr-8 text-text_green">時間：</h4>
                        <input
                            type="text"
                            value={patienceTime}
                            onChange={(e) => setPatienceTime(e.target.value)}
                            className="text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="5"/>
                        <p className='ml-1'>分</p>
                    </div>
                </div>
                <button
                    className="mt-16 mb-4 bg-primary hover:bg-primary text-white font-bold py-2 px-8 rounded"
                    type="button" onClick={handleSubmit}>追加
                </button>
            </div>
            <div className="text-center mt-8 text-lg font-bold text-text_green">{message}</div>
        </div>
        </>
    );
}

export default Input;