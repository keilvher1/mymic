import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { getFirebaseDb } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const db = getFirebaseDb();

    // 1. 총 사용자 수 (userSongs에서 고유 userId 카운트)
    const userSongsSnap = await getDocs(collection(db, 'userSongs'));
    const uniqueUserIds = new Set<string>();
    userSongsSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.userId) uniqueUserIds.add(data.userId);
    });

    // 2. 총 곡 수
    const songsSnap = await getDocs(collection(db, 'songs'));
    const totalSongs = songsSnap.size;

    // 3. 공유 리스트 수
    const sharesSnap = await getDocs(collection(db, 'sharedLists'));
    const totalShares = sharesSnap.size;

    // 4. 총 저장된 곡 수 (userSongs)
    const totalUserSongs = userSongsSnap.size;

    // 5. 인기 곡 TOP 10 (곡별 저장 횟수)
    const songSaveCount: Record<string, { title: string; artist: string; count: number; genre?: string }> = {};
    userSongsSnap.docs.forEach(doc => {
      const data = doc.data();
      const song = data.song;
      if (song) {
        const key = song.spotifyId || song.title;
        if (!songSaveCount[key]) {
          songSaveCount[key] = {
            title: song.title || '알 수 없음',
            artist: song.artist || '알 수 없음',
            count: 0,
            genre: data.category || 'etc',
          };
        }
        songSaveCount[key].count++;
      }
    });
    const popularSongs = Object.values(songSaveCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 6. 카테고리(장르) 분포
    const genreCount: Record<string, number> = {};
    userSongsSnap.docs.forEach(doc => {
      const cat = doc.data().category || 'etc';
      genreCount[cat] = (genreCount[cat] || 0) + 1;
    });
    const genreDistribution = Object.entries(genreCount)
      .map(([name, count]) => ({ name, count, percentage: totalUserSongs > 0 ? Math.round((count / totalUserSongs) * 100) : 0 }))
      .sort((a, b) => b.count - a.count);

    // 7. TJ/KY 분포
    let tjCount = 0;
    let kyCount = 0;
    userSongsSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.tjNumber) tjCount++;
      if (data.kyNumber) kyCount++;
    });

    // 8. 공유 리스트 상태별 카운트
    let activeShares = 0;
    let reportedShares = 0;
    let hiddenShares = 0;
    sharesSnap.docs.forEach(doc => {
      const data = doc.data();
      const status = data.status || 'active';
      if (status === 'active') activeShares++;
      else if (status === 'reported') reportedShares++;
      else if (status === 'hidden') hiddenShares++;
    });

    return NextResponse.json({
      totalUsers: uniqueUserIds.size,
      totalSongs,
      totalUserSongs,
      totalShares,
      popularSongs,
      genreDistribution,
      tjCount,
      kyCount,
      shareStatus: { active: activeShares, reported: reportedShares, hidden: hiddenShares },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
