import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { generateShareCode } from '@/lib/utils';

// GET: 내 공유 리스트
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const listsRef = collection(db, 'sharedLists');
    const q = query(listsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const lists = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(lists);
  } catch (error) {
    console.error('Get shared lists error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST: 공유 리스트 생성
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, songIds } = await request.json();

    const shareCode = generateShareCode();

    const docRef = await addDoc(collection(db, 'sharedLists'), {
      userId,
      title: title || '내 애창곡 리스트',
      description: description || '',
      shareCode,
      isPublic: true,
      songIds: songIds || [],
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      id: docRef.id,
      shareCode,
      shareUrl: `/s/${shareCode}`,
    });
  } catch (error) {
    console.error('Create shared list error:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
