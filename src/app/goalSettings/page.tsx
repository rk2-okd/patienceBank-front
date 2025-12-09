"use client";
import { useState,useEffect } from 'react';
const GoalSettings = () => {
    const [money, setMoney] = useState(0);
    const [times, setTimes] = useState(0);
    const [message, setMessage] = useState('');
    const handleSubmit = async () => {

        if (isNaN(money) || isNaN(times)) {
            setMessage('有効な数値を入力してください');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/goalsettings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    goal_money: money,
                    goal_count: times,
                }),
            });

            if (!response.ok) {
            throw new Error('送信に失敗しました');
            }

            const result = await response.json();
            setMessage('送信が成功しました');
            // 🎯 入力欄をクリア
            setMoney(0);
            setTimes(0);


            console.log('送信成功:', result);
        } catch (error) {
            setMessage('送信中にエラーが発生しました');
            console.error('エラー:', error);
        }
    };
    
    return (
        <>
        <div className="w-screen justify-center items-center my-8 ">
            <div className="text-center mx-100 py-8 border-2 border-black rounded-3xl">
                <div className="my-6 mb-20">
                    <h2 className="text-5xl font-bold">~今週の目標~</h2>
                </div>
                <div className="mb-2 space-y-2">
                    <div className="flex justify-center space-x-8">
                        <p className="text-2xl font-bold">我慢回数：</p>
                        <input
                            type="number"
                            value={money}
                            onChange={(e) => setMoney(Number(e.target.value))}
                            className="text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="例）3"/>
                        <p className="text-2xl font-bold">回</p>
                    </div>
                    <div className="flex  justify-center space-x-8">
                        <p className="text-2xl font-bold">合計金額：</p>
                        <input
                            type="number"
                            value={times}
                            onChange={(e) => setTimes(Number(e.target.value))}
                            className="text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1000"
                            />
                        <p className="text-2xl font-bold">円</p>
                    </div>
                </div>
                <button 
                    onClick={handleSubmit}
                    className="mt-32 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded">送信</button>
                {message && (<p className="mt-4 text-xl font-semibold text-green-600">{message}</p>)}
            </div>
        </div>
        </>
    );
}

export default GoalSettings;

