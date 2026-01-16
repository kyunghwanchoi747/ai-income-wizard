'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ResultBox from '@/components/ResultBox';

export default function ShortsPage() {
  const [topic, setTopic] = useState('');
  const [hook, setHook] = useState('충격형');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic.trim()) {
      alert('쇼츠 주제를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/shorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, hook }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
      alert('생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const hookOptions = [
    { value: '충격형', label: '충격형', desc: '"이거 모르면 손해..."', icon: '😱' },
    { value: '질문형', label: '질문형', desc: '"왜 아무도 안 알려줄까?"', icon: '🤔' },
    { value: '비교형', label: '비교형', desc: '"A vs B 뭐가 좋을까?"', icon: '⚖️' },
    { value: '꿀팁형', label: '꿀팁형', desc: '"이것만 알면 끝"', icon: '💡' },
  ];

  return (
    <div className="min-h-screen">
      <Header title="쇼츠/릴스 대본 생성기" showBack />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            60초 안에 터지는 쇼츠 만들기
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                쇼츠 주제 *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 돈 버는 습관 3가지, 다이어트 실패하는 이유"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                후킹 스타일
              </label>
              <div className="grid grid-cols-2 gap-3">
                {hookOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setHook(option.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      hook === option.value
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{option.icon}</span>
                      <span className={`font-medium ${hook === option.value ? 'text-pink-700' : 'text-slate-700'}`}>
                        {option.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-pink-300 disabled:to-rose-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                쇼츠 대본 작성 중...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                쇼츠 대본 생성하기
              </>
            )}
          </button>
        </form>

        <ResultBox content={result} isLoading={isLoading} />
      </main>
    </div>
  );
}
