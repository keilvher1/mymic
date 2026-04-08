import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { getFirebaseDb } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// GET: 모든 공유 리스트
export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const db = getFirebaseDb();

    const sharesSnap = await getDocs(collection(db, 'sharedLists'));

    // userSongs에서 userId -> 닉네임 추정 (userProfiles 사용 시도)
    let profileMap: Record<string, string> = {};
    try {
      const profilesSnap = await getDocs(collection(db, 'userProfiles'));
      profilesSnap.docs.forEach(docSnap => {
        const data = docSnap.data();
        profileMap[data.kakaoId || docSnap.id] = data.nickname || data.name || `사용자_${docSnap.id.slice(-4)}`;
      });
    } catch (e) {
      // 무시
    }

    const shares = sharesSnap.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAt = data.createdAt?.toDate?.() || data.createdAt;
      return {
        id: docSnap.id,
        title: data.title || '제목 없음',
        description: data.description || '',
        creator: profileMap[data.userId] || `사용자_${(data.userId || '').slice(-4)}`,
        creatorId: data.userId || '',
        songCount: data.songIds?.length || 0,
        songIds: data.songIds || [],
        shareCode: data.shareCode || '',
        isPublic: data.isPublic !== false,
        status: data.status || 'active',
        viewCount: data.viewCount || 0,
        createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
      };
    });

    // 최신순 정렬
    shares.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ shares, total: shares.length });
  } catch (error) {
    console.error('Admin shares error:', error);
    return NextResponse.json({ error: 'Failed to fetch shares' }, { status: 500 });
  }
}

// PATCH: 공유 리스트 상태 변경 (active/reported/hidden)
export async function PATCH(request: NextRequest) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { shareId, status } = await request.json();
    if (!shareId || !status) {
      return NextResponse.json({ error: 'shareId and status required' }, { status: 400 });
    }

    const db = getFirebaseDb();
    await updateDoc(doc(db, 'sharedLists', shareId), { status });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin update share error:', error);
    return NextResponse.json({ error: 'Failed to update share' }, { status: 500 });
  }
}

// DELETE: 공유 리스트 삭제
export async function DELETE(request: NextRequest) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { shareId } = await request.json();
    if (!shareId) {
      return NextResponse.json({ error: 'shareId required' }, { status: 400 });
    }

    const db = getFirebaseDb();
    await deleteDoc(doc(db, 'sharedLists', shareId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin delete share error:', error);
    return NextResponse.json({ error: 'Failed to delete share' }, { status: 500 });
  }
}
