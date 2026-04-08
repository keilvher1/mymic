'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Trash2,
  X,
  Music,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowUpDown,
} from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  tjNumber: string;
  kyNumber: string;
  albumArtUrl: string;
  spotifyId: string;
  savedBy: number;
  addedAt: string;
}

const GENRE_LABELS: Record<string, string> = {
  kpop: 'K-POP', ballad: '발라드', rnb: 'R&B', hiphop: '힙합',
  rock: '록', trot: '트로트', pop: 'POP', etc: '기타',
};

const GENRE_COLORS: Record<string, string> = {
  kpop: 'bg-purple-400/10 text-purple-400', ballad: 'bg-cyan-400/10 text-cyan-400',
  rnb: 'bg-pink-400/10 text-pink-400', hiphop: 'bg-yellow-400/10 text-yellow-400',
  rock: 'bg-red-400/10 text-red-400', trot: 'bg-green-400/10 text-green-400',
  pop: 'bg-violet-400/10 text-violet-400', etc: 'bg-gray-400/10 text-gray-400',
};

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'savedBy' | 'addedAt'>('savedBy');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', artist: '', genre: 'etc', tjNumber: '', kyNumber: '' });

  useEffect(() => { fetchSongs(); }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/songs');
      if (!res.ok) throw new Error('Failed to fetch songs');
      const data = await res.json();
      setSongs(data.songs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSong = async () => {
    if (!formData.title || !formData.artist) return;
    try {
      const res = await fetch('/api/admin/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to add song');
      setShowModal(false);
      setFormData({ title: '', artist: '', genre: 'etc', tjNumber: '', kyNumber: '' });
      fetchSongs();
    } catch (err: any) {
      alert('곡 추가 실패: ' + err.message);
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!confirm('정말 이 곡을 삭제하시겠습니까?')) return;
    try {
      const res = await fetch('/api/admin/songs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      setSongs(prev => prev.filter(s => s.id !== songId));
    } catch (err: any) {
      alert('삭제 실패: ' + err.message);
    }
  };

  const availableGenres = useMemo(() => {
    const genres = new Set(songs.map(s => s.genre));
    return Array.from(genres);
  }, [songs]);

  const filteredSongs = useMemo(() => {
    return songs
      .filter(song => {
        const matchSearch = !search ||
          song.title.toLowerCase().includes(search.toLowerCase()) ||
          song.artist.toLowerCase().includes(search.toLowerCase()) ||
          song.tjNumber.includes(search) ||
          song.kyNumber.includes(search);
        const matchGenre = genreFilter === 'all' || song.genre === genreFilter;
        return matchSearch && matchGenre;
      })
      .sort((a, b) => {
        if (sortBy === 'savedBy') return b.savedBy - a.savedBy;
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      });
  }, [songs, search, genreFilter, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
        <span className="ml-3 text-gray-400">곡 데이터 로딩 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <p className="text-lg font-medium text-red-400">{error}</p>
        <button onClick={fetchSongs} className="mt-4 px-4 py-2 rounded-lg bg-primary/20 text-primary-light text-sm">다시 시도</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl">곡 관리</h1>
          <p className="text-sm text-gray-400 mt-1">총 {songs.length}곡 등록됨</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchSongs} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-xs text-gray-400 hover:bg-white/10 transition-colors">
            <RefreshCw size={12} /> 새로고침
          </button>
          <button
            onClick={() => { setFormData({ title: '', artist: '', genre: 'etc', tjNumber: '', kyNumber: '' }); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-colors"
          >
            <Plus size={16} /> 곡 추가
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="곡명, 아티스트, TJ/KY 번호로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-light rounded-xl text-sm border border-white/5 focus:border-primary/30 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setGenreFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              genreFilter === 'all' ? 'bg-primary/20 text-primary-light border border-primary/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            전체
          </button>
          {availableGenres.map(g => (
            <button
              key={g}
              onClick={() => setGenreFilter(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                genreFilter === g ? 'bg-primary/20 text-primary-light border border-primary/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {GENRE_LABELS[g] || g}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSortBy(sortBy === 'savedBy' ? 'addedAt' : 'savedBy')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 hover:bg-white/10 whitespace-nowrap"
        >
          <ArrowUpDown size={12} />
          {sortBy === 'savedBy' ? '저장순' : '최신순'}
        </button>
      </div>

      {/* Songs Table */}
      {filteredSongs.length === 0 ? (
        <div className="card-neon rounded-2xl p-12 text-center">
          <Music size={48} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">{songs.length === 0 ? '등록된 곡이 없습니다' : '검색 결과가 없습니다'}</p>
        </div>
      ) : (
        <div className="card-neon rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">곡 정보</th>
                  <th className="text-center text-xs font-medium text-gray-500 px-5 py-3">장르</th>
                  <th className="text-center text-xs font-medium text-gray-500 px-5 py-3">TJ</th>
                  <th className="text-center text-xs font-medium text-gray-500 px-5 py-3">KY</th>
                  <th className="text-center text-xs font-medium text-gray-500 px-5 py-3">저장 수</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">등록일</th>
                  <th className="text-center text-xs font-medium text-gray-500 px-5 py-3">액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredSongs.map((song) => (
                  <tr key={song.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {song.albumArtUrl ? (
                          <img src={song.albumArtUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gradient-neon flex items-center justify-center">
                            <Music size={16} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">{song.title}</p>
                          <p className="text-[11px] text-gray-500">{song.artist}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${GENRE_COLORS[song.genre] || 'bg-gray-400/10 text-gray-400'}`}>
                        {GENRE_LABELS[song.genre] || song.genre}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-xs text-gray-400 font-mono">{song.tjNumber || '-'}</td>
                    <td className="px-5 py-3 text-center text-xs text-gray-400 font-mono">{song.kyNumber || '-'}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="text-sm font-medium text-primary-light">{song.savedBy}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400">{new Date(song.addedAt).toLocaleDateString('ko-KR')}</td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => handleDeleteSong(song.id)}
                        className="p-1.5 rounded-lg hover:bg-red-400/10 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Song Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold text-lg">곡 추가</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-white/10"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">곡 제목 *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-surface-light rounded-xl text-sm border border-white/5 focus:border-primary/30 focus:outline-none" placeholder="곡 제목" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">아티스트 *</label>
                <input type="text" value={formData.artist} onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="w-full px-3 py-2.5 bg-surface-light rounded-xl text-sm border border-white/5 focus:border-primary/30 focus:outline-none" placeholder="아티스트" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">장르</label>
                <select value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full px-3 py-2.5 bg-surface-light rounded-xl text-sm border border-white/5 focus:border-primary/30 focus:outline-none">
                  {Object.entries(GENRE_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">TJ 번호</label>
                  <input type="text" value={formData.tjNumber} onChange={(e) => setFormData({ ...formData, tjNumber: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface-light rounded-xl text-sm border border-white/5 focus:border-primary/30 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">KY 번호</label>
                  <input type="text" value={formData.kyNumber} onChange={(e) => setFormData({ ...formData, kyNumber: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface-light rounded-xl text-sm border border-white/5 focus:border-primary/30 focus:outline-none" />
                </div>
              </div>
              <button onClick={handleAddSong} disabled={!formData.title || !formData.artist}
                className="w-full py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
