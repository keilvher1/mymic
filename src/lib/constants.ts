// 카테고리 목록
export const CATEGORIES = [
  { value: 'ballad', label: '발라드', emoji: '🎵' },
  { value: 'dance', label: '댄스', emoji: '💃' },
  { value: 'hiphop', label: '힙합', emoji: '🎤' },
  { value: 'rock', label: '록', emoji: '🎸' },
  { value: 'rnb', label: 'R&B', emoji: '🎶' },
  { value: 'pop', label: '팝', emoji: '🌍' },
  { value: 'trot', label: '트로트', emoji: '🎭' },
  { value: 'indie', label: '인디', emoji: '🎹' },
  { value: 'ost', label: 'OST', emoji: '🎬' },
  { value: 'etc', label: '기타', emoji: '🎼' },
] as const;

// 분위기 태그
export const MOOD_TAGS = [
  { value: 'exciting', label: '신나는', emoji: '🔥' },
  { value: 'sad', label: '슬픈', emoji: '😢' },
  { value: 'romantic', label: '감성적', emoji: '💕' },
  { value: 'party', label: '파티', emoji: '🎉' },
  { value: 'calm', label: '잔잔한', emoji: '🌙' },
  { value: 'powerful', label: '파워풀', emoji: '💪' },
  { value: 'retro', label: '레트로', emoji: '📻' },
  { value: 'chill', label: '칠', emoji: '😎' },
] as const;

// AI 추천용 빠른 상황 버튼
export const QUICK_SITUATIONS = [
  { label: '#신나는 노래', prompt: '신나는 노래 추천해줘! 분위기 띄우고 싶어' },
  { label: '#감성 발라드', prompt: '감성적인 발라드 추천해줘' },
  { label: '#힙합 R&B', prompt: '힙합이나 R&B 곡 추천해줘' },
  { label: '#회식 2차', prompt: '회식 2차인데 다 같이 부를 수 있는 곡 추천해줘' },
  { label: '#데이트', prompt: '여자친구랑 노래방 왔는데 분위기 좋은 곡 추천해줘' },
  { label: '#스트레스 해소', prompt: '스트레스 풀고 싶어! 시원하게 지를 수 있는 곡' },
  { label: '#혼자 연습', prompt: '혼자 노래방 왔는데 실력 늘릴 수 있는 곡 추천해줘' },
] as const;

// 자신감 레벨
export const CONFIDENCE_LEVELS = [
  { value: 1, label: '연습 필요', emoji: '😅' },
  { value: 2, label: '좀 불안', emoji: '🤔' },
  { value: 3, label: '보통', emoji: '😊' },
  { value: 4, label: '자신 있음', emoji: '😎' },
  { value: 5, label: '자신작!', emoji: '🎤' },
] as const;

// AI 프롬프트
export const RECOMMENDATION_PROMPT = `너는 노래방 DJ이자 음악 전문가 "마이마이크 AI"야.
사용자의 애창곡 리스트와 현재 상황을 분석해서 최적의 곡을 추천해줘.

다음을 고려해서 5곡을 추천해줘:
1. 사용자의 애창곡 리스트에서 상황에 맞는 곡 2-3곡 (이미 저장된 곡)
2. 리스트에 없지만 취향에 맞을 새로운 곡 2-3곡
3. 각 곡의 추천 이유를 한 줄로 설명
4. 부르는 팁이 있다면 추가
5. TJ/금영 번호를 알고 있다면 함께 알려줘

응답은 친근하고 재미있는 말투로 해줘. 이모지도 적절히 사용해.
각 추천곡은 다음 형식으로:
🎵 **곡명 - 아티스트**
   추천 이유: ...
   팁: ...
`;
