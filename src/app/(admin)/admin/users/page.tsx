'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Ban,
  Shield,
  X,
  Music,
  Share2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface User {
  id: string;
  kakaoId: string;
  nickname: string;
  avatarUrl: string | null;
  songCount: number;
  shareCount: number;
  joinedAt: string;
  lastActive: string;
  status: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      setActionMenuId(null);
    } catch (err: any) {
      alert('상태 변경 실패: ' + err.message);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = !search ||
        user.nickname.toLowerCase().includes(search.toLowerCase()) ||
        user.kakaoId.includes(search);
      const matchStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [users, search, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
        <span className="ml-3 text-gray-400">사용자 데이터 로딩 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <p className="text-lg font-medium text-red-400">데이터를 불러올 수 없습니다</p>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
        <button onClick={fetchUsers} className="mt-4 px-4 py-2 rounded-lg bg-primary/20 text-primary-light text-sm">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl">사용자 관리</h1>
          <p className="text-sm text-gray-400 mt-1">총 {users.length}명의 사용자</p>
        </div>
        <button onClick={fetchUsers} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 hover:bg-white/10 transition-colors">
          <RefreshCw size={12} />
          새로고침
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="닉네임 또는 카카오 ID로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-light rounded-xl text-sm border border-white/5 focus:border-primary/30 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-500" />
          {['all', 'active', 'banned'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-primary/20 text-primary-light border border-primary/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {s === 'all' ? '전체' : s === 'active' ? '활성' : '차단'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="card-neon rounded-2xl p-12 text-center">
          <p className="text-gray-500">
            {users.length === 0 ? '아직 사용자가 없습니다' : '검색 결과가 없습니다'}
          </p>
        </div>
      ) : (
        <div className="card-neon rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">사용자</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">카카오 ID</th>
                  <th className="text-center text-xs font-medium text-gray-500 px-5 py-3">곡 수</th>
                  <th className="text-center text-xs font-medium text-gray-500 px-5 py-3">공유</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">최근 활동</th>
                  <th className="text-center text-xs font-medium text-gray-500 px-5 py-3">상태</th>
                  <th className="text-center text-xs font-medium text-gray-500 px-5 py-3">액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-neon flex items-center justify-center text-xs font-bold">
                          {user.nickname.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">{user.nickname}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400 font-mono">{user.kakaoId}</td>
                    <td className="px-5 py-3 text-center text-sm">{user.songCount}</td>
                    <td className="px-5 py-3 text-center text-sm">{user.shareCount}</td>
                    <td className="px-5 py-3 text-xs text-gray-400">
                      {new Date(user.lastActive).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        user.status === 'active'
                          ? 'bg-green-400/10 text-green-400'
                          : 'bg-red-400/10 text-red-400'
                      }`}>
                        {user.status === 'active' ? '활성' : '차단'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="relative">
                        <button
                          onClick={() => setActionMenuId(actionMenuId === user.id ? null : user.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <MoreVertical size={14} className="text-gray-500" />
                        </button>
                        {actionMenuId === user.id && (
                          <div className="absolute right-0 top-full mt-1 bg-surface-light border border-white/10 rounded-lg shadow-xl z-10 py-1 min-w-[120px]">
                            <button
                              onClick={() => { setSelectedUser(user); setActionMenuId(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/5"
                            >
                              <Eye size={12} /> 상세 보기
                            </button>
                            <button
                              onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'banned' : 'active')}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-yellow-400 hover:bg-white/5"
                            >
                              {user.status === 'active' ? <Ban size={12} /> : <Shield size={12} />}
                              {user.status === 'active' ? '차단' : '활성화'}
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
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold text-lg">사용자 정보</h3>
              <button onClick={() => setSelectedUser(null)} className="p-1 rounded-lg hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-neon flex items-center justify-center text-lg font-bold">
                {selectedUser.nickname.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-lg">{selectedUser.nickname}</p>
                <p className="text-xs text-gray-500 font-mono">ID: {selectedUser.kakaoId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
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
                <span className="text-gray-500">가입일</span>
                <span>{new Date(selectedUser.joinedAt).toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">최근 활동</span>
                <span>{new Date(selectedUser.lastActive).toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">상태</span>
                <span className={selectedUser.status === 'active' ? 'text-green-400' : 'text-red-400'}>
                  {selectedUser.status === 'active' ? '활성' : '차단'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
