import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { getFirebaseDb } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';

// GET: 모든 곡 목록 + 저장 횟수
export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const db = getFirebaseDb();

    // songs 컬렉션에서 전체 곡 가져오기
    const songsSnap = await getDocs(collection(db, 'songs'));

    // userSongs에서 곡별 저장 횟수 집계
    const userSongsSnap = await getDocs(collection(db, 'userSongs'));
    const saveCountMap: Record<string, number> = {};
    const songMetaMap: Record<string, { tjNumber?: string; kyNumber?: string; category?: string }> = {};

    userSongsSnap.docs.forEach(docSnap => {
      const data = docSnap.data();
      const songId = data.songId;
      if (songId) {
        saveCountMap[songId] = (saveCountMap[songId] || 0) + 1;
      }
      // userSongs에서 TJ/KY 번호 수집
      if (songId && (data.tjNumber || data.kyNumber)) {
        if (!songMetaMap[songId]) songMetaMap[songId] = {};
        if (data.tjNumber) songMetaMap[songId].tjNumber = data.tjNumber;
        if (data.kyNumber) songMetaMap[songId].kyNumber = data.kyNumber;
        if (data.category) songMetaMap[songId].category = data.category;
      }
    });

    const songs = songsSnap.docs.map(docSnap => {
      const data = docSnap.data();
      const meta = songMetaMap[docSnap.id] || {};
      const createdAt = data.createdAt?.toDate?.() || data.createdAt;
      return {
        id: docSnap.id,
        title: data.title || '알 수 없음',
        artist: data.artist || '알 수 없음',
        genre: meta.category || data.genre || 'etc',
        tjNumber: meta.tjNumber || data.tjNumber || '',
        kyNumber: meta.kyNumber || data.kyNumber || '',
        albumArtUrl: data.albumArtUrl || '',
        spotifyId: data.spotifyId || '',
        savedBy: saveCountMap[docSnap.id] || 0,
        addedAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
      };
    });

    // 저장 횟수로 정렬
    songs.sort((a, b) => b.savedBy - a.savedBy);

    return NextResponse.json({ songs, total: songs.length });
  } catch (error) {
    console.error('Admin songs error:', error);
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}

// POST: 곡 추가
export async function POST(request: NextRequest) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { title, artist, genre, tjNumber, kyNumber } = body;

    if (!title || !artist) {
      return NextResponse.json({ error: 'title and artist required' }, { status: 400 });
    }

    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, 'songs'), {
      title,
      artist,
      genre: genre || 'etc',
      tjNumber: tjNumber || '',
      kyNumber: kyNumber || '',
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id, success: true });
  } catch (error) {
    console.error('Admin add song error:', error);
    return NextResponse.json({ error: 'Failed to add song' }, { status: 500 });
  }
}

// DELETE: 곡 삭제
export async function DELETE(request: NextRequest) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { songId } = await request.json();
    if (!songId) {
      return NextResponse.json({ error: 'songId required' }, { status: 400 });
    }

    const db = getFirebaseDb();
    await deleteDoc(doc(db, 'songs', songId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin delete song error:', error);
    return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 });
  }
}
