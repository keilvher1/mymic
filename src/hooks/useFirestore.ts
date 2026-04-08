'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import type { UserSong, AddSongForm } from '@/types';

export function useUserSongs(userId: string | undefined) {
  const [songs, setSongs] = useState<UserSong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setSongs([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'userSongs'),
      where('userId', '==', userId),
      orderBy('sortOrder', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as UserSong[];

      setSongs(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addSong = useCallback(
    async (form: AddSongForm) => {
      if (!userId) return;
      await addDoc(collection(db, 'userSongs'), {
        userId,
        song: form.song,
        category: form.category,
        moodTags: form.moodTags,
        confidence: form.confidence,
        tjNumber: form.tjNumber,
        kyNumber: form.kyNumber,
        memo: form.memo,
        sortOrder: Date.now(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    [userId]
  );

  const updateSong = useCallback(async (id: string, data: Partial<UserSong>) => {
    await updateDoc(doc(db, 'userSongs', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }, []);

  const deleteSong = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'userSongs', id));
  }, []);

  return { songs, loading, addSong, updateSong, deleteSong };
}
