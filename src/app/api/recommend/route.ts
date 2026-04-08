import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { RECOMMENDATION_PROMPT } from '@/lib/constants';

// Vercel AI SDK는 Vercel에 배포 시 자동으로 Vercel AI Gateway를 통해
// 무료 크레딧이 적용됩니다.
// 로컬 개발 시에는 OPENAI_API_KEY 환경변수가 필요합니다.
// Vercel 배포 시에는 프로젝트 설정에서 AI를 활성화하면 됩니다.

export async function POST(request: NextRequest) {
  try {
    const { situation, songs } = await request.json();

    if (!situation) {
      return new Response(JSON.stringify({ error: 'Missing situation' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 사용자 애창곡 리스트를 AI에게 전달
    const songsContext = songs?.length
      ? `\n\n[사용자의 애창곡 리스트]\n${songs
          .map((s: any) => `- ${s.title} (${s.artist}) [${s.category}] 자신감: ${s.confidence}/5`)
          .join('\n')}`
      : '\n\n[사용자의 애창곡 리스트]\n아직 저장된 곡이 없습니다.';

    const result = streamText({
      // Vercel 무료 크레딧: gpt-4o-mini 모델 사용
      // Vercel에 배포하면 AI Gateway를 통해 무료 크레딧 자동 적용
      model: openai('gpt-4o-mini'),
      system: RECOMMENDATION_PROMPT,
      messages: [
        {
          role: 'user',
          content: `${situation}${songsContext}`,
        },
      ],
      maxTokens: 1500,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Recommend error:', error);
    return new Response(JSON.stringify({ error: 'Recommendation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
