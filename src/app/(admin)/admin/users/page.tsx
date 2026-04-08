'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Ban,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Music,
  Share2,
} from 'lucide-react';

interface User {
  id: string;
  kakaoId: string;
  nickname: string;
  profileImage: string;
  songCount: number;
  shareCount: number;
  joinedAt: string;
  lastActive: string;
  status: 'active' | 'banned';
}

const mockUsers: User[] = [
  {
    id: '1',
    kakaoId: '3912847561',
    nickname: '지훈',
    profileImage: '',
    songCount: 86,
    shareCount: 3,
    joinedAt: '2026-03-15',
    lastActive: '2026-04-08',
    status: 'active',
  },
  {
    id: '2',
    kakaoId: '2847561023',
    nickname: '수연',
    profileImage: '',
    songCount: 124,
    shareCount: 7,
    joinedAt: '2026-02-20',
    lastActive: '2026-04-08',
    status: 'active',
  },
  {
    id: '3',
    kakaoId: '1923847560',
    nickname: '민수',
    profileImage: '',
    songCount: 45,
    shareCount: 1,
    joinedAt: '2026-03-28',
    lastActive: '2026-04-07',
    status: 'active',
  },
  {
    id: '4',
    kakaoId: '8374651920',
    nickname: '예진',
    profileImage: '',
    songCount: 212,
    shareCount: 12,
    joinedAt: '2026-01-10',
    lastActive: '2026-04-08',
    status: 'active',
  },
  {
    id: '5',
    kakaoId: '5019283746',
    nickname: '도윤',
    profileImage: '',
    songCount: 33,
    shareCount: 0,
    joinedAt: '2026-04-01',
    lastActive: '2026-04-05',
    status: 'banned',
  },
  {
    id: '6',
    kakaoId: '6473829105',
    nickname: '서현',
    profileImage: '',
    songCount: 67,
    shareCount: 4,
    joinedAt: '2026-03-05',
    lastActive: '2026-04-08',
    status: 'active',
  },
  {
    id: '7',
    kakaoId: '7291038465',
    nickname: '재호',
    profileImage: '',
    songCount: 158,
    shareCount: 9,
    joinedAt: '2026-02-14',
    lastActive: '2026-04-07',
    status: 'active',
  },
  {
    id: '8',
    kakaoId: '4058291736',
    nickname: '하은',
    profileImage: '',
    songCount: 91,
    shareCount: 5,
    joinedAt: '2026-03-20',
    lastActive: '2026-04-08',
    status: 'active',
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      u.nickname.toLowerCase().includes(search.toLowerCase()) ||
      u.kakaoId.includes(search);
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl">사용자 관리</h1>
        <p className="text-sm text-gray-400 mt-1">
          전체 {mockUsers.length}명의 회원을 관리합니다
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="닉네임 또는 카카오 ID로 검색..."
            className="input-dark w-full pl-10 py-2.5 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'banned'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'bg-primary/20 text-primary-light border border-primary/30'
                  : 'bg-surface-light text-gray-400 border border-white/5 hover:bg-white/5'
              }`}
            >
              {s === 'all' ? '전체' : s === 'active' ? '활성' : '차단됨'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-neon rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">
                  사용자
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">
                  카카오 ID
                </th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">
                  곡 수
                </th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">
                  공유
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">
                  가입일
                </th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">
                  상태
                </th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">
                  액션
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-neon flex items-center justify-center text-xs font-bold">
                        {user.nickname[0]}
                      </div>
                      <span className="text-sm font-medium">{user.nickname}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono text-gray-400">
                      {user.kakaoId}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-medium">{user.songCount}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm">{user.shareCount}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-gray-400">{user.joinedAt}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        <UserCheck size={10} /> 활성
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        <UserX size={10} /> 차단
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setMenuOpenId(menuOpenId === user.id ? null : user.id)
                        }
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <MoreVertical size={16} className="text-gray-500" />
                      </button>
                      {menuOpenId === user.id && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-surface-light border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                          <button
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-300 hover:bg-white/5 transition-colors"
                            onClick={() => {
                              setSelectedUser(user);
                              setMenuOpenId(null);
                            }}
                          >
                            <Eye size={14} /> 상세 보기
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-yellow-400 hover:bg-white/5 transition-colors">
                            <Ban size={14} />{' '}
                            {user.status === 'active' ? '차단' : '차단 해제'}
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:bg-white/5 transition-colors">
                            <Trash2 size={14} /> 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
          <p className="text-xs text-gray-500">
            {filtered.length}명 중 1-{Math.min(filtered.length, 10)} 표시
          </p>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary/20 text-primary-light text-xs font-medium">
              1
            </button>
            <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="card-neon p-6 rounded-2xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-neon flex items-center justify-center text-xl font-bold">
                {selectedUser.nickname[0]}
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg">
                  {selectedUser.nickname}
                </h2>
                <p className="text-xs text-gray-400 font-mono">
                  ID: {selectedUser.kakaoId}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-light rounded-xl p-3 text-center">
                <Music size={16} className="text-primary-light mx-auto mb-1" />
                <p className="text-lg font-bold">{selectedUser.songCount}</p>
                <p className="text-[10px] text-gray-500">저장된 곡</p>
              </div>
              <div className="bg-surface-light rounded-xl p-3 text-center">
                <Share2 size={16} className="text-secondary-light mx-auto mb-1" />
                <p className="text-lg font-bold">{selectedUser.shareCount}</p>
                <p className="text-[10px] text-gray-500">공유 리스트</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">가입일</span>
                <span>{selectedUser.joinedAt}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">마지막 활동</span>
                <span>{selectedUser.lastActive}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">상태</span>
                <span
                  className={
                    selectedUser.status === 'active'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  {selectedUser.status === 'active' ? '활성' : '차단됨'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="btn-secondary w-full mt-6 text-sm"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
