'use client';

import { useState } from 'react';
import { Share2, Copy, Check, ExternalLink, Trophy, Star, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopRecord {
  rank: number;
  title: string;
  artist: string;
  score: number;
}

const DEMO_RECORDS: TopRecord[] = [
  { rank: 1, title: 'Hype Boy', artist: 'NewJeans', score: 95 },
  { rank: 2, title: 'Seven', artist: '정국', score: 92 },
  { rank: 3, title: '사건의 지평선', artist: '윤하', score: 88 },
];

export default function SharePage() {
  const [copied, setCopied] = useState(false);
  const userName = '지훈';
  const totalSongs = 86;
  const shareUrl = 'mymic.app/s/abc123';

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKakaoShare = () => {
    // TODO: 카카오 SDK 연동 후 구현
    alert('카카오톡 공유 기능은 카카오 SDK 연동 후 사용 가능합니다.');
  };

  return (
    <div className="px-4 pt-12 animate-fade-in">
      {/* 헤더 */}
      <h1 className="font-heading font-bold text-2xl mb-6">공유하기</h1>

      {/* 프로필 카드 */}
      <div className="card-neon rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-neon opacity-5" />
        <div className="relative z-10">
          {/* TOP PERFORMER 뱃지 */}
          <div className="flex items-center gap-1.5 mb-4">
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">
              Top Performer
            </span>
          </div>

          {/* 프로필 */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-neon flex items-center justify-center text-2xl font-bold">
              {userName.charAt(0)}
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl">{userName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-400">{totalSongs}곡 보유</span>
                <span className="text-gray-600">·</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={12} className={i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 최고 기록 */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Top Records</h3>
            {DEMO_RECORDS.map((record) => (
              <div key={record.rank} className="flex items-center gap-3 py-2">
                <span className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                  record.rank === 1 ? 'bg-yellow-400/20 text-yellow-400' :
                  record.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                  'bg-orange-400/20 text-orange-400'
                )}>
                  {record.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{record.title}</p>
                  <p className="text-xs text-gray-500">{record.artist}</p>
                </div>
                <span className="text-sm font-bold text-primary-light">{record.score}점</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 공유 버튼들 */}
      <div className="space-y-3">
        {/* 카카오톡 공유 */}
        <button
          onClick={handleKakaoShare}
          className="w-full btn-kakao flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1C4.58 1 1 3.8 1 7.19c0 2.19 1.44 4.11 3.62 5.2-.16.56-.57 2.04-.66 2.36-.1.4.15.39.31.28.13-.08 2.07-1.39 2.9-1.96.59.09 1.19.13 1.83.13 4.42 0 8-2.8 8-6.19C17 3.8 13.42 1 9 1z" fill="#191919"/>
          </svg>
          <span>카카오톡으로 공유</span>
        </button>

        {/* 링크 복사 */}
        <button
          onClick={handleCopy}
          className="w-full btn-secondary flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check size={18} className="text-green-400" />
              <span className="text-green-400">복사됨!</span>
            </>
          ) : (
            <>
              <Copy size={18} />
              <span>링크 복사</span>
            </>
          )}
        </button>
      </div>

      {/* 공유 리스트 관리 */}
      <section className="mt-8 mb-8">
        <h2 className="font-heading font-bold text-lg mb-4">내 공유 리스트</h2>
        <div className="text-center py-8">
          <Share2 size={40} className="mx-auto text-gray-700 mb-3" />
          <p className="text-gray-400 text-sm">아직 공유 리스트가 없어요</p>
          <p className="text-xs text-gray-600 mt-1">내 애창곡으로 공유 리스트를 만들어보세요</p>
          <button className="btn-primary mt-4 text-sm">
            + 새 공유 리스트 만들기
          </button>
        </div>
      </section>
    </div>
  );
}
