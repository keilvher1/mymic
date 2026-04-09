'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Music, ChevronRight, TrendingUp, Loader2 } from 'lucide-react';
import AddSongFAB from '@/components/AddSongFAB';
import { useUser } from '@/hooks/useUser';
import { formatDuration } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  kpop: 'from-primary to-secondary',
  'K-POP': 'from-primary to-secondary',
  pop: 'from-secondary to-neon-blue',
  ballad: 'from-secondary to-neon-blue',
  rnb: 'from-tertiary to-primary',
  hiphop: 'from-neon-pink to-tertiary',
  rock: 'from-tertiary to-tertiary-dark',
  etc: 'from-gray-600 to-gray-700',
};

const CATEGORY_LABELS: Record<string, string> = {
  kpop: 'K-POP',
  'K-POP': 'K-POP',
  pop: 'POP',
  ballad: '발라드',
  rnb: 'R&B',
  hiphop: '힙합',
  rock: '록',
  etc: '기타',
};

interface UserStats {
  totalSongs: number;
  shareCount: number;
  categories: { label: string; count: number }[];
  recentSongs: any[];
}

export default function HomePage() {
  const { userId, userName, isLoading: userLoading } = useUser();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/user/stats', {
          headers: { 'x-user-id': userId },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [userId, userLoading]);

  const displayName = userName || '게스트';

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-12 animate-fade-in">
      {/* 인사 헤더 */}
      <section className="mb-8">
        <p className="text-gray-400 text-sm">안녕하세요 👋</p>
        <h1 className="text-2xl font-heading font-bold mt-1">
          <span className="bg-gradient-neon bg-clip-text text-transparent">{displayName}</span>님!
        </h1>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
            <Music size={14} className="text-primary-light" />
            <span className="text-sm font-semibold text-primary-light">{stats?.totalSongs || 0}곡</span>
          </div>
          <span className="text-xs text-gray-500">저장됨</span>
        </div>
      </section>

      {/* 즐겨찾는 카테고리 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-lg">즐겨찾는 장르</h2>
          <Link href="/search" className="text-xs text-gray-400 flex items-center gap-0.5">
            전체보기 <ChevronRight size={14} />
          </Link>
        </div>
        {stats?.categories && stats.categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {stats.categories.slice(0, 4).map((cat) => (
              <div
                key={cat.label}
                className="card-neon p-4 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_COLORS[cat.label] || 'from-gray-600 to-gray-700'} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <h3 className="font-semibold text-sm relative z-10">{CATEGORY_LABELS[cat.label] || cat.label}</h3>
                <p className="text-xs text-gray-400 mt-0.5 relative z-10">{cat.count}곡</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-neon rounded-2xl p-6 text-center">
            <Music size={32} className="mx-auto text-gray-600 mb-2" />
            <p className="text-sm text-gray-400">아직 저장된 곡이 없어요</p>
            <Link href="/search" className="text-xs text-primary-light mt-1 inline-block">
              곡을 검색해서 추가해보세요 →
            </Link>
          </div>
        )}
      </section>

      {/* 최근 추가한 곡 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-lg">최근 추가한 곡</h2>
          <Link href="/search" className="text-xs text-gray-400 flex items-center gap-0.5">
            전체보기 <ChevronRight size={14} />
          </Link>
        </div>
        {stats?.recentSongs && stats.recentSongs.length > 0 ? (
          <div className="flex flex-col gap-2">
            {stats.recentSongs.map((item: any) => (
              <div
                key={item.id}
                className="card-neon flex items-center gap-3 p-3 rounded-xl"
              >
                {item.song?.albumArtUrl ? (
                  <Image
                    src={item.song.albumArtUrl}
                    alt={item.song.title}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-surface-light flex items-center justify-center flex-shrink-0">
                    <Music size={18} className="text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{item.song?.title}</h3>
                  <p className="text-xs text-gray-400 truncate">{item.song?.artist}</p>
                </div>
                {(item.tjNumber || item.kyNumber) && (
                  <div className="text-right flex-shrink-0">
                    {item.tjNumber && <p className="text-[10px] text-primary-light">TJ {item.tjNumber}</p>}
                    {item.kyNumber && <p className="text-[10px] text-secondary-light">KY {item.kyNumber}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">최근 추가한 곡이 없습니다</p>
          </div>
        )}
      </section>

      {/* AI 추천 배너 */}
      <section className="mb-8">
        <Link href="/recommend">
          <div className="card-neon p-5 rounded-2xl relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-neon opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-secondary" />
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider">AI Pick of the Night</span>
              </div>
              <h3 className="font-heading font-bold text-lg mb-1">오늘 밤, 뭐 부를까?</h3>
              <p className="text-sm text-gray-400">
                AI가 당신의 취향과 분위기에 맞는 곡을 추천해드려요
              </p>
            </div>
          </div>
        </Link>
      </section>

      <AddSongFAB />
    </div>
  );
}
