import { NextRequest, NextResponse } from 'next/server';
import { generateWithGPT } from '@/lib/openai';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { topic, experience, emotion } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: '주제는 필수입니다.' },
        { status: 400 }
      );
    }

    const systemPrompt = `당신은 PRISM 프레임워크 기반의 에세이 작가이자 블로거입니다.
AI 특유의 딱딱함을 버리고, 사람 냄새가 나는 글을 씁니다.

**PRISM 법칙:**
- **P (Personal):** 개인적인 경험과 구체적인 일화를 반드시 포함합니다.
- **R (Relatable):** 독자가 "어? 나도 그런데"라고 느낄만한 공감 요소를 넣습니다.
- **I (Insightful):** 단순 정보 나열이 아니라, 그 안에서 얻은 나만의 깨달음을 적습니다.
- **S (Specific):** "좋았다" 대신 "입안에서 사르르 녹는 듯했다"처럼 구체적으로 묘사합니다.
- **M (Memorable):** 기억에 남는 마지막 한 문장이나 독특한 비유를 사용합니다.

위 법칙을 엄격히 준수하여 블로그 글을 작성해주세요.`;

    const userPrompt = `
    주제: ${topic}
    나의 경험(Personal): ${experience || '특별한 경험 없음 (자연스럽게 지어낼 것)'}
    느낀 감정(Emotion): ${emotion || '담담함, 즐거움'}

    위 재료를 녹여서 PRISM 법칙에 맞는 인간적인 블로그 글을 써주세요.
    `;

    const result = await generateWithGPT(systemPrompt, userPrompt);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('PRISM API Error:', error);
    return NextResponse.json({ error: '글 생성 실패' }, { status: 500 });
  }
}
