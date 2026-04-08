'use client';

import { useState } from 'react';
import {
  Search,
  Eye,
  Trash2,
  Link2,
  ExternalLink,
  Calendar,
  User,
  Music,
  Flag,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

interface SharedList {
  id: string;
  title: string;
  creator: string;
  creatorKakaoId: string;
  songCount: number;
  viewCount: number;
  shareLink: string;
  createdAt: string;
  status: 'active' | 'reported' | 'hidden';
  songs: { title: string; artist: string }[];
}

const mockShares: SharedList[] = [
  {
    id: '1',
    title: '노래방 가면 무조건 부르는 곡',
    creator: '예진',
    creatorKakaoId: '8374651920',
    songCount: 15,
    viewCount: 234,
    shareLink: 'mymic.app/s/abc123',
    createdAt: '2026-04-05',
    status: 'active',
    songs: [
      { title: 'APT.', artist: 'ROSÉ & Bruno Mars' },
      { title: 'Hype Boy', artist: 'NewJeans' },
      { title: 'Seven', artist: '정국' },
    ],
  },
  {
    id: '2',
    title: '발라드 모음집',
    creator: '재호',
    creatorKakaoId: '7291038465',
    songCount: 22,
    viewCount: 189,
    shareLink: 'mymic.app/s/def456',
    createdAt: '2026-04-03',
    status: 'active',
    songs: [
      { title: '사건의 지평선', artist: '윤하' },
      { title: '첫사랑', artist: '백아' },
    ],
  },
  {
    id: '3',
    title: '회식 2차 필수 리스트',
    creator: '서현',
    creatorKakaoId: '6473829105',
    songCount: 30,
    viewCount: 456,
    shareLink: 'mymic.app/s/ghi789',
    createdAt: '2026-03-28',
    status: 'active',
    songs: [
      { title: '밤양갱', artist: '비비' },
      { title: 'Supernova', artist: 'aespa' },
      { title: '고민중독', artist: 'QWER' },
    ],
  },
  {
    id: '4',
    title: '부적절한 리스트',
    creator: '도윤',
    creatorKakaoId: '5019283746',
    songCount: 5,
    viewCount: 12,
    shareLink: 'mymic.app/s/jkl012',
    createdAt: '2026-04-01',
    status: 'reported',
    songs: [{ title: '테스트곡', artist: '테스트' }],
  },
  {
    id: '5',
    title: '감성 힙합 플레이리스트',
    creator: '수연',
    creatorKakaoId: '2847561023',
    songCount: 18,
    viewCount: 321,
    shareLink: 'mymic.app/s/mno345',
    createdAt: '2026-03-25',
    status: 'active',
    songs: [
      { title: 'Still Life', artist: 'BIGBANG' },
      { title: 'LOVE DIVE', artist: 'IVE' },
    ],
  },
  {
    id: '6',
    title: '숨겨진 명곡 리스트',
    creator: '하은',
    creatorKakaoId: '4058291736',
    songCount: 12,
    viewCount: 87,
    shareLink: 'mymic.app/s/pqr678',
    createdAt: '2026-04-07',
    status: 'hidden',
    songs: [{ title: '비가 오는 날엔', artist: '비스트' }],
  },
];

export default function SharesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'reported' | 'hidden'>('all');
  const [selectedShare, setSelectedShare] = useState<SharedList | null>(null);

  const filtered = mockShares.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.creator.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    all: mockShares.length,
    active: mockShares.filter((s) => s.status === 'active').length,
    reported: mockShares.filter((s) => s.status === 'reported').length,
    hidden: mockShares.filter((s) => s.status === 'hidden').length,
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl">공유 리스트 관리</h1>
        <p className="text-sm text-gray-400 mt-1">
          총 {mockShares.length}개의 공유 리스트를 관리합니다
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(
          [
            { key: 'all', label: '전체', color: '#7C3AED' },
            { key: 'active', label: '활성', color: '#22C55E' },
            { key: 'reported', label: '신고됨', color: '#F59E0B' },
            { key: 'hidden', label: '숨김', color: '#EF4444' },
          ] as const
        ).map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key)}
            className={`p-4 rounded-xl border transition-all text-left ${
              statusFilter === s.key
                ? 'border-primary/30 bg-primary/10'
                : 'border-white/5 bg-surface-light hover:bg-white/5'
            }`}
          >
            <p className="text-2xl font-bold" style={{ color: s.color }}>
              {statusCounts[s.key]}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="리스트 제목 또는 작성자로 검색..."
          className="input-dark w-full pl-10 py-2.5 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((share) => (
          <div
            key={share.id}
            className="card-neon p-5 rounded-2xl hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{share.title}</h3>
                  {share.status === 'reported' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      <AlertTriangle size={10} /> 신고
                    </span>
                  )}
                  {share.status === 'hidden' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                      숨김
                    </span>
                  )}
                  {share.status === 'active' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                      <CheckCircle size={10} /> 활성
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User size={12} /> {share.creator}
                  </span>
                  <span className="flex items-center gap-1">
                    <Music size={12} /> {share.songCount}곡
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {share.viewCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {share.createdAt}
                  </span>
                </div>

                <div className="flex items-center gap-1 mt-2">
                  <Link2 size={12} className="text-gray-600" />
                  <span className="text-[10px] text-gray-600 font-mono">
                    {share.shareLink}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setSelectedShare(share)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  title="상세 보기"
                >
                  <ExternalLink size={16} />
                </button>
                {share.status === 'reported' && (
                  <button
                    className="p-2 rounded-lg hover:bg-yellow-500/10 text-gray-400 hover:text-yellow-400 transition-colors"
                    title="숨김 처리"
                  >
                    <Flag size={16} />
                  </button>
                )}
                <button
                  className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                  title="삭제"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-gray-500">
          {filtered.length}개 중 1-{filtered.length} 표시
        </p>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500">
            <ChevronLeft size={16} />
          </button>
          <button className="w-8 h-8 rounded-lg bg-primary/20 text-primary-light text-xs font-medium">
            1
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedShare && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedShare(null)}
        >
          <div
            className="card-neon p-6 rounded-2xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-heading font-bold text-lg mb-1">
              {selectedShare.title}
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              by {selectedShare.creator} · {selectedShare.createdAt}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-surface-light rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-primary-light">
                  {selectedShare.songCount}
                </p>
                <p className="text-[10px] text-gray-500">곡</p>
              </div>
              <div className="bg-surface-light rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-secondary-light">
                  {selectedShare.viewCount}
                </p>
                <p className="text-[10px] text-gray-500">조회수</p>
              </div>
              <div className="bg-surface-light rounded-xl p-3 text-center">
                <p className="text-lg font-bold">
                  {selectedShare.status === 'active'
                    ? '✅'
                    : selectedShare.status === 'reported'
                    ? '⚠️'
                    : '🚫'}
                </p>
                <p className="text-[10px] text-gray-500">
                  {selectedShare.status === 'active'
                    ? '활성'
                    : selectedShare.status === 'reported'
                    ? '신고됨'
                    : '숨김'}
                </p>
              </div>
            </div>

            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              포함된 곡 (미리보기)
            </h3>
            <div className="space-y-2 mb-5">
              {selectedShare.songs.map((song, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 px-3 bg-surface-light rounded-xl"
                >
                  <Music size={14} className="text-gray-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{song.title}</p>
                    <p className="text-[10px] text-gray-500">{song.artist}</p>
                  </div>
                </div>
              ))}
              {selectedShare.songCount > selectedShare.songs.length && (
                <p className="text-xs text-gray-500 text-center py-1">
                  외 {selectedShare.songCount - selectedShare.songs.length}곡 더
                </p>
              )}
            </div>

            <div className="flex gap-3">
              {selectedShare.status === 'reported' && (
                <button className="btn-primary flex-1 text-sm">숨김 처리</button>
              )}
              {selectedShare.status === 'hidden' && (
                <button className="btn-primary flex-1 text-sm">활성화</button>
              )}
              <button
                onClick={() => setSelectedShare(null)}
                className="btn-secondary flex-1 text-sm"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
