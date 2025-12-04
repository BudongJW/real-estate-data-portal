"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend,
} from "chart.js";
import RegionPicker from "@/components/RegionPicker";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

type Row = {
  contractYM: string;
  price_10k: number;
};

export default function Dashboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [si, setSi] = useState<string>("서울특별시");
  const [gu, setGu] = useState<string>("노원구");

  useEffect(() => {
    const q = new URLSearchParams({ si, gu, limit: "300" }).toString();
    fetch(`/api/transactions?${q}`).then(r => r.json()).then(setRows);
  }, [si, gu]);

  const byYM = rows.reduce<Record<string, number[]>>((acc, r) => {
    (acc[r.contractYM] ||= []).push(r.price_10k);
    return acc;
  }, {});
  const labels = Object.keys(byYM).sort();
  const avg = labels.map(l => Math.round(byYM[l].reduce((a, b) => a + b, 0) / byYM[l].length));

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold">지역별 월평균 매매가(만원)</h2>
      <RegionPicker si={si} setSi={setSi} gu={gu} setGu={setGu} />
      <div className="mt-6">
        <Line data={{
          labels: labels.map(l => `${l.slice(0,4)}-${l.slice(4)}`),
          datasets: [{ label: `${si} ${gu}`, data: avg }],
        }} />
      </div>
    </main>
  );
}
