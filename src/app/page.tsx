'use client';

import Link from 'next/link';
import { Mic, Search, Sparkles, Share2, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Search,
    title: '노래 검색 & 저장',
    desc: 'Spotify 연동으로 간편하게 검색하고 내 애창곡에 저장하세요',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: Sparkles,
    title: 'AI 맞춤 추천',
    desc: '분위기와 상황을 말하면 AI가 딱 맞는 곡을 골라줘요',
    color: 'text-primary-light',
    bg: 'bg-primary/10',
  },
  {
    icon: Share2,
    title: '친구와 공유',
    desc: '내 애창곡 리스트를 카카오톡으로 공유하세요',
    color: 'text-tertiary',
    bg: 'bg-tertiary/10',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-dark flex flex-col">
      {/* 히어로 */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center">
        {/* 로고 */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-neon flex items-center justify-center mb-6 neon-glow animate-pulse-neon">
          <Mic size={36} className="text-white" />
        </div>

        <h1 className="font-heading font-extrabold text-4xl mb-3">
          <span className="bg-gradient-neon bg-clip-text text-transparent">마이마이크</span>
        </h1>
        <p className="text-lg text-gray-300 font-heading font-medium">MyMic</p>
        <p className="text-sm text-gray-500 mt-3 max-w-xs leading-relaxed">
          노래방에서 &quot;뭐 부르지?&quot; 고민 끝!<br />
          AI가 추천해주는 나만의 애창곡 관리 서비스
        </p>

        {/* CTA */}
        <Link href="/login" className="mt-8 w-full max-w-xs">
          <button className="btn-kakao w-full flex items-center justify-center gap-2 text-base">
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M9 1C4.58 1 1 3.8 1 7.19c0 2.19 1.44 4.11 3.62 5.2-.16.56-.57 2.04-.66 2.36-.1.4.15.39.31.28.13-.08 2.07-1.39 2.9-1.96.59.09 1.19.13 1.83.13 4.42 0 8-2.8 8-6.19C17 3.8 13.42 1 9 1z" fill="#191919"/>
            </svg>
            카카오로 시작하기
          </button>
        </Link>

        <Link href="/home" className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
          둘러보기 <ArrowRight size={12} />
        </Link>
      </section>

      {/* 기능 소개 */}
      <section className="px-6 pb-16">
        <div className="flex flex-col gap-4">
          {FEATURES.map((feat) => (
            <div key={feat.title} className="card-neon p-5 rounded-2xl flex items-start gap-4">
              <div className={`p-3 rounded-xl ${feat.bg} flex-shrink-0`}>
                <feat.icon size={22} className={feat.color} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm mb-1">{feat.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="text-center py-6 text-xs text-gray-600">
        <p>Made with 🎤 by MyMic Team</p>
      </footer>
    </div>
  );
}
