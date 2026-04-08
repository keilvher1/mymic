import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

const ADMIN_KAKAO_IDS = (process.env.ADMIN_KAKAO_IDS || '').split(',').map(id => id.trim());

export async function verifyAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { authorized: false, response: NextResponse.json({ error: 'not_authenticated' }, { status: 401 }) };
  }

  const kakaoId = String((session as any).kakaoId || '');
  if (!ADMIN_KAKAO_IDS.includes(kakaoId)) {
    return { authorized: false, response: NextResponse.json({ error: 'not_authorized' }, { status: 403 }) };
  }

  return { authorized: true, session, kakaoId };
}
