import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

const ADMIN_KAKAO_IDS = (process.env.ADMIN_KAKAO_IDS || '').split(',').map(id => id.trim());

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ isAdmin: false, reason: 'not_authenticated' }, { status: 401 });
  }

  const kakaoId = String((session as any).kakaoId || '');
  const isAdmin = ADMIN_KAKAO_IDS.includes(kakaoId);

  return NextResponse.json({
    isAdmin,
    user: session.user?.name || null,
  });
}
