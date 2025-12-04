export default function Page() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Real Estate Data Hub</h1>
      <p className="mt-2">실거래가·전세·가격지수 등 한국 부동산 데이터를 조회하고 시각화한다.</p>
      <div className="mt-6">
        <a className="text-blue-600 underline" href="/dashboard">대시보드로 이동</a>
      </div>
    </main>
  );
}
