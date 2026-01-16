import { NextRequest, NextResponse } from 'next/server';
import { generateWithGPT } from '@/lib/openai';
import {
  searchShopping,
  analyzePriceRange,
  analyzeShops,
} from '@/lib/naver';

// Vercel 함수 타임아웃 설정 (최대 60초 - Pro 필요, 무료는 10초)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { category, categoryName, keywords, style, targetAge, priceRange } = await request.json();

    if (!category || !categoryName || !keywords?.length) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const searchQuery = `${categoryName} ${keywords.join(' ')}`;

    // 실제 네이버 데이터 수집
    let shoppingData = null;
    let priceAnalysis = null;
    let topShops = null;

    try {
      shoppingData = await searchShopping(searchQuery, 30);
      if (shoppingData?.items?.length > 0) {
        priceAnalysis = analyzePriceRange(shoppingData.items);
        topShops = analyzeShops(shoppingData.items);
      }
    } catch (e) {
      console.log('쇼핑 API 스킵');
    }

    // 트렌드 API는 시간이 오래 걸려서 스킵

    // 스타일/타겟/가격 한글 변환
    const styleMap: Record<string, string> = {
      premium: '프리미엄/고급스러운',
      casual: '캐주얼/친근한',
      minimal: '미니멀/심플한',
      trendy: '트렌디/최신'
    };

    const ageMap: Record<string, string> = {
      '20s': '20대 MZ세대',
      '30s': '30대 실용주의자',
      '40s': '40~50대',
      'all': '전연령'
    };

    const priceMap: Record<string, string> = {
      low: '1만원 이하 가성비',
      mid: '1~3만원 중저가',
      high: '3~5만원 중고가',
      premium: '5만원 이상 프리미엄'
    };

    const styleKor = styleMap[style] || style;
    const ageKor = ageMap[targetAge] || targetAge;
    const priceKor = priceMap[priceRange] || priceRange;

    // 실제 데이터 컨텍스트
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

      realDataContext = `
[실제 네이버 쇼핑 데이터]
- 검색 결과: ${shoppingData.total?.toLocaleString() || 'N/A'}개
- 가격대: ${priceAnalysis?.min?.toLocaleString()}원 ~ ${priceAnalysis?.max?.toLocaleString()}원 (평균 ${priceAnalysis?.avg?.toLocaleString()}원)
- 인기 상품 예시: ${sampleProducts.map((p: {name: string}) => p.name).slice(0, 3).join(', ')}
`;
    }

    // 1. 상품 추천 생성
    const productPrompt = `당신은 스마트스토어 상품 소싱 전문가입니다.

${realDataContext}

[조건]
- 카테고리: ${categoryName}
- 키워드: ${keywords.join(', ')}
- 브랜드 스타일: ${styleKor}
- 타겟 고객: ${ageKor}
- 가격대: ${priceKor}

위 조건에 맞는 **구체적인 상품 3가지**를 추천해주세요.

각 상품마다:
1. **상품명** (구체적으로)
2. **상품 설명** (2-3문장)
3. **타겟 고객**
4. **추천 판매가**
5. **예상 마진율**
6. **소싱처** (알리익스프레스, 1688, 국내도매 등)
7. **판매 포인트** (왜 이 상품이 팔릴지)

실제로 바로 소싱할 수 있는 구체적인 상품을 추천해주세요.`;

    // 2. 상세페이지 생성
    const detailPagePrompt = `당신은 스마트스토어 상세페이지 카피라이터입니다.

[상품 정보]
- 카테고리: ${categoryName}
- 특징: ${keywords.join(', ')}
- 브랜드 톤: ${styleKor}
- 타겟: ${ageKor}
- 가격대: ${priceKor}

위 정보를 바탕으로 **스마트스토어 상세페이지에 바로 사용할 수 있는 문구**를 작성해주세요.

다음 섹션별로 작성:

## 메인 카피 (후킹 문구)
- 제목 1줄
- 서브 카피 1-2줄

## 상품 소개
- 이 상품이 왜 특별한지 3-4문장

## 핵심 특징 3가지
각 특징마다:
- 특징 제목
- 설명 2문장

## 이런 분께 추천해요
- 타겟 고객 4가지 나열

## 구매 전 안내
- 배송/교환/반품 관련 안내 문구

## 후킹 마무리 문구
- 구매를 유도하는 마지막 한마디

실제로 복사해서 바로 사용할 수 있게 작성해주세요.`;

    // 3. 블로그 글 생성
    const blogPrompt = `당신은 네이버 블로그 마케팅 전문가입니다.

[주제]
- 카테고리: ${categoryName}
- 관련 키워드: ${keywords.join(', ')}
- 톤앤매너: ${styleKor}
- 타겟 독자: ${ageKor}

위 주제로 **네이버 블로그 글**을 작성해주세요.

조건:
- SEO 최적화 (키워드 자연스럽게 5회 이상 포함)
- 1500자 이상
- 정보형 + 후기형 혼합
- 중간중간 소제목 사용

구성:
1. **제목** (클릭을 유도하는 제목)
2. **도입부** (공감/문제 제기)
3. **본문** (정보 + 추천)
4. **마무리** (요약 + 행동 유도)

실제 블로그에 바로 포스팅할 수 있게 작성해주세요.`;

    // 병렬로 3개 API 호출
    const [productResult, detailPageResult, blogResult] = await Promise.all([
      generateWithGPT('당신은 이커머스 상품 소싱 전문가입니다. 실용적이고 구체적인 조언을 해주세요.', productPrompt),
      generateWithGPT('당신은 전문 상세페이지 카피라이터입니다. 판매력 있는 문구를 작성해주세요.', detailPagePrompt),
      generateWithGPT('당신은 네이버 블로그 최적화 전문가입니다. SEO에 최적화된 글을 작성해주세요.', blogPrompt),
    ]);

    return NextResponse.json({
      product: productResult,
      detailPage: detailPageResult,
      blog: blogResult,
      metadata: {
        category: categoryName,
        keywords,
        style: styleKor,
        target: ageKor,
        price: priceKor,
        hasRealData: !!shoppingData,
      }
    });
  } catch (error) {
    console.error('Package API Error:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { error: `패키지 생성 실패: ${errorMessage}` },
      { status: 500 }
    );
  }
}
