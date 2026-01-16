import { NextRequest, NextResponse } from 'next/server';
import { generateWithGPT } from '@/lib/openai';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { topic, hook } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: '쇼츠 주제는 필수입니다.' },
        { status: 400 }
      );
    }

    const hookStyles: Record<string, string> = {
      '충격형': '충격적인 사실이나 반전으로 시작 (예: "이거 모르면 매달 10만원 손해봅니다")',
      '질문형': '궁금증 유발하는 질문으로 시작 (예: "왜 부자들은 이걸 안 알려줄까요?")',
      '비교형': 'A vs B 비교로 시작 (예: "적금 vs 주식, 뭐가 더 돈 될까요?")',
      '꿀팁형': '핵심 꿀팁 바로 제시 (예: "딱 이것만 하세요, 인생 바뀝니다")',
    };

    const systemPrompt = `당신은 틱톡/인스타 릴스/유튜브 쇼츠 전문 크리에이터입니다.
60초 안에 시청자를 사로잡고, 끝까지 보게 만드는 중독성 있는 숏폼 콘텐츠를 만듭니다.
핵심: 처음 3초에 승부, 빠른 전개, 명확한 메시지`;

    const userPrompt = `다음 조건으로 쇼츠/릴스 대본을 작성해주세요.

[조건]
- 주제: ${topic}
- 후킹 스타일: ${hook} - ${hookStyles[hook] || hook}
- 길이: 60초 이내

다음 형식으로 작성해주세요:

## 후킹 (0-3초)
- 시청자가 스크롤을 멈추게 만드는 첫 마디
- 표정/제스처 지시

## 본론 (4-50초)
- 핵심 내용 3가지 이내
- 각 포인트별 대사와 화면 전환 지시
- 자막 텍스트 (강조할 키워드 **굵게**)

## 마무리 (51-60초)
- 핵심 요약 한 줄
- CTA (팔로우/좋아요 유도)

## 편집 가이드
- BGM 분위기
- 효과음 타이밍
- 자막 스타일
- 화면 전환 효과

## 해시태그 (10개)
- 관련 해시태그 추천

---

**추가 아이디어**
- 이 주제로 만들 수 있는 다른 쇼츠 3개 제안`;

    const result = await generateWithGPT(systemPrompt, userPrompt);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Shorts API Error:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { error: `쇼츠 대본 생성 실패: ${errorMessage}` },
      { status: 500 }
    );
  }
}
