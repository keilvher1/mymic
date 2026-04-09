'use client';

import { useSession } from 'next-auth/react';

export function useUser() {
  const { data: session, status } = useSession();

  const kakaoId = (session as any)?.kakaoId
    ? String((session as any).kakaoId)
    : null;
  const userName = session?.user?.name || null;
  const userImage = session?.user?.image || null;

  // 로그인된 경우 kakaoId 사용, 아니면 user_default 폴백
  const userId = kakaoId || 'user_default';

  return {
    session,
    status,
    isLoading: status === 'loading',
    isLoggedIn: status === 'authenticated',
    userId,
    kakaoId,
    userName,
    userImage,
  };
}
