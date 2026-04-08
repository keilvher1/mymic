'use client';

import { Settings, LogOut, ChevronRight, Music, Heart, Star, BarChart3 } from 'lucide-react';

export default function ProfilePage() {
  const userName = '지훈';
  const totalSongs = 86;

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
        <div className="w-20 h-20 rounded-full bg-gradient-neon flex items-center justify-center text-3xl font-bold mx-auto mb-3">
          {userName.charAt(0)}
        </div>
        <h2 className="font-heading font-bold text-xl">{userName}</h2>
        <p className="text-sm text-gray-400 mt-1">카카오 로그인</p>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
          <div>
            <p className="font-bold text-lg text-primary-light">{totalSongs}</p>
            <p className="text-[10px] text-gray-500">저장된 곡</p>
          </div>
          <div>
            <p className="font-bold text-lg text-secondary-light">12</p>
            <p className="text-[10px] text-gray-500">AI 추천</p>
          </div>
          <div>
            <p className="font-bold text-lg text-tertiary-light">3</p>
            <p className="text-[10px] text-gray-500">공유 리스트</p>
          </div>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="card-neon rounded-2xl overflow-hidden mb-6">
        {[
          { icon: Music, label: '내 애창곡 관리', href: '/my' },
          { icon: Heart, label: '즐겨찾기', href: '/my' },
          { icon: Star, label: '자신감 레벨 설정', href: '/my' },
          { icon: BarChart3, label: '활동 통계', href: '#' },
        ].map((item, i) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
          >
            <item.icon size={18} className="text-gray-400" />
            <span className="flex-1 text-sm text-left">{item.label}</span>
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        ))}
      </div>

      {/* 로그아웃 */}
      <button className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-500 hover:text-tertiary transition-colors">
        <LogOut size={16} />
        <span>로그아웃</span>
      </button>
    </div>
  );
}
