# 마이마이크 (MyMic) — 세팅 가이드

## 1. 프로젝트 설치

```bash
cd mymic
npm install
```

## 2. Firebase 프로젝트 설정

### 이미 완료된 설정:
- 프로젝트명: `mymic` (ID: `mymic-1da3d`)
- 웹 앱: `MyMic Web` 등록 완료
- Firestore: `asia-northeast3 (서울)` 리전, 테스트 모드
- Google Analytics: 비활성화

### Firebase Admin SDK (서버사이드) — 추가 설정 필요
1. Firebase 콘솔 → 프로젝트 설정 → 서비스 계정 탭
2. "새 비공개 키 생성" → JSON 다운로드
3. JSON에서 `project_id`, `client_email`, `private_key`를 `.env.local`에 복사

## 3. 환경변수 설정

`.env.local.example`을 `.env.local`로 복사하고 값을 채워넣으세요:

```bash
cp .env.local.example .env.local
```

### 필요한 키들:
| 변수 | 설명 | 발급처 |
|------|------|--------|
| KAKAO_CLIENT_ID | 카카오 REST API 키 | 이미 발급됨: `95c29d423e0cf63041379eeb7c855f24` |
| SPOTIFY_CLIENT_ID | Spotify Client ID | 이미 발급됨: `0e3290f6cbea4339be93e49efc17d85f` |
| SPOTIFY_CLIENT_SECRET | Spotify Secret | 이미 발급됨: `c27798f5fdc54012ae9817d97b46b203` |
| NEXT_PUBLIC_FIREBASE_* | Firebase 웹 설정 | .env.local.example에 이미 입력됨 |
| FIREBASE_ADMIN_* | Firebase Admin | 서비스 계정 JSON에서 복사 필요 |
| OPENAI_API_KEY | AI 추천용 | Vercel 배포 시 무료 크레딧 자동 적용 |
| NEXTAUTH_SECRET | 랜덤 시크릿 | `openssl rand -base64 32` 로 생성 |

### Vercel AI 무료 크레딧 사용법
1. Vercel에 프로젝트 배포
2. Vercel 대시보드 → 프로젝트 → Settings → AI 탭
3. AI Gateway 활성화하면 gpt-4o-mini 무료 크레딧 사용 가능
4. 로컬 개발 시에는 OpenAI API 키가 필요합니다

## 4. Firestore 보안 규칙

Firebase 콘솔 → Firestore → 규칙 탭에서 다음을 입력:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 노래 정보 (모든 인증 사용자 읽기 가능)
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow write: if false; // 서버에서만 쓰기
    }
    
    // 사용자 애창곡 (본인만 CRUD)
    match /userSongs/{docId} {
      allow read, write: if request.auth != null 
                         && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // 공유 리스트
    match /sharedLists/{listId} {
      allow read: if resource.data.isPublic == true || 
                     (request.auth != null && resource.data.userId == request.auth.uid);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
                            && resource.data.userId == request.auth.uid;
    }
    
    // 사용자 프로필
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 5. 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인!

## 6. 프로젝트 구조

```
mymic/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # 랜딩 페이지
│   │   ├── login/page.tsx              # 로그인
│   │   ├── layout.tsx                  # 루트 레이아웃
│   │   ├── (main)/                     # 메인 레이아웃 (하단 탭바)
│   │   │   ├── layout.tsx
│   │   │   ├── home/page.tsx           # 홈
│   │   │   ├── search/page.tsx         # 검색
│   │   │   ├── my/page.tsx             # 보관함
│   │   │   ├── recommend/page.tsx      # AI 추천
│   │   │   ├── share/page.tsx          # 공유
│   │   │   └── profile/page.tsx        # 프로필
│   │   └── api/
│   │       ├── auth/[...nextauth]/     # 카카오 OAuth
│   │       ├── spotify/search/         # Spotify 검색
│   │       ├── songs/                  # 노래 CRUD
│   │       ├── recommend/              # AI 추천
│   │       └── share/                  # 공유 리스트
│   ├── components/
│   │   ├── BottomNav.tsx               # 하단 네비게이션
│   │   ├── SongCard.tsx                # 곡 카드
│   │   └── AddSongFAB.tsx             # + 플로팅 버튼
│   ├── context/AuthContext.tsx          # Firebase Auth 컨텍스트
│   ├── hooks/useFirestore.ts           # Firestore 훅
│   ├── lib/
│   │   ├── firebase.ts                 # Firebase 클라이언트
│   │   ├── firebase-admin.ts           # Firebase Admin
│   │   ├── spotify.ts                  # Spotify API
│   │   ├── constants.ts                # 상수, 프롬프트
│   │   └── utils.ts                    # 유틸리티
│   └── types/index.ts                  # TypeScript 타입
├── public/manifest.json                # PWA 매니페스트
├── tailwind.config.ts                  # Neon Nocturne 디자인 시스템
└── .env.local.example                  # 환경변수 템플릿
```

## 7. Vercel 배포

```bash
npm install -g vercel
vercel
```

환경변수를 Vercel 대시보드에서 동일하게 설정해주세요.
카카오 개발자 콘솔에서 배포 도메인을 웹 플랫폼에 추가하는 것도 잊지 마세요!
