"use client";

import { useState,useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [records, setRecords] = useState<{ gaman_thing: string; gaman_money: number }[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  ;
  useEffect(() => {
    if (!selectedDate) return;
  
    const fetchHistory = async () => {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      try {
        const res = await fetch(`http://localhost:8080/history?days=${formattedDate}`);
        if (!res.ok) throw new Error('データ取得失敗');
        const data = await res.json();
        setRecords(data);
        const total = data.reduce((sum: number, r: any) => sum + r.gaman_money, 0);
        setTotalAmount(total);
      } catch (err) {
        console.error(err);
        setRecords([]);
        setTotalAmount(0);
      }
    };

    fetchHistory();
  }, [selectedDate]);


  return (
    <div className="flex w-screen flex-col justify-center items-center my-8">
      <div className="text-center mx-auto w-3/4">
        <h2 className="text-4xl font-bold mb-8 mr-8">カレンダー</h2>
        <div className="flex justify-center space-x-8 mr-12">
          <div className="w-1xl px-12 py-8 border-2 border-black rounded-3xl bg-white">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            required
            className="mx-auto text-lg"
            modifiersClassNames={{
              selected: 'bg-blue-500 text-white',
              today: 'border border-blue-500',
            }}
          />
          </div>

          {selectedDate && (
            <div className="w-84 px-4 pt-6 pb-3 border-2 border-black rounded-3xl bg-white flex flex-col">
              <h3 className="px-4 font-bold text-1g text-left">
                選択した日付:{' '}
                <span className=" text-cyan-800">
                  {selectedDate.toLocaleDateString('ja-JP')}
                </span>
              </h3>

              <div className='space-y-6 mt-10 px-4'>
                {records.length > 0 ? (
                  records.map((r, i) => (
                    <div key={i}>
                      <p>我慢内容：{r.gaman_thing}</p>
                      <p className='text-right'>金額：{r.gaman_money}円</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">記録がありません</p>
                )}
              </div>

              <div className='ml-8 flex space-x-4 mt-auto text-emerald-800 font-bold'>
                <p>合計回数:{records.length}回</p>
                <p>合計金額:{totalAmount}円</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;