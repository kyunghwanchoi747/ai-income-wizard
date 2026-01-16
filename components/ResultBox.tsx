'use client';

import CopyButton from './CopyButton';

interface ResultBoxProps {
  content: string;
  isLoading?: boolean;
}

export default function ResultBox({ content, isLoading = false }: ResultBoxProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-slate-600 font-medium">AI가 생성 중입니다...</span>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6" />
          <div className="h-4 bg-slate-100 rounded animate-pulse w-4/6" />
          <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6" />
          <div className="h-4 bg-slate-100 rounded animate-pulse w-3/6" />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
        <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-slate-500">결과가 여기에 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">생성 결과</h3>
        <CopyButton text={content} />
      </div>
      <div className="prose prose-slate max-w-none">
        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}
