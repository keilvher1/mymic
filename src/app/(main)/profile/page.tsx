'use client';

import { useState, useEffect } from 'react';
import { Settings, LogOut, ChevronRight, Music, Heart, Star, BarChart3, Loader2, Share2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { signOut } from 'next-auth/react';

interface UserStats {
  totalSongs: number;
  shareCount: number;
  categories: { label: string; count: number }[];
}

export default function ProfilePage() {
  const { userId, userName, userImage, isLoggedIn, isLoading: userLoading } = useUser();
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
      {/* 프로필 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-bold text-2xl">프로필</h1>
        <button className="p-2 rounded-xl bg-surface-light border border-white/10 hover:bg-white/10 transition-colors">
          <Settings size={18} className="text-gray-400" />
        </button>
      </div>

      {/* 프로필 카드 */}
      <div className="card-neon rounded-2xl p-6 mb-6 text-center">
        {userImage ? (
          <img
            src={userImage}
            alt={displayName}
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-neon flex items-center justify-center text-3xl font-bold mx-auto mb-3">
            {displayName.charAt(0)}
          </div>
        )}
        <h2 className="font-heading font-bold text-xl">{displayName}</h2>
        <p className="text-sm text-gray-400 mt-1">
          {isLoggedIn ? '카카오 로그인' : '게스트 모드'}
        </p>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
          <div>
            <p className="font-bold text-lg text-primary-light">{stats?.totalSongs || 0}</p>
            <p className="text-[10px] text-gray-500">저장된 곡</p>
          </div>
          <div>
            <p className="font-bold text-lg text-secondary-light">{stats?.categories?.length || 0}</p>
            <p className="text-[10px] text-gray-500">장르</p>
          </div>
          <div>
            <p className="font-bold text-lg text-tertiary-light">{stats?.shareCount || 0}</p>
            <p className="text-[10px] text-gray-500">공유 리스트</p>
          </div>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="card-neon rounded-2xl overflow-hidden mb-6">
        {[
          { icon: Music, label: '내 애창곡 관리', href: '/search' },
          { icon: Heart, label: '즐겨찾기', href: '/search' },
          { icon: Share2, label: '공유 리스트', href: '/share' },
          { icon: BarChart3, label: '활동 통계', href: '#' },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
          >
            <item.icon size={18} className="text-gray-400" />
            <span className="flex-1 text-sm text-left">{item.label}</span>
            <ChevronRight size={16} className="text-gray-600" />
          </a>
        ))}
      </div>

      {/* 로그아웃 */}
      {isLoggedIn ? (
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-500 hover:text-tertiary transition-colors"
        >
          <LogOut size={16} />
          <span>로그아웃</span>
        </button>
      ) : (
        <a
          href="/login"
          className="w-full flex items-center justify-center gap-2 py-3 text-sm text-primary-light hover:text-primary transition-colors"
        >
          <span>카카오로 로그인하기</span>
        </a>
      )}
    </div>
  );
}
