import { NextRequest, NextResponse } from 'next/server';
import { generateWithGPT } from '@/lib/openai';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { content, tone } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: '변환할 내용이 없습니다.' },
        { status: 400 }
      );
    }

    const systemPrompt = `당신은 '원소스 멀티유즈(OSMU)' 콘텐츠 마케팅 전문가입니다.
하나의 텍스트 소스를 입력받아 인스타그램, 유튜브 쇼츠, 텍스트 SNS(스레드/트위터)용으로 각각 최적화하여 변환합니다.

출력 형식은 반드시 다음 섹션으로 나누어주세요:

## [INSTAGRAM]
- 카드뉴스 페이지별 문구 (1~5페이지)
- 추천 이미지 프롬프트
- 해시태그 15개

## [SHORTS]
- 60초 숏폼 대본
- 오프닝(후킹) -> 본론 -> 클로징
- 화면 연출 가이드

## [SNS]
- 스레드/트위터/페이스북용 짧은 글
- 줄바꿈과 이모지를 활용한 가독성 높은 스타일
- 핵심 요약 + 공감 유도`;

    const userPrompt = `
    [원본 내용]
    ${content}

    [원하는 톤앤매너]
    ${tone || '친근하고 트렌디하게'}
    
    위 내용을 바탕으로 3가지 플랫폼용 콘텐츠를 생성해주세요.
    `;

    const result = await generateWithGPT(systemPrompt, userPrompt);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('OSMU API Error:', error);
    return NextResponse.json({ error: '콘텐츠 변환 실패' }, { status: 500 });
  }
}
