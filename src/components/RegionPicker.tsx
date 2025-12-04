"use client";

const siList = ["서울특별시","경기도","인천광역시"]; // 초기 하드코딩, 추후 DB로 대체
const guMap: Record<string,string[]> = {
  "서울특별시": ["노원구","강남구","강서구","양천구"],
  "경기도": ["과천시","성남시 분당구","용인시 수지구"],
  "인천광역시": ["연수구","남동구"],
};

export default function RegionPicker({
  si, setSi, gu, setGu,
}: { si: string; setSi: (v:string)=>void; gu: string; setGu:(v:string)=>void }) {
  const guList = guMap[si] || [];
  return (
    <div className="flex gap-3 mt-4">
      <select className="border rounded px-2 py-1" value={si} onChange={(e)=>{ setSi(e.target.value); setGu(""); }}>
        {siList.map(s => (<option key={s} value={s}>{s}</option>))}
      </select>
      <select className="border rounded px-2 py-1" value={gu} onChange={(e)=>setGu(e.target.value)}>
        {guList.map(g => (<option key={g} value={g}>{g}</option>))}
      </select>
    </div>
  );
}
