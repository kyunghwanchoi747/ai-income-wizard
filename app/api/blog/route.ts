import { NextRequest, NextResponse } from 'next/server';
import { generateWithGPT } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { topic, keywords, style } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: '주제는 필수입니다.' },
        { status: 400 }
      );
    }

    const styleGuides: Record<string, string> = {
      '정보형': '객관적이고 전문적인 정보를 전달하는 스타일로 작성해주세요. 신뢰감 있는 톤을 유지하세요.',
      '후기형': '직접 경험한 것처럼 1인칭 시점으로 작성해주세요. 솔직하고 친근한 톤으로 작성하세요.',
      '리스트형': '숫자를 활용한 리스트 형식으로 작성해주세요. 예: "5가지 방법", "TOP 7" 등',
      '비교형': '장단점을 명확히 비교 분석하는 형식으로 작성해주세요. 표나 비교 문단을 활용하세요.',
    };

    const systemPrompt = `당신은 네이버 블로그 상위 노출 전문가입니다.
SEO에 최적화된 블로그 글을 작성해주세요.

${styleGuides[style] || styleGuides['정보형']}

## 작성 규칙:

1. **제목**
   - 클릭을 유도하는 매력적인 제목
   - 핵심 키워드 포함
   - 제목 후보 3개 제안

2. **본문 구조** (1,500~2,000자)
   - 도입부: 독자의 관심을 끄는 시작 (문제 제기 또는 공감)
   - 본론: 소제목으로 구분된 3~5개 섹션
   - 결론: 요약 및 행동 유도

3. **SEO 최적화**
   - 키워드를 자연스럽게 5회 이상 배치
   - 소제목에 키워드 포함
   - 첫 문단에 핵심 키워드 배치

4. **가독성**
   - 짧은 문단 (2~3문장)
   - 적절한 줄바꿈
   - 이모지는 소제목에만 1개씩 사용

5. **마무리**
   - 댓글 유도 질문
   - 관련 포스팅 언급 가능

실제 네이버 블로그에 바로 붙여넣기 할 수 있도록 작성해주세요.`;

    const userPrompt = `주제: ${topic}
${keywords ? `SEO 키워드: ${keywords}` : ''}
글 스타일: ${style}

이 주제로 네이버 블로그 글을 작성해주세요.`;

    const result = await generateWithGPT(systemPrompt, userPrompt);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Blog API Error:', error);
    return NextResponse.json(
      { error: '블로그 글 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
