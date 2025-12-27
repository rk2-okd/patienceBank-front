"use client";
import Body, { PART_LABELS_JA, type PartName } from "../components/Body";
import { useState } from "react";

const list = [
  "体感","背骨", "顔","首","背中","お腹","肩","二の腕","腕（ひじ下）",
   "手","おしり","太もも","内もも","ふくらはぎ","足",
];
const Input = () => {
    const [patienceThing, setPatienceThing] = useState("");
    const [patienceTime, setPatienceTime] = useState("");
    const [message, setMessage] = useState("");
    const [selectedPart, setSelectedPart] = useState<PartName | null>(null);
    const [value, setValue] = useState('');
    const filtered = list.filter(item =>
        item.includes(value)
    );
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
            <div className="text-center mx-100 pt-6 border-4 border-primary rounded-3xl">
                <h2 className="text-4xl font-bold mb-8 text-text_green">なにを我慢しましたか？</h2>
                <div className="flex flex-row items-center">
                    <div className="basis-[45%]">
                        <Body
                        className="w-full h-[500px]"
                        onSelect={(name) => {
                            setSelectedPart(name);
                            setPatienceThing(PART_LABELS_JA[name]);
                        }}
                        selectedPart={selectedPart}
                        />
                    </div>
                    <div className="basis-[55%]">
                        <div className="space-y-6">
                            <div className="flex space-x-4">
                                <h4 className="text-lg text-text_green">鍛えた場所：</h4>
                                <input
                                    type="text"
                                    value={patienceThing}
                                    onChange={(e) => setPatienceThing(e.target.value)}
                                    className="text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="腕立て"/>
                                    {value && (
                                        <ul className="absolute z-10 w-full border bg-white">
                                        {filtered.map(item => (
                                            <li
                                            key={item}
                                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => setValue(item)}
                                            >
                                            {item}
                                            </li>
                                        ))}
                                        </ul>
                                    )}   
                            </div>
                            <div className='flex space-x-4'>
                                <h4 className="text-lg text-text_green ml-13">時間：</h4>
                                <input
                                    type="text"
                                    value={patienceTime}
                                    onChange={(e) => setPatienceTime(e.target.value)}
                                    className="w-12 text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="5"/>
                                <p className='ml-1'>分</p>
                            </div>
                            <button
                                className="mr-28 mt-10 bg-primary hover:bg-primary text-white font-bold py-2 px-8 rounded"
                                type="button" onClick={handleSubmit}>追加
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center mt-8 text-lg font-bold text-text_green">{message}</div>
        </div>
        </>
    );
}

export default Input;