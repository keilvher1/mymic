'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Music, ChevronRight, TrendingUp, Heart } from 'lucide-react';
import AddSongFAB from '@/components/AddSongFAB';
import SongCard from '@/components/SongCard';
import type { UserSong } from '@/types';

// 데모 데이터
const DEMO_SONGS: UserSong[] = [
  {
    id: '1',
    userId: 'demo',
    song: {
      spotifyId: '1',
      title: 'Hype Boy',
      artist: 'NewJeans',
      albumName: 'NewJeans 1st EP',
      albumArtUrl: '',
      previewUrl: null,
      genre: 'dance',
      durationMs: 179000,
    },
    category: 'dance',
    moodTags: ['exciting', 'party'],
    confidence: 4,
    tjNumber: '50713',
    kyNumber: '95478',
    memo: '',
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: 'demo',
    song: {
      spotifyId: '2',
      title: 'Perfect Night',
      artist: 'LE SSERAFIM',
      albumName: 'Perfect Night',
      albumArtUrl: '',
      previewUrl: null,
      genre: 'dance',
      durationMs: 168000,
    },
    category: 'dance',
    moodTags: ['exciting'],
    confidence: 3,
    tjNumber: '51234',
    kyNumber: '',
    memo: '후렴 고음 주의',
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    userId: 'demo',
    song: {
      spotifyId: '3',
      title: 'Seven',
      artist: '정국 (Jung Kook)',
      albumName: 'Seven',
      albumArtUrl: '',
      previewUrl: null,
      genre: 'pop',
      durationMs: 185000,
    },
    category: 'pop',
    moodTags: ['exciting', 'chill'],
    confidence: 5,
    tjNumber: '50589',
    kyNumber: '95302',
    memo: '자신작!',
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const FAVORITE_CATEGORIES = [
  { label: 'K-POP', count: 42, color: 'from-primary to-secondary' },
  { label: 'R&B', count: 18, color: 'from-tertiary to-primary' },
  { label: '발라드', count: 15, color: 'from-secondary to-neon-blue' },
  { label: '힙합', count: 11, color: 'from-neon-pink to-tertiary' },
];

export default function HomePage() {
  const [songs] = useState<UserSong[]>(DEMO_SONGS);
  const userName = '지훈';
  const totalSongs = 86;

  return (
    <div className="px-4 pt-12 animate-fade-in">
      {/* 인사 헤더 */}
      <section className="mb-8">
        <p className="text-gray-400 text-sm">안녕하세요 👋</p>
        <h1 className="text-2xl font-heading font-bold mt-1">
          <span className="bg-gradient-neon bg-clip-text text-transparent">{userName}</span>님!
        </h1>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
            <Music size={14} className="text-primary-light" />
            <span className="text-sm font-semibold text-primary-light">{totalSongs}곡</span>
          </div>
          <span className="text-xs text-gray-500">저장됨</span>
        </div>
      </section>

      {/* 즐겨찾는 카테고리 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-lg">즐겨찾는 장르</h2>
          <Link href="/my" className="text-xs text-gray-400 flex items-center gap-0.5">
            전체보기 <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FAVORITE_CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="card-neon p-4 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <h3 className="font-semibold text-sm relative z-10">{cat.label}</h3>
              <p className="text-xs text-gray-400 mt-0.5 relative z-10">{cat.count}곡</p>
            </div>
          ))}
        </div>
      </section>

      {/* 최근 추가한 곡 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-lg">최근 추가한 곡</h2>
          <Link href="/my" className="text-xs text-gray-400 flex items-center gap-0.5">
            전체보기 <ChevronRight size={14} />
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      {/* AI 추천 배너 */}
      <section className="mb-8">
        <Link href="/recommend">
          <div className="card-neon p-5 rounded-2xl relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-neon opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-secondary" />
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider">AI Pick of the Night</span>
              </div>
              <h3 className="font-heading font-bold text-lg mb-1">오늘 밤, 뭐 부를까?</h3>
              <p className="text-sm text-gray-400">
                AI가 당신의 취향과 분위기에 맞는 곡을 추천해드려요
              </p>
            </div>
          </div>
        </Link>
      </section>

      <AddSongFAB />
    </div>
  );
}
