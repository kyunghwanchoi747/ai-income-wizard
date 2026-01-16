import { NextRequest, NextResponse } from 'next/server';
import { generateWithGPT } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { productName, features, target, price } = await request.json();

    if (!productName || !features) {
      return NextResponse.json(
        { error: '상품명과 주요 특징은 필수입니다.' },
        { status: 400 }
      );
    }

    const systemPrompt = `당신은 월 매출 1억 이상의 스마트스토어를 운영하는 상세페이지 전문 카피라이터입니다.
네이버 스마트스토어에 바로 사용할 수 있는 상세페이지 텍스트를 작성해주세요.

다음 구조로 작성해주세요:

## 1. 후킹 문구 (상단 배너용)
- 강력한 한 줄 카피 3개 제안
- 고객의 고민/니즈를 자극하는 질문형 포함

## 2. 상품 한줄 소개
- 핵심 가치를 담은 30자 내외 소개문

## 3. 이런 분께 추천해요 (타겟 어필)
- 구매해야 하는 상황 5가지
- 체크리스트 형식

## 4. 상품 특징 상세 설명
- 각 특징별 제목 + 설명 (3~5개)
- 감성적 + 기능적 설명 병행

## 5. 스펙/상세정보
- 사이즈, 재질, 구성품 등 표 형식

## 6. 구매 유도 문구 (하단)
- 지금 구매해야 하는 이유
- 긴급성/희소성 강조

## 7. 자주 묻는 질문 (FAQ)
- 예상 질문 3개와 답변

구매 전환율을 높이는 설득력 있는 문구를 작성해주세요.
이모지는 적절히 사용하되 과하지 않게 해주세요.`;

    const userPrompt = `상품명: ${productName}
주요 특징: ${features}
${target ? `타겟 고객: ${target}` : ''}
${price ? `판매 가격: ${price}` : ''}

이 상품의 스마트스토어 상세페이지 텍스트를 작성해주세요.`;

    const result = await generateWithGPT(systemPrompt, userPrompt);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Detail Page API Error:', error);
    return NextResponse.json(
      { error: '상세페이지 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
