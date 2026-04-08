import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasKakaoClientId: !!process.env.KAKAO_CLIENT_ID,
    kakaoClientIdPrefix: process.env.KAKAO_CLIENT_ID?.substring(0, 6) || 'NOT_SET',
    hasKakaoClientSecret: !!process.env.KAKAO_CLIENT_SECRET,
    kakaoClientSecretPrefix: process.env.KAKAO_CLIENT_SECRET?.substring(0, 4) || 'NOT_SET',
    nextauthUrl: process.env.NEXTAUTH_URL || 'NOT_SET',
    hasNextauthSecret: !!process.env.NEXTAUTH_SECRET,
    nodeEnv: process.env.NODE_ENV,
  });
}
