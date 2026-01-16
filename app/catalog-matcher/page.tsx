'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ResultBox from '@/components/ResultBox';

export default function CatalogMatcherPage() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [lowestPrice, setLowestPrice] = useState('');
  
  const [calcResult, setCalcResult] = useState<{
    targetPrice: number;
    margin: number;
    marginRate: string;
    fee: number;
  } | null>(null);
  
  const [aiResult, setAiResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword || !wholesalePrice || !lowestPrice) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setCalcResult(null);
    setAiResult('');

    try {
      const response = await fetch('/api/catalog-matcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, category, wholesalePrice, lowestPrice }),
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      setCalcResult(data.calculation);
      setAiResult(data.aiResult);
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="카탈로그 매칭 킬러" showBack />
      
      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">최저가 매칭 전략 계산기</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">카테고리</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="예: 생활용품"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">핵심 키워드 (모델명)</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="예: 3M 고무장갑"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">도매 공급가 (원)</label>
                <input
                  type="number"
                  value={wholesalePrice}
                  onChange={(e) => setWholesalePrice(e.target.value)}
                  placeholder="예: 5000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">경쟁사 최저가 (원)</label>
                <input
                  type="number"
                  value={lowestPrice}
                  onChange={(e) => setLowestPrice(e.target.value)}
                  placeholder="예: 8900"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-colors"
          >
            {isLoading ? '전략 분석 중...' : '매칭 전략 분석하기'}
          </button>
        </form>

        {calcResult && (
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-6 rounded-2xl text-center border border-blue-100">
              <div className="text-sm text-blue-600 mb-1">추천 판매가</div>
              <div className="text-2xl font-bold text-blue-900">
                {calcResult.targetPrice.toLocaleString()}원
              </div>
              <div className="text-xs text-blue-400 mt-1">최저가 -50원</div>
            </div>
            <div className="bg-green-50 p-6 rounded-2xl text-center border border-green-100">
              <div className="text-sm text-green-600 mb-1">예상 마진</div>
              <div className="text-2xl font-bold text-green-900">
                +{calcResult.margin.toLocaleString()}원
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-2xl text-center border border-purple-100">
              <div className="text-sm text-purple-600 mb-1">마진율</div>
              <div className="text-2xl font-bold text-purple-900">
                {calcResult.marginRate}%
              </div>
            </div>
          </div>
        )}

        <ResultBox content={aiResult} isLoading={isLoading} />
      </main>
    </div>
  );
}
