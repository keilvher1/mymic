'use client';

import { useState, useCallback } from 'react';
import { Search as SearchIcon, X, Music, Plus, Play, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils';
import type { SpotifySearchResult } from '@/types';

const GENRE_CARDS = [
  { label: 'K-POP', emoji: '🎵', color: 'from-primary to-primary-dark' },
  { label: 'Rock', emoji: '🎸', color: 'from-tertiary to-tertiary-dark' },
  { label: 'Ballad', emoji: '💕', color: 'from-secondary to-secondary-dark' },
  { label: 'Hip Hop', emoji: '🎤', color: 'from-neon-pink to-primary' },
  { label: 'R&B', emoji: '🎶', color: 'from-neon-blue to-secondary' },
  { label: 'Trot', emoji: '🎭', color: 'from-primary-light to-tertiary' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotifySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAddSong = async (song: SpotifySearchResult) => {
    if (addingId || addedIds.has(song.spotifyId)) return;
    setAddingId(song.spotifyId);
    try {
      const res = await fetch('/api/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'user_default',
        },
        body: JSON.stringify({
          song: {
            spotifyId: song.spotifyId,
            title: song.title,
            artist: song.artist,
            albumName: song.albumName,
            albumArtUrl: song.albumArtUrl,
            previewUrl: song.previewUrl,
            durationMs: song.durationMs,
          },
          category: 'kpop',
          moodTags: [],
          confidence: 3,
        }),
      });
      if (res.ok) {
        setAddedIds(prev => new Set(prev).add(song.spotifyId));
      } else {
        alert('저장 실패');
      }
    } catch (error) {
      console.error('Add song error:', error);
      alert('저장 중 오류 발생');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="px-4 pt-12 animate-fade-in">
      {/* 헤더 */}
      <h1 className="font-heading font-bold text-2xl mb-1">검색</h1>
      <p className="text-sm text-gray-400 mb-6">어떤 노래를 부르고 싶으신가요?</p>

      {/* 검색바 */}
      <div className="relative mb-6">
        <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="노래 제목 또는 가수 검색..."
          className="input-dark w-full pl-11 pr-10"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setHasSearched(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
          >
            <X size={16} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* 검색 결과 */}
      {isSearching && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="text-primary animate-spin" />
          <span className="ml-2 text-sm text-gray-400">검색 중...</span>
        </div>
      )}

      {!isSearching && hasSearched && results.length === 0 && (
        <div className="text-center py-12">
          <Music size={48} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">검색 결과가 없습니다</p>
          <p className="text-xs text-gray-600 mt-1">다른 키워드로 검색해보세요</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">검색 결과</h2>
          <div className="flex flex-col gap-2">
            {results.map((track) => (
              <div
                key={track.spotifyId}
                className="card-neon flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                {track.albumArtUrl ? (
                  <Image
                    src={track.albumArtUrl}
                    alt={track.title}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-surface-light flex items-center justify-center flex-shrink-0">
                    <Music size={18} className="text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{track.title}</h3>
                  <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                  <p className="text-[10px] text-gray-600">{track.albumName} · {formatDuration(track.durationMs)}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {track.previewUrl && (
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                      <Play size={16} className="text-secondary" />
                    </button>
                  )}
                  <button
                    onClick={() => handleAddSong(track)}
                    disabled={addingId === track.spotifyId || addedIds.has(track.spotifyId)}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      addedIds.has(track.spotifyId)
                        ? "bg-green-500/20 cursor-default"
                        : "bg-primary/20 hover:bg-primary/30"
                    )}
                  >
                    {addingId === track.spotifyId ? (
                      <Loader2 size={16} className="text-primary-light animate-spin" />
                    ) : addedIds.has(track.spotifyId) ? (
                      <span className="text-green-400 text-xs font-bold">✓</span>
                    ) : (
                      <Plus size={16} className="text-primary-light" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 장르 탐색 (검색 전 표시) */}
      {!hasSearched && (
        <section>
          <h2 className="text-sm font-semibold text-gray-400 mb-3">장르 탐색</h2>
          <div className="grid grid-cols-2 gap-3">
            {GENRE_CARDS.map((genre) => (
              <button
                key={genre.label}
                onClick={() => { setQuery(genre.label); }}
                className="card-neon p-5 rounded-2xl relative overflow-hidden text-left group hover:scale-[1.02] transition-transform"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                <span className="text-2xl relative z-10">{genre.emoji}</span>
                <p className="font-semibold text-sm mt-2 relative z-10">{genre.label}</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
