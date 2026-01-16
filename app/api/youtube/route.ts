import { NextRequest, NextResponse } from 'next/server';
import { generateWithGPT } from '@/lib/openai';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { topic, duration, style } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: '영상 주제는 필수입니다.' },
        { status: 400 }
      );
    }

    const systemPrompt = `당신은 100만 구독자 유튜버의 영상 스크립트 작가입니다.
시청자의 이탈을 막고 끝까지 시청하게 만드는 스크립트를 작성합니다.`;

    const userPrompt = `다음 조건으로 유튜브 영상 스크립트를 작성해주세요.

[조건]
- 주제: ${topic}
- 영상 길이: ${duration}
- 스타일: ${style}

다음 형식으로 작성해주세요:

## 썸네일 & 제목 추천
- 제목 3가지 (클릭률 높은 제목)
- 썸네일 키워드/이미지 아이디어

## 인트로 (처음 30초) - 후킹
- 시청자의 관심을 사로잡는 오프닝
- 영상을 끝까지 봐야 하는 이유

## 본론
- 섹션별로 나눠서 작성
- 각 섹션마다 핵심 포인트와 대사
- 자막에 넣을 키워드 표시

## 아웃트로
- 핵심 내용 요약
- 구독/좋아요 유도 멘트
- 다음 영상 예고

## 영상 편집 포인트
- B롤 삽입 위치
- 효과음/BGM 추천
- 자막 강조 부분

실제로 바로 촬영에 들어갈 수 있게 구체적으로 작성해주세요.`;

    const result = await generateWithGPT(systemPrompt, userPrompt);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('YouTube API Error:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { error: `스크립트 생성 실패: ${errorMessage}` },
      { status: 500 }
    );
  }
}
