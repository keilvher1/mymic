'use client';

import Image from 'next/image';
import { Heart, Music, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserSong } from '@/types';

interface SongCardProps {
  song: UserSong;
  onFavoriteToggle?: (id: string) => void;
  onTap?: (song: UserSong) => void;
  compact?: boolean;
}

export default function SongCard({ song, onFavoriteToggle, onTap, compact = false }: SongCardProps) {
  return (
    <div
      onClick={() => onTap?.(song)}
      className={cn(
        'card-neon flex items-center gap-3 p-3 cursor-pointer',
        'hover:bg-white/5 active:scale-[0.98] transition-all duration-200',
        compact ? 'rounded-xl' : 'rounded-2xl'
      )}
    >
      {/* 앨범 아트 */}
      <div className="relative flex-shrink-0">
        {song.song.albumArtUrl ? (
          <Image
            src={song.song.albumArtUrl}
            alt={song.song.title}
            width={compact ? 48 : 56}
            height={compact ? 48 : 56}
            className="rounded-xl object-cover"
          />
        ) : (
          <div className={cn(
            'rounded-xl bg-surface-light flex items-center justify-center',
            compact ? 'w-12 h-12' : 'w-14 h-14'
          )}>
            <Music size={20} className="text-gray-500" />
          </div>
        )}
      </div>

      {/* 곡 정보 */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{song.song.title}</h3>
        <p className="text-xs text-gray-400 truncate">{song.song.artist}</p>
        {!compact && (
          <div className="flex items-center gap-2 mt-1">
            {song.tjNumber && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary-light font-mono">
                TJ {song.tjNumber}
              </span>
            )}
            {song.kyNumber && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/20 text-secondary-light font-mono">
                KY {song.kyNumber}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(song.id);
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Heart size={18} className="text-tertiary fill-tertiary" />
          </button>
        )}
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <MoreVertical size={16} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}
