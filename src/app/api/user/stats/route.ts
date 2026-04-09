import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseDb } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// GET: 유저 통계 (곡 수, 카테고리 분포, 공유 리스트 수, 최근 곡)
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getFirebaseDb();

    // 유저의 저장된 곡 조회
    const userSongsRef = collection(db, 'userSongs');
    const songsQuery = query(userSongsRef, where('userId', '==', userId));
    const songsSnapshot = await getDocs(songsQuery);

    const songs = songsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 카테고리 분포 집계
    const categoryMap: Record<string, number> = {};
    songs.forEach((song: any) => {
      const cat = song.category || 'etc';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const categories = Object.entries(categoryMap)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    // 최근 추가한 곡 (sortOrder 기준 내림차순 상위 5개)
    const recentSongs = [...songs]
      .sort((a: any, b: any) => (b.sortOrder || 0) - (a.sortOrder || 0))
      .slice(0, 5);

    // 공유 리스트 수
    const sharesRef = collection(db, 'sharedLists');
    const sharesQuery = query(sharesRef, where('userId', '==', userId));
    const sharesSnapshot = await getDocs(sharesQuery);
    const shareCount = sharesSnapshot.size;

    return NextResponse.json({
      totalSongs: songs.length,
      shareCount,
      categories,
      recentSongs,
    });
  } catch (error) {
    console.error('User stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
