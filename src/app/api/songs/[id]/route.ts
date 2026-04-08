import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseDb } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// PATCH: 애창곡 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const db = getFirebaseDb();
    const songRef = doc(db, 'userSongs', params.id);

    await updateDoc(songRef, {
      ...body,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update song error:', error);
    return NextResponse.json({ error: 'Failed to update song' }, { status: 500 });
  }
}

// DELETE: 애창곡 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getFirebaseDb();
    const songRef = doc(db, 'userSongs', params.id);
    await deleteDoc(songRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete song error:', error);
    return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 });
  }
}
