'use client';

import { signIn } from 'next-auth/react';
import { Mic } from 'lucide-react';

export default function LoginPage() {
  const handleKakaoLogin = () => {
    // NextAuth signIn 함수로 카카오 OAuth 플로우 시작
    signIn('kakao', { callbackUrl: '/home' });
  };

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col items-center justify-center px-6">
      {/* 로고 */}
      <div className="w-24 h-24 rounded-3xl bg-gradient-neon flex items-center justify-center mb-8 neon-glow">
        <Mic size={44} className="text-white" />
      </div>

      <h1 className="font-heading font-extrabold text-3xl mb-2">
        <span className="bg-gradient-neon bg-clip-text text-transparent">마이마이크</span>
      </h1>
      <p className="text-sm text-gray-400 mb-12">로그인하고 나만의 애창곡을 관리하세요</p>

      {/* 카카오 로그인 */}
      <button
        onClick={handleKakaoLogin}
        className="btn-kakao w-full max-w-xs flex items-center justify-center gap-3 text-base py-4"
      >
        <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
          <path d="M9 1C4.58 1 1 3.8 1 7.19c0 2.19 1.44 4.11 3.62 5.2-.16.56-.57 2.04-.66 2.36-.1.4.15.39.31.28.13-.08 2.07-1.39 2.9-1.96.59.09 1.19.13 1.83.13 4.42 0 8-2.8 8-6.19C17 3.8 13.42 1 9 1z" fill="#191919"/>
        </svg>
        카카오 로그인
      </button>

      <p className="text-[10px] text-gray-600 mt-6 text-center max-w-xs leading-relaxed">
        로그인 시 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
      </p>
    </div>
  );
}
