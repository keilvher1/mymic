// 곡 정보 (Spotify에서 가져온 원본 데이터)
export interface Song {
  id?: string;
  spotifyId: string;
  title: string;
  artist: string;
  albumName: string;
  albumArtUrl: string;
  previewUrl: string | null;
  genre: string;
  durationMs: number;
  createdAt?: Date;
}

// 사용자의 애창곡 (곡 + 개인 설정)
export interface UserSong {
  id: string;
  userId: string;
  song: Song;
  category: string;
  moodTags: string[];
  confidence: number; // 1-5
  tjNumber?: string;
  kyNumber?: string;
  memo?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// 사용자 프로필
export interface UserProfile {
  uid: string;
  kakaoId: string;
  nickname: string;
  avatarUrl: string;
  songCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 공유 리스트
export interface SharedList {
  id: string;
  userId: string;
  title: string;
  description: string;
  shareCode: string;
  isPublic: boolean;
  songIds: string[];
  createdAt: Date;
}

// AI 추천 메시지
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Spotify 검색 결과
export interface SpotifySearchResult {
  spotifyId: string;
  title: string;
  artist: string;
  albumName: string;
  albumArtUrl: string;
  previewUrl: string | null;
  durationMs: number;
}

// 곡 추가 시 사용되는 폼 데이터
export interface AddSongForm {
  song: SpotifySearchResult;
  category: string;
  moodTags: string[];
  confidence: number;
  tjNumber: string;
  kyNumber: string;
  memo: string;
}
