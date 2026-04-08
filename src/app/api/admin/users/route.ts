import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { getFirebaseDb } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// GET: 모든 사용자 목록 (userSongs에서 userId별 집계)
export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const db = getFirebaseDb();

    // userSongs에서 사용자별 곡 수 집계
    const userSongsSnap = await getDocs(collection(db, 'userSongs'));
    const userMap: Record<string, {
      songCount: number;
      lastActive: string;
      firstSeen: string;
    }> = {};

    userSongsSnap.docs.forEach(doc => {
      const data = doc.data();
      const userId = data.userId;
      if (!userId) return;

      const createdAt = data.createdAt?.toDate?.() || data.createdAt;
      const dateStr = createdAt ? new Date(createdAt).toISOString() : new Date().toISOString();

      if (!userMap[userId]) {
        userMap[userId] = { songCount: 0, lastActive: dateStr, firstSeen: dateStr };
      }
      userMap[userId].songCount++;
      if (dateStr > userMap[userId].lastActive) {
        userMap[userId].lastActive = dateStr;
      }
      if (dateStr < userMap[userId].firstSeen) {
        userMap[userId].firstSeen = dateStr;
      }
    });

    // sharedLists에서 사용자별 공유 수 집계
    const sharesSnap = await getDocs(collection(db, 'sharedLists'));
    const shareCountMap: Record<string, number> = {};
    sharesSnap.docs.forEach(doc => {
      const userId = doc.data().userId;
      if (userId) {
        shareCountMap[userId] = (shareCountMap[userId] || 0) + 1;
      }
    });

    // userProfiles 컬렉션이 있으면 가져오기
    let profileMap: Record<string, any> = {};
    try {
      const profilesSnap = await getDocs(collection(db, 'userProfiles'));
      profilesSnap.docs.forEach(doc => {
        const data = doc.data();
        profileMap[data.kakaoId || doc.id] = {
          nickname: data.nickname || data.name || null,
          avatarUrl: data.avatarUrl || data.image || null,
          kakaoId: data.kakaoId || null,
          status: data.status || 'active',
        };
      });
    } catch (e) {
      // userProfiles 컬렉션이 없을 수 있음
    }

    // 사용자 목록 조합
    const users = Object.entries(userMap).map(([userId, data]) => {
      const profile = profileMap[userId] || {};
      return {
        id: userId,
        kakaoId: profile.kakaoId || userId,
        nickname: profile.nickname || `사용자_${userId.slice(-4)}`,
        avatarUrl: profile.avatarUrl || null,
        songCount: data.songCount,
        shareCount: shareCountMap[userId] || 0,
        joinedAt: data.firstSeen,
        lastActive: data.lastActive,
        status: profile.status || 'active',
      };
    });

    // 곡 수 기준 정렬
    users.sort((a, b) => b.songCount - a.songCount);

    return NextResponse.json({ users, total: users.length });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// PATCH: 사용자 상태 변경 (차단/활성화)
export async function PATCH(request: NextRequest) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { userId, status } = await request.json();
    if (!userId || !status) {
      return NextResponse.json({ error: 'userId and status required' }, { status: 400 });
    }

    const db = getFirebaseDb();

    // userProfiles에 상태 업데이트 (없으면 생성)
    const profilesSnap = await getDocs(collection(db, 'userProfiles'));
    let found = false;
    for (const docSnap of profilesSnap.docs) {
      if (docSnap.data().kakaoId === userId || docSnap.id === userId) {
        await updateDoc(doc(db, 'userProfiles', docSnap.id), { status });
        found = true;
        break;
      }
    }

    return NextResponse.json({ success: true, userId, status, existed: found });
  } catch (error) {
    console.error('Admin update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
