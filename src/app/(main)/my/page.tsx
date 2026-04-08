'use client';

import { useState } from 'react';
import { Filter, SlidersHorizontal, Music } from 'lucide-react';
import SongCard from '@/components/SongCard';
import AddSongFAB from '@/components/AddSongFAB';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import type { UserSong } from '@/types';

const FILTER_TABS = [
  { value: 'all', label: '전체' },
  { value: 'ballad', label: '발라드' },
  { value: 'dance', label: '댄스' },
  { value: 'hiphop', label: '힙합' },
  { value: 'rock', label: '록' },
  { value: 'pop', label: '팝' },
  { value: 'rnb', label: 'R&B' },
];

// 데모 데이터 (실제로는 Firestore에서 가져옴)
const DEMO_MY_SONGS: UserSong[] = [
  {
    id: '1', userId: 'demo',
    song: { spotifyId: '1', title: 'Hype Boy', artist: 'NewJeans', albumName: 'NewJeans 1st EP', albumArtUrl: '', previewUrl: null, genre: 'dance', durationMs: 179000 },
    category: 'dance', moodTags: ['exciting', 'party'], confidence: 4, tjNumber: '50713', kyNumber: '95478', memo: '', sortOrder: 0, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '2', userId: 'demo',
    song: { spotifyId: '2', title: 'Ditto', artist: 'NewJeans', albumName: 'Ditto', albumArtUrl: '', previewUrl: null, genre: 'dance', durationMs: 185000 },
    category: 'dance', moodTags: ['romantic', 'chill'], confidence: 5, tjNumber: '50605', kyNumber: '95310', memo: '', sortOrder: 1, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '3', userId: 'demo',
    song: { spotifyId: '3', title: '사랑은 늘 도망가', artist: '임영웅', albumName: 'IM HERO', albumArtUrl: '', previewUrl: null, genre: 'ballad', durationMs: 252000 },
    category: 'ballad', moodTags: ['sad', 'romantic'], confidence: 3, tjNumber: '50400', kyNumber: '', memo: '키 낮춰서 부르기', sortOrder: 2, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '4', userId: 'demo',
    song: { spotifyId: '4', title: 'Super Shy', artist: 'NewJeans', albumName: 'Get Up', albumArtUrl: '', previewUrl: null, genre: 'dance', durationMs: 182000 },
    category: 'dance', moodTags: ['exciting', 'party'], confidence: 4, tjNumber: '50702', kyNumber: '95450', memo: '', sortOrder: 3, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '5', userId: 'demo',
    song: { spotifyId: '5', title: 'SPOT!', artist: 'ZICO (feat. JENNIE)', albumName: 'SPOT!', albumArtUrl: '', previewUrl: null, genre: 'hiphop', durationMs: 175000 },
    category: 'hiphop', moodTags: ['exciting', 'party'], confidence: 4, tjNumber: '51500', kyNumber: '96100', memo: '랩파트 연습 더 하기', sortOrder: 4, createdAt: new Date(), updatedAt: new Date(),
  },
];

export default function MyListPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [songs] = useState<UserSong[]>(DEMO_MY_SONGS);

  const filteredSongs = activeFilter === 'all'
    ? songs
    : songs.filter((s) => s.category === activeFilter);

  return (
    <div className="px-4 pt-12 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl">보관함</h1>
          <p className="text-sm text-gray-400 mt-1">{songs.length}곡 저장됨</p>
        </div>
        <button className="p-2.5 rounded-xl bg-surface-light border border-white/10 hover:bg-white/10 transition-colors">
          <SlidersHorizontal size={18} className="text-gray-400" />
        </button>
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={cn(
              'flex-shrink-0 transition-all duration-200',
              activeFilter === tab.value
                ? 'tag-chip-active'
                : 'tag-chip'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 곡 목록 */}
      {filteredSongs.length === 0 ? (
        <div className="text-center py-16">
          <Music size={56} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-400 font-medium">아직 저장된 곡이 없어요</p>
          <p className="text-xs text-gray-600 mt-1">검색에서 좋아하는 곡을 추가해보세요!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onFavoriteToggle={(id) => console.log('Toggle favorite:', id)}
            />
          ))}
        </div>
      )}

      <AddSongFAB />
    </div>
  );
}
