'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import CopyButton from '@/components/CopyButton';

interface KeywordResult {
  keyword: string;
  monthlySearches: {
    pc: number;
    mobile: number;
    total: number;
  };
  competition: string;
  trend: string;
}

interface TrendData {
  keyword: string;
  data: Array<{ period: string; ratio: number }>;
}

interface AnalysisResult {
  keywords: KeywordResult[];
  trends: TrendData[];
  relatedKeywords: string[];
  analysis: string;
}

export default function KeywordAnalyzer() {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword.trim()) {
      alert('키워드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch('/api/keyword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setError('분석 중 오류가 발생했습니다. API 키 설정을 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (!num) return '-';
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen">
      <Header title="키워드 분석 도구" showBack />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            분석할 키워드를 입력하세요
          </h2>

          <div className="flex gap-3">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 무선이어폰, 캠핑용품, 강아지간식"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  분석중
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  분석하기
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-slate-500 mt-3">
            * 네이버 검색광고 API가 연결되면 실제 검색량 데이터가 표시됩니다
          </p>
        </form>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-red-700">
            {error}
          </div>
        )}

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">키워드 데이터를 분석하고 있습니다...</p>
          </div>
        )}

        {/* 결과 표시 */}
        {result && !isLoading && (
          <div className="space-y-6">
            {/* 검색량 데이터 */}
            {result.keywords && result.keywords.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">검색량 분석</h3>
                  <CopyButton text={result.keywords.map(k =>
                    `${k.keyword}: 월간 ${formatNumber(k.monthlySearches.total)}회`
                  ).join('\n')} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">키워드</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700">PC 검색</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700">모바일 검색</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700">총 검색량</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-700">경쟁도</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.keywords.map((kw, index) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium text-slate-800">{kw.keyword}</td>
                          <td className="py-3 px-4 text-right text-slate-600">{formatNumber(kw.monthlySearches.pc)}</td>
                          <td className="py-3 px-4 text-right text-slate-600">{formatNumber(kw.monthlySearches.mobile)}</td>
                          <td className="py-3 px-4 text-right font-semibold text-orange-600">{formatNumber(kw.monthlySearches.total)}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              kw.competition === '높음' ? 'bg-red-100 text-red-700' :
                              kw.competition === '중간' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {kw.competition}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 연관 키워드 */}
            {result.relatedKeywords && result.relatedKeywords.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">연관 키워드</h3>
                  <CopyButton text={result.relatedKeywords.join(', ')} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.relatedKeywords.map((kw, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-700 cursor-pointer transition-colors"
                      onClick={() => setKeyword(kw)}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI 분석 */}
            {result.analysis && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">AI 분석 리포트</h3>
                  <CopyButton text={result.analysis} />
                </div>
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {result.analysis}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 빈 상태 */}
        {!result && !isLoading && !error && (
          <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-slate-500 mb-2">키워드를 입력하면</p>
            <p className="text-slate-500">검색량, 트렌드, 연관 키워드를 분석해드립니다</p>
          </div>
        )}
      </main>
    </div>
  );
}
