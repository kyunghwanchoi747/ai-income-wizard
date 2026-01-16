import { NextRequest, NextResponse } from 'next/server';
import { generateWithGPT } from '@/lib/openai';
import {
  searchShopping,
  getSearchTrend,
  analyzePriceRange,
  analyzeShops,
  getMonthsAgo,
  getToday
} from '@/lib/naver';

export async function POST(request: NextRequest) {
  try {
    const { category, keyword, budget } = await request.json();

    if (!category || !keyword) {
      return NextResponse.json(
        { error: '카테고리와 키워드는 필수입니다.' },
        { status: 400 }
      );
    }

    const searchQuery = `${category} ${keyword}`;

    // 실제 네이버 데이터 수집
    let shoppingData = null;
    let trendData = null;
    let priceAnalysis = null;
    let topShops = null;

    // 네이버 쇼핑 검색 데이터
    try {
      shoppingData = await searchShopping(searchQuery, 30);
      if (shoppingData?.items?.length > 0) {
        priceAnalysis = analyzePriceRange(shoppingData.items);
        topShops = analyzeShops(shoppingData.items);
      }
    } catch (e) {
      console.log('쇼핑 API 스킵 (API 키 미설정)');
    }

    // 네이버 데이터랩 트렌드 데이터
    try {
      trendData = await getSearchTrend(
        [keyword, category],
        getMonthsAgo(12),
        getToday()
      );
    } catch (e) {
      console.log('데이터랩 API 스킵 (API 키 미설정)');
    }

    // 실제 데이터 기반 컨텍스트 생성
    let realDataContext = '';

    if (shoppingData?.items?.length > 0) {
      const sampleProducts = shoppingData.items.slice(0, 5).map((item: {
        title: string;
        lprice: string;
        mallName: string;
      }) => ({
        name: item.title.replace(/<[^>]*>/g, ''),
        price: parseInt(item.lprice).toLocaleString() + '원',
        shop: item.mallName,
      }));

      realDataContext += `
## 네이버 쇼핑 실제 데이터 (${shoppingData.total?.toLocaleString() || 'N/A'}개 상품 검색됨)

### 현재 판매 중인 상품 예시:
${sampleProducts.map((p: {name: string; price: string; shop: string}, i: number) => `${i + 1}. ${p.name} - ${p.price} (${p.shop})`).join('\n')}

### 가격 분석:
- 최저가: ${priceAnalysis?.min?.toLocaleString()}원
- 최고가: ${priceAnalysis?.max?.toLocaleString()}원
- 평균가: ${priceAnalysis?.avg?.toLocaleString()}원

### 주요 판매처:
${topShops?.map((s: {name: string; count: number}) => `- ${s.name}: ${s.count}개 상품`).join('\n') || '데이터 없음'}
`;
    }

    if (trendData?.results?.length > 0) {
      const trendInfo = trendData.results.map((result: {
        title: string;
        data: Array<{period: string; ratio: number}>;
      }) => {
        const latestData = result.data?.slice(-3) || [];
        const trend = latestData.length >= 2
          ? (latestData[latestData.length - 1]?.ratio > latestData[0]?.ratio ? '상승' : '하락')
          : '유지';
        return `- "${result.title}": 최근 트렌드 ${trend}`;
      });

      realDataContext += `
## 검색 트렌드 분석 (최근 12개월)
${trendInfo.join('\n')}
`;
    }

    const systemPrompt = `당신은 10년 경력의 스마트스토어 상품 소싱 전문가입니다.
아래 제공된 **실제 네이버 데이터**를 분석하여 판매 가능성이 높은 상품을 추천해주세요.

${realDataContext || '(네이버 API 미연결 - 일반 추천 제공)'}

다음 형식으로 답변해주세요:

## 시장 분석 요약
- 검색 결과 수, 가격대, 경쟁 현황 분석

## 추천 상품 아이디어 5가지

각 상품마다:
1. **상품명**: [구체적인 상품명]
2. **추천 이유**: [실제 데이터 기반 근거]
3. **예상 타겟**: [주요 구매 고객층]
4. **추천 판매가**: [실제 시장가 기반 가격 전략]
5. **예상 마진**: [소싱가 대비 마진율 추정]
6. **소싱처 추천**: [알리익스프레스, 1688, 국내도매 등]
7. **차별화 포인트**: [경쟁 상품 대비 어떻게 차별화할지]

## 소싱 전략 조언
- 이 시장에서 성공하려면 어떤 전략이 필요한지
- 피해야 할 리스크

실제 데이터에 기반한 구체적이고 실행 가능한 조언을 해주세요.`;

    const userPrompt = `관심 카테고리: ${category}
세부 키워드: ${keyword}
${budget ? `예상 단가: ${budget}` : ''}

이 조건에 맞는 판매 가능한 상품 아이디어를 추천해주세요.`;

    const result = await generateWithGPT(systemPrompt, userPrompt);

    return NextResponse.json({
      result,
      metadata: {
        totalProducts: shoppingData?.total || null,
        priceRange: priceAnalysis || null,
        hasRealData: !!(shoppingData || trendData),
      }
    });
  } catch (error) {
    console.error('Sourcing API Error:', error);
    return NextResponse.json(
      { error: '상품 아이디어 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
