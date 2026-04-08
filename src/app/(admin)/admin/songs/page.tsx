'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Music,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  tjNumber: string;
  kyNumber: string;
  savedBy: number;
  addedAt: string;
}

const mockSongs: Song[] = [
  { id: '1', title: 'APT.', artist: 'ROSÉ & Bruno Mars', genre: 'K-POP', tjNumber: '51456', kyNumber: '96012', savedBy: 342, addedAt: '2026-04-08' },
  { id: '2', title: 'Whiplash', artist: 'aespa', genre: 'K-POP', tjNumber: '51389', kyNumber: '95987', savedBy: 289, addedAt: '2026-04-07' },
  { id: '3', title: 'Hype Boy', artist: 'NewJeans', genre: 'K-POP', tjNumber: '50713', kyNumber: '95478', savedBy: 256, addedAt: '2026-03-15' },
  { id: '4', title: '사건의 지평선', artist: '윤하', genre: '발라드', tjNumber: '49876', kyNumber: '94210', savedBy: 234, addedAt: '2026-02-20' },
  { id: '5', title: 'Seven', artist: '정국 (Jung Kook)', genre: 'K-POP', tjNumber: '50589', kyNumber: '95302', savedBy: 198, addedAt: '2026-03-10' },
  { id: '6', title: 'Perfect Night', artist: 'LE SSERAFIM', genre: 'K-POP', tjNumber: '51234', kyNumber: '', savedBy: 187, addedAt: '2026-03-22' },
  { id: '7', title: '밤양갱', artist: '비비 (BIBI)', genre: 'K-POP', tjNumber: '51567', kyNumber: '96045', savedBy: 176, addedAt: '2026-04-01' },
  { id: '8', title: '첫사랑', artist: '백아', genre: '발라드', tjNumber: '51290', kyNumber: '95890', savedBy: 165, addedAt: '2026-03-28' },
  { id: '9', title: 'Supernova', artist: 'aespa', genre: 'K-POP', tjNumber: '51345', kyNumber: '95945', savedBy: 154, addedAt: '2026-04-02' },
  { id: '10', title: '고민중독', artist: 'QWER', genre: 'Rock', tjNumber: '51478', kyNumber: '96034', savedBy: 143, addedAt: '2026-04-05' },
];

const genres = ['전체', 'K-POP', '발라드', 'R&B', '힙합', 'Rock', 'Trot'];

export default function SongsPage() {
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('전체');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSong, setEditSong] = useState<Song | null>(null);
  const [sortBy, setSortBy] = useState<'savedBy' | 'addedAt'>('savedBy');

  const filtered = mockSongs
    .filter((s) => {
      const matchSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.artist.toLowerCase().includes(search.toLowerCase()) ||
        s.tjNumber.includes(search) ||
        s.kyNumber.includes(search);
      const matchGenre = genreFilter === '전체' || s.genre === genreFilter;
      return matchSearch && matchGenre;
    })
    .sort((a, b) => {
      if (sortBy === 'savedBy') return b.savedBy - a.savedBy;
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl">곡 관리</h1>
          <p className="text-sm text-gray-400 mt-1">
            총 {mockSongs.length.toLocaleString()}곡이 등록되어 있습니다
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> 새 곡 추가
        </button>
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
            placeholder="곡 제목, 가수, 번호로 검색..."
            className="input-dark w-full pl-10 py-2.5 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setGenreFilter(g)}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                genreFilter === g
                  ? 'bg-primary/20 text-primary-light border border-primary/30'
                  : 'bg-surface-light text-gray-400 border border-white/5 hover:bg-white/5'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 mb-4">
        <ArrowUpDown size={14} className="text-gray-500" />
        <span className="text-xs text-gray-500">정렬:</span>
        <button
          onClick={() => setSortBy('savedBy')}
          className={`text-xs px-2 py-1 rounded-lg ${
            sortBy === 'savedBy'
              ? 'bg-primary/20 text-primary-light'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          저장 많은순
        </button>
        <button
          onClick={() => setSortBy('addedAt')}
          className={`text-xs px-2 py-1 rounded-lg ${
            sortBy === 'addedAt'
              ? 'bg-primary/20 text-primary-light'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          최신순
        </button>
      </div>

      {/* Table */}
      <div className="card-neon rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">
                  곡 정보
                </th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">
                  장르
                </th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">
                  TJ
                </th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">
                  KY
                </th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">
                  저장수
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">
                  등록일
                </th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">
                  액션
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((song) => (
                <tr
                  key={song.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-light flex items-center justify-center">
                        <Music size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{song.title}</p>
                        <p className="text-xs text-gray-500">{song.artist}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary-light">
                      {song.genre}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-xs font-mono text-gray-300">
                      {song.tjNumber || '-'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-xs font-mono text-gray-300">
                      {song.kyNumber || '-'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-semibold text-secondary-light">
                      {song.savedBy}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-gray-400">{song.addedAt}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setEditSong(song)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
          <p className="text-xs text-gray-500">
            {filtered.length}곡 중 1-{Math.min(filtered.length, 10)} 표시
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
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editSong) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setShowAddModal(false);
            setEditSong(null);
          }}
        >
          <div
            className="card-neon p-6 rounded-2xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-lg">
                {editSong ? '곡 수정' : '새 곡 추가'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditSong(null);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">곡 제목</label>
                <input
                  type="text"
                  className="input-dark w-full text-sm"
                  placeholder="곡 제목 입력"
                  defaultValue={editSong?.title || ''}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">아티스트</label>
                <input
                  type="text"
                  className="input-dark w-full text-sm"
                  placeholder="아티스트 이름"
                  defaultValue={editSong?.artist || ''}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">장르</label>
                <select
                  className="input-dark w-full text-sm"
                  defaultValue={editSong?.genre || ''}
                >
                  <option value="">장르 선택</option>
                  {genres.filter((g) => g !== '전체').map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    TJ 번호
                  </label>
                  <input
                    type="text"
                    className="input-dark w-full text-sm"
                    placeholder="TJ 번호"
                    defaultValue={editSong?.tjNumber || ''}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    KY 번호
                  </label>
                  <input
                    type="text"
                    className="input-dark w-full text-sm"
                    placeholder="KY 번호"
                    defaultValue={editSong?.kyNumber || ''}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditSong(null);
                }}
                className="btn-secondary flex-1 text-sm"
              >
                취소
              </button>
              <button className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
                <Save size={14} /> {editSong ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
