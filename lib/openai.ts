// OpenAI API를 fetch로 직접 호출 (Vercel 서버리스 환경 호환)
export async function generateWithGPT(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API 오류: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content || '';
}
