'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  Flag,
  Trash2,
  X,
  Link2,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  ListMusic,
} from 'lucide-react';

interface SharedList {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorId: string;
  songCount: number;
  songIds: string[];
  shareCode: string;
  isPublic: boolean;
  status: string;
  viewCount: number;
  createdAt: string;
}

export default function AdminSharesPage() {
  const [shares, setShares] = useState<SharedList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedShare, setSelectedShare] = useState<SharedList | null>(null);

  useEffect(() => { fetchShares(); }, []);

  const fetchShares = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/shares');
      if (!res.ok) throw new Error('Failed to fetch shares');
      const data = await res.json();
      setShares(data.shares);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (shareId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/shares', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareId, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setShares(prev => prev.map(s => s.id === shareId ? { ...s, status: newStatus } : s));
    } catch (err: any) {
      alert('상태 변경 실패: ' + err.message);
    }
  };

  const handleDelete = async (shareId: string) => {
    if (!confirm('정말 이 공유 리스트를 삭제하시겠습니까?')) return;
    try {
      const res = await fetch('/api/admin/shares', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareId }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      setShares(prev => prev.filter(s => s.id !== shareId));
      if (selectedShare?.id === shareId) setSelectedShare(null);
    } catch (err: any) {
      alert('삭제 실패: ' + err.message);
    }
  };

  const statusCounts = useMemo(() => ({
    all: shares.length,
    active: shares.filter(s => s.status === 'active').length,
    reported: shares.filter(s => s.status === 'reported').length,
    hidden: shares.filter(s => s.status === 'hidden').length,
  }), [shares]);

  const filteredShares = useMemo(() => {
    return shares.filter(share => {
      const matchSearch = !search ||
        share.title.toLowerCase().includes(search.toLowerCase()) ||
        share.creator.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || share.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [shares, search, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
        <span className="ml-3 text-gray-400">공유 리스트 로딩 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <p className="text-lg font-medium text-red-400">{error}</p>
        <button onClick={fetchShares} className="mt-4 px-4 py-2 rounded-lg bg-primary/20 text-primary-light text-sm">다시 시도</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl">공유 리스트 관리</h1>
          <p className="text-sm text-gray-400 mt-1">총 {shares.length}개의 공유 리스트</p>
        </div>
        <button onClick={fetchShares} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 hover:bg-white/10 transition-colors">
          <RefreshCw size={12} /> 새로고침
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { key: 'all', label: '전체', count: statusCounts.all, color: 'text-white', bg: 'bg-white/5' },
          { key: 'active', label: '활성', count: statusCounts.active, color: 'text-green-400', bg: 'bg-green-400/10' },
          { key: 'reported', label: '신고됨', count: statusCounts.reported, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { key: 'hidden', label: '숨김', count: statusCounts.hidden, color: 'text-red-400', bg: 'bg-red-400/10' },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key)}
            className={`p-4 rounded-xl text-center transition-all ${
              statusFilter === s.key ? 'ring-1 ring-primary/30 ' + s.bg : 'card-neon'
            }`}
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="리스트 제목 또는 생성자로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-surface-light rounded-xl text-sm border border-white/5 focus:border-primary/30 focus:outline-none"
        />
      </div>

      {/* Shares Grid */}
      {filteredShares.length === 0 ? (
        <div className="card-neon rounded-2xl p-12 text-center">
          <ListMusic size={48} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">{shares.length === 0 ? '공유 리스트가 없습니다' : '검색 결과가 없습니다'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredShares.map((share) => (
            <div key={share.id} className="card-neon rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm truncate">{share.title}</h3>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      share.status === 'active' ? 'bg-green-400/10 text-green-400' :
                      share.status === 'reported' ? 'bg-yellow-400/10 text-yellow-400' :
                      'bg-red-400/10 text-red-400'
                    }`}>
                      {share.status === 'active' ? '활성' : share.status === 'reported' ? '신고' : '숨김'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{share.creator}</p>
                </div>
              </div>

              {share.description && (
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{share.description}</p>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span>{share.songCount}곡</span>
                <span>조회 {share.viewCount}</span>
                <span>{new Date(share.createdAt).toLocaleDateString('ko-KR')}</span>
                {share.shareCode && (
                  <span className="flex items-center gap-1">
                    <Link2 size={10} />
                    {share.shareCode}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                <button
                  onClick={() => setSelectedShare(share)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 hover:bg-white/10 transition-colors"
                >
                  <Eye size={12} /> 상세
                </button>
                {share.status === 'active' && (
                  <button
                    onClick={() => handleStatusChange(share.id, 'hidden')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400/10 text-xs text-yellow-400 hover:bg-yellow-400/20 transition-colors"
                  >
                    <EyeOff size={12} /> 숨기기
                  </button>
                )}
                {share.status === 'hidden' && (
                  <button
                    onClick={() => handleStatusChange(share.id, 'active')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-400/10 text-xs text-green-400 hover:bg-green-400/20 transition-colors"
                  >
                    <CheckCircle size={12} /> 활성화
                  </button>
                )}
                {share.status === 'reported' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(share.id, 'active')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-400/10 text-xs text-green-400 hover:bg-green-400/20 transition-colors"
                    >
                      <CheckCircle size={12} /> 승인
                    </button>
                    <button
                      onClick={() => handleStatusChange(share.id, 'hidden')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-400/10 text-xs text-red-400 hover:bg-red-400/20 transition-colors"
                    >
                      <EyeOff size={12} /> 숨기기
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(share.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-red-400/10 hover:text-red-400 transition-colors ml-auto"
                >
                  <Trash2 size={12} /> 삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedShare && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedShare(null)}>
          <div className="bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold text-lg">공유 리스트 상세</h3>
              <button onClick={() => setSelectedShare(null)} className="p-1 rounded-lg hover:bg-white/10"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">제목</p>
                <p className="font-medium">{selectedShare.title}</p>
              </div>
              {selectedShare.description && (
                <div>
                  <p className="text-xs text-gray-500">설명</p>
                  <p className="text-sm text-gray-300">{selectedShare.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-light rounded-xl p-3">
                  <p className="text-xs text-gray-500">생성자</p>
                  <p className="text-sm font-medium mt-0.5">{selectedShare.creator}</p>
                </div>
                <div className="bg-surface-light rounded-xl p-3">
                  <p className="text-xs text-gray-500">곡 수</p>
                  <p className="text-sm font-medium mt-0.5">{selectedShare.songCount}곡</p>
                </div>
                <div className="bg-surface-light rounded-xl p-3">
                  <p className="text-xs text-gray-500">조회수</p>
                  <p className="text-sm font-medium mt-0.5">{selectedShare.viewCount}회</p>
                </div>
                <div className="bg-surface-light rounded-xl p-3">
                  <p className="text-xs text-gray-500">생성일</p>
                  <p className="text-sm font-medium mt-0.5">{new Date(selectedShare.createdAt).toLocaleDateString('ko-KR')}</p>
                </div>
              </div>
              {selectedShare.shareCode && (
                <div className="bg-surface-light rounded-xl p-3">
                  <p className="text-xs text-gray-500">공유 코드</p>
                  <p className="text-sm font-mono text-primary-light mt-0.5">/s/{selectedShare.shareCode}</p>
                </div>
              )}
              <div className="flex justify-between pt-2">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  selectedShare.status === 'active' ? 'bg-green-400/10 text-green-400' :
                  selectedShare.status === 'reported' ? 'bg-yellow-400/10 text-yellow-400' :
                  'bg-red-400/10 text-red-400'
                }`}>
                  {selectedShare.status === 'active' ? '활성' : selectedShare.status === 'reported' ? '신고됨' : '숨김'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
