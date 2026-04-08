'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Music,
  Share2,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  Activity,
  Loader2,
  AlertCircle,
  ListMusic,
} from 'lucide-react';

interface StatsData {
  totalUsers: number;
  totalSongs: number;
  totalUserSongs: number;
  totalShares: number;
  popularSongs: { title: string; artist: string; count: number; genre?: string }[];
  genreDistribution: { name: string; count: number; percentage: number }[];
  tjCount: number;
  kyCount: number;
  shareStatus: { active: number; reported: number; hidden: number };
}

const GENRE_COLORS: Record<string, string> = {
  'kpop': '#7C3AED',
  'ballad': '#06B6D4',
  'rnb': '#FF2D55',
  'hiphop': '#F59E0B',
  'rock': '#EF4444',
  'trot': '#10B981',
  'pop': '#8B5CF6',
  'etc': '#6B7280',
};

const GENRE_LABELS: Record<string, string> = {
  'kpop': 'K-POP',
  'ballad': '발라드',
  'rnb': 'R&B',
  'hiphop': '힙합',
  'rock': '록',
  'trot': '트로트',
  'pop': 'POP',
  'etc': '기타',
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
}) {
  return (
    <div className="card-neon p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${color}20` }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold font-heading">{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
        <span className="ml-3 text-gray-400">데이터 로딩 중...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <p className="text-lg font-medium text-red-400">데이터를 불러올 수 없습니다</p>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
        <button onClick={fetchStats} className="mt-4 px-4 py-2 rounded-lg bg-primary/20 text-primary-light text-sm hover:bg-primary/30 transition-colors">
          다시 시도
        </button>
      </div>
    );
  }

  const totalTjKy = stats.tjCount + stats.kyCount;
  const tjPercent = totalTjKy > 0 ? Math.round((stats.tjCount / totalTjKy) * 100) : 50;
  const kyPercent = totalTjKy > 0 ? 100 - tjPercent : 50;

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl">대시보드</h1>
          <p className="text-sm text-gray-400 mt-1">Firebase 실시간 데이터 기반</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 hover:bg-white/10 transition-colors"
          >
            새로고침
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <Activity size={14} className="text-green-400" />
            <span className="text-xs text-green-400 font-medium">운영 중</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="활성 사용자" value={stats.totalUsers} icon={Users} color="#7C3AED" />
        <StatCard label="등록된 곡" value={stats.totalSongs} icon={Music} color="#06B6D4" />
        <StatCard label="저장된 곡 (전체)" value={stats.totalUserSongs} icon={ListMusic} color="#F59E0B" />
        <StatCard label="공유 리스트" value={stats.totalShares} icon={Share2} color="#FF2D55" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Genre Distribution */}
        <div className="lg:col-span-2 card-neon p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold text-lg">카테고리 분포</h2>
              <p className="text-xs text-gray-500 mt-0.5">사용자가 저장한 곡 기준</p>
            </div>
            <BarChart3 size={18} className="text-gray-500" />
          </div>
          {stats.genreDistribution.length > 0 ? (
            <>
              <div className="flex items-end gap-2 h-32 mb-4">
                {stats.genreDistribution.slice(0, 8).map((g) => {
                  const maxPct = Math.max(...stats.genreDistribution.map(d => d.percentage));
                  return (
                    <div key={g.name} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-400">{g.percentage}%</span>
                      <div
                        className="w-full rounded-t-md transition-all duration-500"
                        style={{
                          height: `${maxPct > 0 ? (g.percentage / maxPct) * 100 : 0}%`,
                          minHeight: 4,
                          backgroundColor: GENRE_COLORS[g.name] || '#6B7280',
                        }}
                      />
                      <span className="text-[10px] text-gray-500">{GENRE_LABELS[g.name] || g.name}</span>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-xs text-gray-500">가장 인기 카테고리</p>
                  <p className="text-lg font-bold text-primary-light mt-0.5">
                    {GENRE_LABELS[stats.genreDistribution[0]?.name] || stats.genreDistribution[0]?.name || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">총 카테고리 수</p>
                  <p className="text-lg font-bold text-secondary-light mt-0.5">
                    {stats.genreDistribution.length}개
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
              아직 데이터가 없습니다
            </div>
          )}
        </div>

        {/* Popular Songs */}
        <div className="card-neon p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-lg">인기 곡 TOP 5</h2>
            <ArrowUpRight size={16} className="text-gray-500" />
          </div>
          {stats.popularSongs.length > 0 ? (
            <div className="space-y-3">
              {stats.popularSongs.slice(0, 5).map((song, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
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
                    <span className="text-xs text-gray-400">{song.count}회</span>
                    <TrendingUp size={12} className="text-green-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
              아직 저장된 곡이 없습니다
            </div>
          )}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-neon p-5 rounded-2xl">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            장르 분포
          </h3>
          {stats.genreDistribution.length > 0 ? (
            <div className="space-y-2">
              {stats.genreDistribution.slice(0, 5).map((g) => (
                <div key={g.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{GENRE_LABELS[g.name] || g.name}</span>
                    <span className="font-medium">{g.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${g.percentage}%`,
                        backgroundColor: GENRE_COLORS[g.name] || '#6B7280',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">데이터 없음</p>
          )}
        </div>

        <div className="card-neon p-5 rounded-2xl">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            노래방 번호 등록 현황
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">TJ 미디어</span>
              <span className="text-sm font-bold text-primary-light">
                {stats.tjCount}곡 ({tjPercent}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">금영 (KY)</span>
              <span className="text-sm font-bold text-secondary-light">
                {stats.kyCount}곡 ({kyPercent}%)
              </span>
            </div>
          </div>
          {totalTjKy > 0 ? (
            <div className="flex gap-1 mt-4">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${tjPercent}%` }} />
              <div className="h-2 rounded-full bg-secondary" style={{ width: `${kyPercent}%` }} />
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center mt-4">번호 등록 데이터 없음</p>
          )}
        </div>

        <div className="card-neon p-5 rounded-2xl">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            공유 리스트 현황
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">활성</span>
              <span className="text-sm font-bold text-green-400">{stats.shareStatus.active}개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">신고됨</span>
              <span className="text-sm font-bold text-yellow-400">{stats.shareStatus.reported}개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">숨김</span>
              <span className="text-sm font-bold text-red-400">{stats.shareStatus.hidden}개</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
