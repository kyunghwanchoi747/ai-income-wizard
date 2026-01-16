'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ResultBox from '@/components/ResultBox';

export default function YoutubeScriptPage() {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('5분');
  const [style, setStyle] = useState('정보형');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic.trim()) {
      alert('영상 주제를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, duration, style }),
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

  const durationOptions = [
    { value: '3분', label: '3분 (숏폼)' },
    { value: '5분', label: '5분 (일반)' },
    { value: '10분', label: '10분 (롱폼)' },
    { value: '15분', label: '15분+ (심층)' },
  ];

  const styleOptions = [
    { value: '정보형', label: '정보형', desc: '유익한 정보 전달' },
    { value: '리뷰형', label: '리뷰형', desc: '제품/서비스 리뷰' },
    { value: '브이로그', label: '브이로그', desc: '일상 공유 스타일' },
    { value: '튜토리얼', label: '튜토리얼', desc: '단계별 설명' },
  ];

  return (
    <div className="min-h-screen">
      <Header title="유튜브 스크립트 생성기" showBack />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            어떤 유튜브 영상을 만들까요?
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                영상 주제 *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 스마트스토어 초보자 가이드, 다이어트 식단 추천"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                영상 길이
              </label>
              <div className="flex flex-wrap gap-2">
                {durationOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDuration(option.value)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      duration === option.value
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                영상 스타일
              </label>
              <div className="grid grid-cols-2 gap-3">
                {styleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStyle(option.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      style === option.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`font-medium ${style === option.value ? 'text-red-700' : 'text-slate-700'}`}>
                      {option.label}
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
            className="w-full mt-6 py-4 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                스크립트 작성 중...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                스크립트 생성하기
              </>
            )}
          </button>
        </form>

        <ResultBox content={result} isLoading={isLoading} />
      </main>
    </div>
  );
}
