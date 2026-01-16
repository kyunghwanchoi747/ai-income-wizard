'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ResultBox from '@/components/ResultBox';

export default function HumanBlogPage() {
  const [topic, setTopic] = useState('');
  const [experience, setExperience] = useState('');
  const [emotion, setEmotion] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      alert('주제를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/human-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, experience, emotion }),
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
      <Header title="PRISM 휴먼 블로그" showBack />
      
      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-2">사람 냄새 나는 글쓰기 (PRISM)</h2>
          <p className="text-sm text-slate-500 mb-6">AI 티가 나지 않는, 공감 가는 글을 작성합니다.</p>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">글 주제 *</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 퇴사 후 첫 여행, 다이어트 실패담"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">나만의 경험 (Personal)</label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="예: 제주도 카페에서 귤라떼를 쏟았는데 직원이 웃으며 닦아줌..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500"
              />
              <p className="text-xs text-slate-400 mt-1">사소한 경험이라도 적어주면 훨씬 자연스러워집니다.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">느낀 감정 (Emotion)</label>
              <input
                type="text"
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                placeholder="예: 민망했지만 따뜻했음, 설레고 벅참"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-4 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white font-bold rounded-xl transition-all"
          >
            {isLoading ? '작가 모드로 집필 중...' : '감성 블로그 글 생성하기'}
          </button>
        </form>

        <ResultBox content={result} isLoading={isLoading} />
      </main>
    </div>
  );
}
