import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 올인원 수익화 도구",
  description: "상품 소싱, 상세페이지, 블로그 글을 AI로 자동 생성하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {children}
      </body>
    </html>
  );
}
