import { NextRequest, NextResponse } from 'next/server';
import { generateWithGPT } from '@/lib/openai';
import {
  getKeywordStats,
  getSearchTrend,
  searchShopping,
  searchBlog,
  getMonthsAgo,
  getToday
} from '@/lib/naver';

export async function POST(request: NextRequest) {
  try {
    const { keyword } = await request.json();

    if (!keyword) {
      return NextResponse.json(
        { error: '키워드는 필수입니다.' },
        { status: 400 }
      );
    }

    const keywords: Array<{
      keyword: string;
      monthlySearches: { pc: number; mobile: number; total: number };
      competition: string;
      trend: string;
    }> = [];
    const relatedKeywords: string[] = [];
    let trends: Array<{ keyword: string; data: Array<{ period: string; ratio: number }> }> = [];
    let shoppingCount = 0;
    let blogCount = 0;

    // 1. 네이버 검색광고 API - 키워드 검색량 (사업자 필요)
    try {
      const keywordStats = await getKeywordStats([keyword]);

      if (keywordStats?.keywordList) {
        keywordStats.keywordList.forEach((item: {
          relKeyword: string;
          monthlyPcQcCnt: number | string;
          monthlyMobileQcCnt: number | string;
          compIdx: string;
        }) => {
          const pcCount = typeof item.monthlyPcQcCnt === 'number' ? item.monthlyPcQcCnt : parseInt(item.monthlyPcQcCnt) || 0;
          const mobileCount = typeof item.monthlyMobileQcCnt === 'number' ? item.monthlyMobileQcCnt : parseInt(item.monthlyMobileQcCnt) || 0;

          keywords.push({
            keyword: item.relKeyword,
            monthlySearches: {
              pc: pcCount,
              mobile: mobileCount,
              total: pcCount + mobileCount,
            },
            competition: item.compIdx === 'HIGH' ? '높음' : item.compIdx === 'MEDIUM' ? '중간' : '낮음',
            trend: 'stable',
          });

          if (item.relKeyword !== keyword) {
            relatedKeywords.push(item.relKeyword);
          }
        });
      }
    } catch (e) {
      console.log('검색광고 API 스킵:', e);
    }

    // 2. 네이버 데이터랩 - 검색 트렌드
    try {
      const trendData = await getSearchTrend(
        [keyword],
        getMonthsAgo(12),
        getToday()
      );

      if (trendData?.results) {
        trends = trendData.results.map((result: {
          title: string;
          data: Array<{ period: string; ratio: number }>;
        }) => ({
          keyword: result.title,
          data: result.data || [],
        }));
      }
    } catch (e) {
      console.log('데이터랩 API 스킵');
    }

    // 3. 네이버 쇼핑 검색 - 상품 수
    try {
      const shoppingData = await searchShopping(keyword, 1);
      shoppingCount = shoppingData?.total || 0;
    } catch (e) {
      console.log('쇼핑 API 스킵');
    }

    // 4. 네이버 블로그 검색 - 컨텐츠 수
    try {
      const blogData = await searchBlog(keyword, 1);
      blogCount = blogData?.total || 0;
    } catch (e) {
      console.log('블로그 API 스킵');
    }

    // API 키가 없는 경우 기본 데이터 제공
    if (keywords.length === 0) {
      keywords.push({
        keyword: keyword,
        monthlySearches: { pc: 0, mobile: 0, total: 0 },
        competition: '분석필요',
        trend: 'unknown',
      });
    }

    // 5. GPT 분석
    let analysisContext = `분석 키워드: ${keyword}\n`;

    if (keywords.length > 0 && keywords[0].monthlySearches.total > 0) {
      analysisContext += `\n월간 검색량: ${keywords[0].monthlySearches.total.toLocaleString()}회`;
      analysisContext += `\n- PC: ${keywords[0].monthlySearches.pc.toLocaleString()}회`;
      analysisContext += `\n- 모바일: ${keywords[0].monthlySearches.mobile.toLocaleString()}회`;
    }

    if (shoppingCount > 0) {
      analysisContext += `\n네이버 쇼핑 상품 수: ${shoppingCount.toLocaleString()}개`;
    }

    if (blogCount > 0) {
      analysisContext += `\n네이버 블로그 글 수: ${blogCount.toLocaleString()}개`;
    }

    if (relatedKeywords.length > 0) {
      analysisContext += `\n연관 키워드: ${relatedKeywords.slice(0, 10).join(', ')}`;
    }

    if (trends.length > 0 && trends[0].data.length > 0) {
      const trendData = trends[0].data;
      const recentTrend = trendData.slice(-3);
      const firstValue = recentTrend[0]?.ratio || 0;
      const lastValue = recentTrend[recentTrend.length - 1]?.ratio || 0;
      const trendDirection = lastValue > firstValue ? '상승' : lastValue < firstValue ? '하락' : '유지';
      analysisContext += `\n최근 3개월 검색 트렌드: ${trendDirection}`;
    }

    const systemPrompt = `당신은 네이버 SEO와 스마트스토어 마케팅 전문가입니다.
아래 키워드 데이터를 분석하여 실용적인 인사이트를 제공해주세요.

${analysisContext}

다음 형식으로 분석 리포트를 작성해주세요:

## 키워드 분석 요약
- 이 키워드의 시장성 평가 (상/중/하)
- 경쟁 강도 평가

## 검색 의도 분석
- 이 키워드를 검색하는 사람들의 주요 목적
- 구매 의도 vs 정보 탐색 비율 추정

## 활용 전략
### 스마트스토어 판매자라면:
- 상품명에 활용하는 방법
- 상세페이지 키워드 전략

### 블로거라면:
- 글 제목 작성 팁
- 연관 키워드 활용법

## 추천 롱테일 키워드
- 경쟁이 낮으면서 검색량이 있는 키워드 5개 제안

## 주의사항
- 이 키워드 사용 시 피해야 할 점

실제 데이터에 기반한 구체적인 조언을 해주세요.`;

    const analysis = await generateWithGPT(systemPrompt, `"${keyword}" 키워드를 분석해주세요.`);

    return NextResponse.json({
      keywords: keywords.slice(0, 20),
      trends,
      relatedKeywords: relatedKeywords.slice(0, 30),
      analysis,
      metadata: {
        shoppingCount,
        blogCount,
        hasAdApi: keywords.length > 0 && keywords[0].monthlySearches.total > 0,
      }
    });
  } catch (error) {
    console.error('Keyword API Error:', error);
    return NextResponse.json(
      { error: '키워드 분석에 실패했습니다.' },
      { status: 500 }
    );
  }
}
