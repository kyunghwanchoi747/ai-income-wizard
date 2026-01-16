'use client';

import Link from 'next/link';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function Header({ title = "AI 올인원 수익화 도구", showBack = false }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
        {showBack && (
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">뒤로</span>
          </Link>
        )}
        <h1 className="text-xl font-bold text-slate-800 flex-1">
          {showBack ? title : (
            <Link href="/" className="hover:text-blue-600 transition-colors">
              {title}
            </Link>
          )}
        </h1>
      </div>
    </header>
  );
}
