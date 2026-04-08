import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 인증이 필요한 경로
const protectedRoutes = ['/my', '/recommend', '/share', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 인증 체크 (NextAuth 세션 쿠키)
  const sessionToken = request.cookies.get('next-auth.session-token')?.value;

  // 보호된 경로에 로그인 안 한 사용자 → 로그인 페이지로
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !sessionToken) {
    // 현재는 demo 모드로 통과시킴 (배포 시 아래 주석 해제)
    // return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/my/:path*', '/recommend/:path*', '/share/:path*', '/profile/:path*'],
};
