import { type NextAuthOptions } from 'next-auth';

// 카카오 프로바이더를 직접 정의 (카카오 공식 OAuth 2.0)
const kakaoProvider = {
  id: 'kakao',
  name: 'Kakao',
  type: 'oauth' as const,
  authorization: {
    url: 'https://kauth.kakao.com/oauth/authorize',
    params: { scope: '' },
  },
  token: 'https://kauth.kakao.com/oauth/token',
  userinfo: 'https://kapi.kakao.com/v2/user/me',
  idToken: false,
  checks: ['state'] as ('state')[],
  clientId: process.env.KAKAO_CLIENT_ID!,
  clientSecret: process.env.KAKAO_CLIENT_SECRET!,
  profile(profile: any) {
    console.log('[NextAuth] Kakao profile response:', JSON.stringify(profile));
    return {
      id: String(profile.id),
      name: profile.kakao_account?.profile?.nickname || profile.properties?.nickname || '사용자',
      image: profile.kakao_account?.profile?.profile_image_url || profile.properties?.profile_image || '',
      email: profile.kakao_account?.email || `${profile.id}@kakao.user`,
    };
  },
};

export const authOptions: NextAuthOptions = {
  providers: [kakaoProvider],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.kakaoId = (profile as any)?.id;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).kakaoId = token.kakaoId;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
