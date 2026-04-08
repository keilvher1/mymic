'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Music,
  Share2,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  BarChart3,
  Activity,
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalSongs: number;
  totalShares: number;
  aiRecommendations: number;
  newUsersToday: number;
  newSongsToday: number;
}

interface PopularSong {
  title: string;
  artist: string;
  saves: number;
  trend: 'up' | 'down' | 'stable';
}

const mockStats: Stats = {
  totalUsers: 1247,
  totalSongs: 8934,
  totalShares: 456,
  aiRecommendations: 3210,
  newUsersToday: 23,
  newSongsToday: 156,
};

const mockPopularSongs: PopularSong[] = [
  { title: 'APT.', artist: 'ROSÉ & Bruno Mars', saves: 342, trend: 'up' },
  { title: 'Whiplash', artist: 'aespa', saves: 289, trend: 'up' },
  { title: 'Hype Boy', artist: 'NewJeans', saves: 256, trend: 'stable' },
  { title: 'Super Shy', artist: 'NewJeans', saves: 234, trend: 'down' },
  { title: 'Seven', artist: '정국', saves: 198, trend: 'stable' },
];

const mockWeeklyData = [
  { day: '월', users: 18, songs: 120 },
  { day: '화', users: 25, songs: 145 },
  { day: '수', users: 20, songs: 98 },
  { day: '목', users: 32, songs: 167 },
  { day: '금', users: 45, songs: 210 },
  { day: '토', users: 62, songs: 289 },
  { day: '일', users: 55, songs: 256 },
];

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  change: number;
  icon: any;
  color: string;
}) {
  return (
    <div className="card-neon p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`p-2.5 rounded-xl`}
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            change >= 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change >= 0 ? '+' : ''}{change}%
        </div>
      </div>
      <p className="text-2xl font-bold font-heading">{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function MiniBarChart({ data }: { data: typeof mockWeeklyData }) {
  const maxSongs = Math.max(...data.map((d) => d.songs));
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-primary to-secondary transition-all duration-500"
            style={{ height: `${(d.songs / maxSongs) * 100}%`, minHeight: 4 }}
          />
          <span className="text-[10px] text-gray-500">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(mockStats);

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl">대시보드</h1>
          <p className="text-sm text-gray-400 mt-1">서비스 현황을 한눈에 확인하세요</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <Activity size={14} className="text-green-400" />
          <span className="text-xs text-green-400 font-medium">운영 중</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="총 사용자"
          value={stats.totalUsers}
          change={12.5}
          icon={Users}
          color="#7C3AED"
        />
        <StatCard
          label="등록된 곡"
          value={stats.totalSongs}
          change={8.3}
          icon={Music}
          color="#06B6D4"
        />
        <StatCard
          label="공유 리스트"
          value={stats.totalShares}
          change={-2.1}
          icon={Share2}
          color="#FF2D55"
        />
        <StatCard
          label="AI 추천 횟수"
          value={stats.aiRecommendations}
          change={24.7}
          icon={Sparkles}
          color="#F59E0B"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 card-neon p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold text-lg">주간 활동</h2>
              <p className="text-xs text-gray-500 mt-0.5">곡 등록 추이</p>
            </div>
            <BarChart3 size={18} className="text-gray-500" />
          </div>
          <MiniBarChart data={mockWeeklyData} />
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/5">
            <div>
              <p className="text-xs text-gray-500">오늘 신규 가입</p>
              <p className="text-lg font-bold text-primary-light mt-0.5">
                +{stats.newUsersToday}명
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">오늘 등록된 곡</p>
              <p className="text-lg font-bold text-secondary-light mt-0.5">
                +{stats.newSongsToday}곡
              </p>
            </div>
          </div>
        </div>

        {/* Popular Songs */}
        <div className="card-neon p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-lg">인기 곡 TOP 5</h2>
            <ArrowUpRight size={16} className="text-gray-500" />
          </div>
          <div className="space-y-3">
            {mockPopularSongs.map((song, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2"
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i === 0
                      ? 'bg-yellow-400/20 text-yellow-400'
                      : i === 1
                      ? 'bg-gray-400/20 text-gray-400'
                      : i === 2
                      ? 'bg-orange-400/20 text-orange-400'
                      : 'bg-white/5 text-gray-500'
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  <p className="text-[10px] text-gray-500">{song.artist}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">{song.saves}</span>
                  {song.trend === 'up' && (
                    <TrendingUp size={12} className="text-green-400" />
                  )}
                  {song.trend === 'down' && (
                    <TrendingDown size={12} className="text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-neon p-5 rounded-2xl">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            장르 분포
          </h3>
          <div className="space-y-2">
            {[
              { genre: 'K-POP', pct: 45, color: '#7C3AED' },
              { genre: '발라드', pct: 22, color: '#06B6D4' },
              { genre: 'R&B', pct: 15, color: '#FF2D55' },
              { genre: '힙합', pct: 12, color: '#F59E0B' },
              { genre: '기타', pct: 6, color: '#6B7280' },
            ].map((g) => (
              <div key={g.genre}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{g.genre}</span>
                  <span className="font-medium">{g.pct}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${g.pct}%`, backgroundColor: g.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-neon p-5 rounded-2xl">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            노래방 기기 분포
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">TJ 미디어</span>
              <span className="text-sm font-bold text-primary-light">62%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">금영 (KY)</span>
              <span className="text-sm font-bold text-secondary-light">38%</span>
            </div>
          </div>
          <div className="flex gap-1 mt-4">
            <div className="h-2 rounded-full bg-primary" style={{ width: '62%' }} />
            <div className="h-2 rounded-full bg-secondary" style={{ width: '38%' }} />
          </div>
        </div>

        <div className="card-neon p-5 rounded-2xl">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            AI 추천 현황
          </h3>
          <div className="text-center py-2">
            <p className="text-3xl font-bold bg-gradient-neon bg-clip-text text-transparent">
              94.2%
            </p>
            <p className="text-xs text-gray-500 mt-1">추천 만족도</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/5">
            <div className="text-center">
              <p className="text-sm font-bold">2.8초</p>
              <p className="text-[10px] text-gray-500">평균 응답</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">5.2곡</p>
              <p className="text-[10px] text-gray-500">평균 추천</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
