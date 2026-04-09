'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, Check, Plus, Loader2, Music, X, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';

interface SharedList {
  id: string;
  title: string;
  description: string;
  shareCode: string;
  songIds: string[];
  createdAt: any;
}

interface UserSong {
  id: string;
  song: {
    spotifyId: string;
    title: string;
    artist: string;
    albumArtUrl?: string;
  };
  [key: string]: any;
}

export default function SharePage() {
  const { userId, userName, isLoading: userLoading } = useUser();
  const [sharedLists, setSharedLists] = useState<SharedList[]>([]);
  const [mySongs, setMySongs] = useState<UserSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedSongIds, setSelectedSongIds] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (userLoading) return;
    const fetchData = async () => {
      try {
        const [sharesRes, songsRes] = await Promise.all([
          fetch('/api/share', { headers: { 'x-user-id': userId } }),
          fetch('/api/songs', { headers: { 'x-user-id': userId } }),
        ]);
        if (sharesRes.ok) {
          const data = await sharesRes.json();
          setSharedLists(data);
        }
        if (songsRes.ok) {
          const data = await songsRes.json();
          setMySongs(data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, userLoading]);

  const handleCopy = (shareCode: string, listId: string) => {
    const url = `${window.location.origin}/s/${shareCode}`;
    navigator.clipboard.writeText(url);
    setCopiedId(listId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSong = (songId: string) => {
    setSelectedSongIds((prev) => {
      const next = new Set(prev);
      if (next.has(songId)) next.delete(songId);
      else next.add(songId);
      return next;
    });
  };

  const handleCreate = async () => {
    if (selectedSongIds.size === 0) return;
    setCreating(true);
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          title: newTitle || `${userName || '나'}의 애창곡 리스트`,
          description: newDesc,
          songIds: Array.from(selectedSongIds),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // 리스트 새로고침
        const refreshRes = await fetch('/api/share', {
          headers: { 'x-user-id': userId },
        });
        if (refreshRes.ok) {
          setSharedLists(await refreshRes.json());
        }
        setShowModal(false);
        setNewTitle('');
        setNewDesc('');
        setSelectedSongIds(new Set());
      }
    } catch (error) {
      console.error('Failed to create share list:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-12 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl">공유하기</h1>
        {mySongs.length > 0 && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/20 border border-primary/30 text-sm text-primary-light hover:bg-primary/30 transition-colors"
          >
            <Plus size={16} />
            <span>새 리스트</span>
          </button>
        )}
      </div>

      {/* 내 프로필 요약 */}
      <div className="card-neon rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-neon flex items-center justify-center text-xl font-bold flex-shrink-0">
            {(userName || '게').charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="font-heading font-bold text-lg">{userName || '게스트'}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-400">{mySongs.length}곡 보유</span>
              <span className="text-gray-600">·</span>
              <span className="text-sm text-gray-400">{sharedLists.length}개 공유 리스트</span>
            </div>
          </div>
        </div>
      </div>

      {/* 공유 리스트 목록 */}
      <section className="mb-8">
        <h2 className="font-heading font-bold text-lg mb-4">내 공유 리스트</h2>
        {sharedLists.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sharedLists.map((list) => (
              <div key={list.id} className="card-neon rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{list.title}</h3>
                    {list.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{list.description}</p>
                    )}
                    <p className="text-xs text-gray-600 mt-1">{list.songIds?.length || 0}곡</p>
                  </div>
                  <button
                    onClick={() => handleCopy(list.shareCode, list.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-light text-xs hover:bg-white/10 transition-colors flex-shrink-0 ml-2"
                  >
                    {copiedId === list.id ? (
                      <>
                        <Check size={12} className="text-green-400" />
                        <span className="text-green-400">복사됨</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon size={12} className="text-gray-400" />
                        <span className="text-gray-400">링크 복사</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Share2 size={40} className="mx-auto text-gray-700 mb-3" />
            <p className="text-gray-400 text-sm">아직 공유 리스트가 없어요</p>
            {mySongs.length > 0 ? (
              <>
                <p className="text-xs text-gray-600 mt-1">내 애창곡으로 공유 리스트를 만들어보세요</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary mt-4 text-sm"
                >
                  + 새 공유 리스트 만들기
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-600 mt-1">먼저 검색에서 곡을 추가해주세요</p>
                <a href="/search" className="btn-primary mt-4 text-sm inline-block">
                  곡 검색하러 가기
                </a>
              </>
            )}
          </div>
        )}
      </section>

      {/* 공유 리스트 생성 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60">
          <div className="w-full max-w-lg bg-surface-dark rounded-t-3xl p-6 pb-8 animate-fade-in max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-lg">새 공유 리스트</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-white/10">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* 제목 입력 */}
            <div className="mb-4">
              <label className="text-xs text-gray-400 mb-1 block">리스트 제목</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="예: 신나는 노래방 리스트"
                className="input-dark w-full"
              />
            </div>

            {/* 설명 입력 */}
            <div className="mb-4">
              <label className="text-xs text-gray-400 mb-1 block">설명 (선택)</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="리스트에 대한 간단한 설명"
                className="input-dark w-full"
              />
            </div>

            {/* 곡 선택 */}
            <div className="mb-6">
              <label className="text-xs text-gray-400 mb-2 block">
                곡 선택 ({selectedSongIds.size}/{mySongs.length})
              </label>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {mySongs.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleSong(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                      selectedSongIds.has(item.id)
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-white/5 bg-surface-light hover:bg-white/5'
                    }`}
                  >
                    {item.song?.albumArtUrl ? (
                      <Image
                        src={item.song.albumArtUrl}
                        alt={item.song.title}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-surface-dark flex items-center justify-center flex-shrink-0">
                        <Music size={16} className="text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate">{item.song?.title}</p>
                      <p className="text-xs text-gray-500 truncate">{item.song?.artist}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedSongIds.has(item.id) ? 'border-primary bg-primary' : 'border-gray-600'
                    }`}>
                      {selectedSongIds.has(item.id) && <Check size={12} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 생성 버튼 */}
            <button
              onClick={handleCreate}
              disabled={selectedSongIds.size === 0 || creating}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {creating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>생성 중...</span>
                </>
              ) : (
                <span>공유 리스트 만들기 ({selectedSongIds.size}곡)</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
