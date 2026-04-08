import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseDb } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

// GET: 내 애창곡 목록
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getFirebaseDb();
    const songsRef = collection(db, 'userSongs');
    const q = query(
      songsRef,
      where('userId', '==', userId),
      orderBy('sortOrder', 'asc')
    );

    const snapshot = await getDocs(q);
    const songs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(songs);
  } catch (error) {
    console.error('Get songs error:', error);
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}

// POST: 애창곡 추가
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { song, category, moodTags, confidence, tjNumber, kyNumber, memo } = body;

    // songs 컬렉션에 곡 정보 upsert (spotifyId로 중복 방지)
    const db = getFirebaseDb();
    const songsRef = collection(db, 'songs');
    const existingQuery = query(songsRef, where('spotifyId', '==', song.spotifyId));
    const existing = await getDocs(existingQuery);

    let songDocId: string;
    if (existing.empty) {
      const songDoc = await addDoc(songsRef, {
        ...song,
        createdAt: serverTimestamp(),
      });
      songDocId = songDoc.id;
    } else {
      songDocId = existing.docs[0].id;
    }

    // userSongs에 추가
    const userSongsRef = collection(db, 'userSongs');
    const userSongDoc = await addDoc(userSongsRef, {
      userId,
      songId: songDocId,
      song, // 빠른 조회를 위한 임베딩
      category: category || 'etc',
      moodTags: moodTags || [],
      confidence: confidence || 3,
      tjNumber: tjNumber || '',
      kyNumber: kyNumber || '',
      memo: memo || '',
      sortOrder: Date.now(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id: userSongDoc.id, success: true });
  } catch (error) {
    console.error('Add song error:', error);
    return NextResponse.json({ error: 'Failed to add song' }, { status: 500 });
  }
}
