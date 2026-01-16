'use client';

import { useState } from 'react';
import Header from '@/components/Header';

// 카테고리 데이터
const categories = [
  { id: 'kitchen', name: '주방용품', icon: '🍳', keywords: ['실리콘', '스테인리스', '친환경', '미니멀'] },
  { id: 'beauty', name: '뷰티', icon: '💄', keywords: ['자연유래', '비건', '저자극', '프리미엄'] },
  { id: 'baby', name: '육아용품', icon: '👶', keywords: ['안전인증', '유기농', '무독성', '교육용'] },
  { id: 'pet', name: '반려동물', icon: '🐕', keywords: ['강아지', '고양이', '자연원료', '기능성'] },
  { id: 'interior', name: '인테리어', icon: '🏠', keywords: ['모던', '북유럽', '빈티지', '미니멀'] },
  { id: 'fashion', name: '패션잡화', icon: '👜', keywords: ['캐주얼', '오피스룩', '트렌디', '베이직'] },
  { id: 'health', name: '건강식품', icon: '💊', keywords: ['유기농', '비타민', '프로바이오틱스', '천연'] },
  { id: 'digital', name: '디지털/가전', icon: '📱', keywords: ['가성비', '프리미엄', '무선', '스마트'] },
];

// 스타일 옵션
const styleOptions = [
  { id: 'premium', name: '프리미엄', desc: '고급스럽고 품격있는 느낌' },
  { id: 'casual', name: '캐주얼', desc: '친근하고 편안한 느낌' },
  { id: 'minimal', name: '미니멀', desc: '깔끔하고 심플한 느낌' },
  { id: 'trendy', name: '트렌디', desc: '최신 트렌드 반영' },
];

// 타겟 연령대
const targetAges = [
  { id: '20s', name: '20대', desc: 'MZ세대, 트렌드에 민감' },
  { id: '30s', name: '30대', desc: '실용성과 품질 중시' },
  { id: '40s', name: '40~50대', desc: '신뢰와 가성비 중시' },
  { id: 'all', name: '전연령', desc: '폭넓은 타겟' },
];

// 가격대
const priceRanges = [
  { id: 'low', name: '1만원 이하', desc: '가성비 상품' },
  { id: 'mid', name: '1~3만원', desc: '중저가 상품' },
  { id: 'high', name: '3~5만원', desc: '중고가 상품' },
  { id: 'premium', name: '5만원 이상', desc: '프리미엄 상품' },
];

type WizardData = {
  category: string;
  categoryName: string;
  keywords: string[];
  style: string;
  targetAge: string;
  priceRange: string;
};

export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    category: '',
    categoryName: '',
    keywords: [],
    style: '',
    targetAge: '',
    priceRange: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    product: string;
    detailPage: string;
    blog: string;
  } | null>(null);

  const totalSteps = 4;

  const handleCategorySelect = (cat: typeof categories[0]) => {
    setData({ ...data, category: cat.id, categoryName: cat.name, keywords: [] });
    setStep(2);
  };

  const handleKeywordToggle = (keyword: string) => {
    const newKeywords = data.keywords.includes(keyword)
      ? data.keywords.filter(k => k !== keyword)
      : [...data.keywords, keyword];
    setData({ ...data, keywords: newKeywords });
  };

  const handleStyleSelect = (styleId: string) => {
    setData({ ...data, style: styleId });
  };

  const handleTargetAgeSelect = (ageId: string) => {
    setData({ ...data, targetAge: ageId });
  };

  const handlePriceRangeSelect = (priceId: string) => {
    setData({ ...data, priceRange: priceId });
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setResults(result);
      setStep(5); // 결과 단계
    } catch (error) {
      console.error('Error:', error);
      alert('생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = categories.find(c => c.id === data.category);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">어떤 분야에 관심이 있으세요?</h2>
              <p className="text-slate-600">판매하고 싶은 카테고리를 선택해주세요</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat)}
                  className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-3"
                >
                  <span className="text-4xl">{cat.icon}</span>
                  <span className="font-semibold text-slate-800">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {selectedCategory?.icon} {data.categoryName} 관련 키워드
              </h2>
              <p className="text-slate-600">원하는 키워드를 선택해주세요 (복수 선택 가능)</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {selectedCategory?.keywords.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => handleKeywordToggle(keyword)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    data.keywords.includes(keyword)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300'
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
              >
                이전
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={data.keywords.length === 0}
                className="px-8 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
              >
                다음
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">스타일과 타겟을 선택해주세요</h2>
              <p className="text-slate-600">상품과 콘텐츠의 방향을 결정합니다</p>
            </div>

            {/* 스타일 선택 */}
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4">브랜드 스타일</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {styleOptions.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleStyleSelect(style.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      data.style === style.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-800">{style.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 타겟 연령 선택 */}
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4">타겟 연령대</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {targetAges.map((age) => (
                  <button
                    key={age.id}
                    onClick={() => handleTargetAgeSelect(age.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      data.targetAge === age.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 hover:border-green-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-800">{age.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{age.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 가격대 선택 */}
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4">가격대</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {priceRanges.map((price) => (
                  <button
                    key={price.id}
                    onClick={() => handlePriceRangeSelect(price.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      data.priceRange === price.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-800">{price.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{price.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
              >
                이전
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!data.style || !data.targetAge || !data.priceRange}
                className="px-8 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
              >
                다음
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">선택 내용 확인</h2>
              <p className="text-slate-600">아래 내용으로 전체 패키지를 생성합니다</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">카테고리</span>
                  <span className="font-semibold text-slate-800">{selectedCategory?.icon} {data.categoryName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">키워드</span>
                  <span className="font-semibold text-slate-800">{data.keywords.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">스타일</span>
                  <span className="font-semibold text-slate-800">
                    {styleOptions.find(s => s.id === data.style)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">타겟</span>
                  <span className="font-semibold text-slate-800">
                    {targetAges.find(a => a.id === data.targetAge)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">가격대</span>
                  <span className="font-semibold text-slate-800">
                    {priceRanges.find(p => p.id === data.priceRange)?.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-slate-800 mb-3">생성될 콘텐츠</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
                  상품 아이디어 및 소싱 추천
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
                  스마트스토어 상세페이지 문구
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
                  SEO 최적화 블로그 글
                </li>
              </ul>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
              >
                이전
              </button>
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 disabled:from-slate-300 disabled:to-slate-400 transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    AI가 생성 중...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    전체 패키지 생성하기
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 5:
        return <ResultsView results={results!} onReset={() => { setStep(1); setData({ category: '', categoryName: '', keywords: [], style: '', targetAge: '', priceRange: '' }); setResults(null); }} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="AI 수익화 마법사" showBack />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 진행 표시 */}
        {step <= 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      s < step
                        ? 'bg-green-500 text-white'
                        : s === step
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {s < step ? '✓' : s}
                  </div>
                  {s < 4 && (
                    <div className={`w-12 h-1 mx-1 ${s < step ? 'bg-green-500' : 'bg-slate-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-slate-600">
              {step === 1 && '카테고리 선택'}
              {step === 2 && '키워드 선택'}
              {step === 3 && '스타일 & 타겟 설정'}
              {step === 4 && '최종 확인'}
            </div>
          </div>
        )}

        {/* 단계별 콘텐츠 */}
        {renderStep()}
      </main>
    </div>
  );
}

// 결과 뷰 컴포넌트
function ResultsView({ results, onReset }: { results: { product: string; detailPage: string; blog: string }; onReset: () => void }) {
  const [activeTab, setActiveTab] = useState<'product' | 'detailPage' | 'blog'>('product');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('복사되었습니다!');
  };

  const tabs = [
    { id: 'product' as const, name: '상품 추천', icon: '🛍️', color: 'purple' },
    { id: 'detailPage' as const, name: '상세페이지', icon: '📄', color: 'blue' },
    { id: 'blog' as const, name: '블로그 글', icon: '✍️', color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🎉</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">전체 패키지 생성 완료!</h2>
        <p className="text-slate-600">아래 탭에서 결과를 확인하고 복사하세요</p>
      </div>

      {/* 탭 버튼 */}
      <div className="flex justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? `bg-${tab.color}-500 text-white`
                : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
            style={activeTab === tab.id ? { backgroundColor: tab.color === 'purple' ? '#a855f7' : tab.color === 'blue' ? '#3b82f6' : '#22c55e' } : {}}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* 결과 내용 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-800">
            {tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.name}
          </h3>
          <button
            onClick={() => copyToClipboard(results[activeTab])}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-600 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            복사하기
          </button>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">
            {results[activeTab]}
          </pre>
        </div>
      </div>

      {/* 다시 시작 버튼 */}
      <div className="flex justify-center mt-8">
        <button
          onClick={onReset}
          className="px-8 py-3 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          다른 상품 만들기
        </button>
      </div>
    </div>
  );
}
