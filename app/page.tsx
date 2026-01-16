import Link from 'next/link';
import Header from '@/components/Header';
import ToolCard from '@/components/ToolCard';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* 히어로 섹션 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            AI로 수익화 자동화하기
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            클릭 몇 번으로 상품 소싱부터 상세페이지, 블로그 글까지
            <br className="hidden sm:block" />
            AI가 자동으로 만들어드립니다.
          </p>
        </div>

        {/* 원클릭 마법사 버튼 */}
        <div className="mb-12">
          <Link
            href="/wizard"
            className="block max-w-2xl mx-auto p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="text-white">
                <div className="text-sm font-medium opacity-90 mb-1">NEW! 클릭만으로 완성</div>
                <h3 className="text-2xl font-bold mb-2">AI 수익화 마법사</h3>
                <p className="text-sm opacity-90">
                  카테고리 선택 - 키워드 선택 - 스타일 선택
                  <br />
                  3단계만 거치면 상품 추천 + 상세페이지 + 블로그 글 한 번에!
                </p>
              </div>
              <div className="text-6xl ml-4">
                <span className="animate-pulse">{">"}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-4 mb-8 max-w-2xl mx-auto">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-sm text-slate-400">또는 개별 도구 사용</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* 도구 카드 그리드 */}
        <div className="grid md:grid-cols-2 gap-6">
          <ToolCard
            href="/keyword"
            title="키워드 분석 도구"
            description="네이버 실제 데이터로 검색량, 경쟁도, 트렌드를 분석해드려요."
            color="bg-orange-500"
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />

          <ToolCard
            href="/sourcing"
            title="상품 소싱 도우미"
            description="실제 쇼핑 데이터 기반으로 상품 아이디어, 가격대, 소싱처를 추천해드려요."
            color="bg-purple-500"
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />

          <ToolCard
            href="/detail-page"
            title="상세페이지 생성기"
            description="상품 정보만 입력하면 스마트스토어에 바로 쓸 수 있는 상세페이지를 만들어드려요."
            color="bg-blue-500"
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />

          <ToolCard
            href="/blog"
            title="블로그 글 생성기"
            description="주제만 정하면 SEO 최적화된 네이버 블로그 글을 자동으로 작성해드려요."
            color="bg-green-500"
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            }
          />

          <ToolCard
            href="/shorts"
            title="쇼츠/릴스 대본 생성기"
            description="유튜브 쇼츠, 인스타그램 릴스에서 터지는 60초 대본을 만들어드려요."
            color="bg-pink-500"
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            }
          />

          <ToolCard
            href="/youtube"
            title="유튜브 스크립트 생성기"
            description="주제만 입력하면 오프닝부터 클로징까지 완벽한 영상 대본을 짜드려요."
            color="bg-red-500"
            icon={
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            }
          />

          <ToolCard
            href="/catalog-matcher"
            title="카탈로그 매칭 킬러"
            description="최저가 매칭 전략과 마진을 계산하고 전용 상품명을 생성합니다."
            color="bg-indigo-500"
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          />

          <ToolCard
            href="/osmu"
            title="콘텐츠 멀티플라이어"
            description="글 하나로 인스타, 쇼츠, SNS 피드까지 한 번에 생성합니다."
            color="bg-pink-600"
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            }
          />

          <ToolCard
            href="/human-blog"
            title="PRISM 휴먼 블로그"
            description="AI 티 안 나는, 경험과 공감이 담긴 사람 냄새 나는 글을 씁니다."
            color="bg-teal-500"
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
        </div>

        {/* 사용 안내 */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
            사용 방법
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                1
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">도구 선택</h4>
              <p className="text-sm text-slate-600">원하는 도구를 클릭하세요</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                2
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">정보 입력</h4>
              <p className="text-sm text-slate-600">간단한 정보만 입력하세요</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                3
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">결과 복사</h4>
              <p className="text-sm text-slate-600">생성된 결과를 복사해서 사용하세요</p>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-slate-200 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
          AI 올인원 수익화 도구 - 수강생 전용
        </div>
      </footer>
    </div>
  );
}
