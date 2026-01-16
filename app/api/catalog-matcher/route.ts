import { NextRequest, NextResponse } from 'next/server';
import { generateWithGPT } from '@/lib/openai';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { wholesalePrice, lowestPrice, keyword, category } = await request.json();

    if (!wholesalePrice || !lowestPrice) {
      return NextResponse.json(
        { error: '가격 정보는 필수입니다.' },
        { status: 400 }
      );
    }

    const wPrice = Number(wholesalePrice);
    const lPrice = Number(lowestPrice);
    
    // 강의 전략: 최저가보다 10~100원 싸게 설정하여 상위 노출
    const targetPrice = lPrice - 50; 
    
    // 마진 계산 (수수료 약 6% 가정)
    const fee = Math.round(targetPrice * 0.06);
    const margin = targetPrice - wPrice - fee;
    const marginRate = ((margin / targetPrice) * 100).toFixed(1);

    const systemPrompt = `당신은 네이버 스마트스토어 '카탈로그 매칭' 전문가입니다.
기존 잘 팔리는 상품(카탈로그)에 내 상품을 묶어서 판매하는 전략을 사용합니다.
네이버 로직에 맞춰 카탈로그 매칭 확률이 높은 상품명을 생성해야 합니다.

규칙:
1. 브랜드명/제조사명이 있다면 제일 앞에 배치
2. 핵심 키워드(모델명) 정확히 포함
3. 불필요한 수식어 제거 (깔끔한 표준 상품명 지향)
4. 카탈로그 매칭은 '정확도'가 생명입니다.`;

    const userPrompt = `
    카테고리: ${category}
    핵심 키워드: ${keyword}
    
    이 키워드를 포함하여 네이버 가격비교(카탈로그) 매칭에 유리한 **표준 상품명 5가지**를 추천해주세요.
    각 상품명 옆에 왜 이렇게 지었는지 짧은 이유도 덧붙여주세요.
    `;

    const aiResult = await generateWithGPT(systemPrompt, userPrompt);

    return NextResponse.json({
      calculation: {
        targetPrice,
        margin,
        marginRate,
        fee
      },
      aiResult
    });
  } catch (error) {
    console.error('Catalog Matcher API Error:', error);
    return NextResponse.json({ error: '계산 및 생성 실패' }, { status: 500 });
  }
}
