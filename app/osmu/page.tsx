'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ResultBox from '@/components/ResultBox';

export default function OSMUPage() {
  const [content, setContent] = useState('');
  const [tone, setTone] = useState('친근하고 트렌디하게');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('변환할 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/osmu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, tone }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="콘텐츠 멀티플라이어 (OSMU)" showBack />
      
      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">소스 하나로 모든 SNS 정복하기</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">원본 내용 (블로그 글, 대본 등)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="여기에 내용을 붙여넣으세요..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-pink-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">원하는 톤앤매너</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-pink-500"
              >
                <option value="친근하고 트렌디하게">친근하고 트렌디하게 (인스타 감성)</option>
                <option value="전문적이고 신뢰감 있게">전문적이고 신뢰감 있게</option>
                <option value="유머러스하고 재치있게">유머러스하고 재치있게</option>
                <option value="감성적이고 차분하게">감성적이고 차분하게</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-pink-300 disabled:to-purple-300 text-white font-bold rounded-xl transition-all"
          >
            {isLoading ? '멀티 콘텐츠로 변환 중...' : '3가지 플랫폼용으로 변환하기'}
          </button>
        </form>

        <ResultBox content={result} isLoading={isLoading} />
      </main>
    </div>
  );
}
