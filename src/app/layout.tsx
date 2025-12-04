import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate Data Hub",
  description: "한국 부동산 데이터 공유/시각화 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
