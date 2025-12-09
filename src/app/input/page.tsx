"use client";

import { useState } from 'react';
const input = () => {
    const [patienceMoney, patienceSetmoney] = useState('');
    const [patienceTimes, patienceSetTimes] = useState('');
    return (
        <>
        <div className="w-screen justify-center items-center my-12">
            <div className="text-center mx-100 pt-14 border-2 border-black rounded-3xl">
                <h2 className="text-4xl font-bold mb-24">なにを我慢しましたか？</h2>
                <div className="space-y-6">
                    <div className="flex items-center justify-center space-x-4">
                        <h4 className="text-lg">我慢したこと：</h4>
                        <input
                            type="text"
                            value={patienceMoney}
                            onChange={(e) => patienceSetmoney(e.target.value)}
                            className="text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="例）ラーメン"/>
                    </div>
                    <div className='flex items-center justify-center'>
                        <h4 className="text-lg mr-8">我慢したお金：</h4>
                        <input
                            type="text"
                            value={patienceTimes}
                            onChange={(e) => patienceSetTimes(e.target.value)}
                            className="text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="200"/>
                        <p className='ml-1'>円</p>
                    </div>
                </div>
                <button className="mt-16 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded">追加</button>
            </div>
        </div>
        </>
    );
}

export default input;