'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function AddSongFAB() {
  return (
    <Link
      href="/search"
      className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-gradient-neon
                 flex items-center justify-center shadow-lg neon-glow
                 active:scale-90 transition-transform duration-200"
    >
      <Plus size={28} className="text-white" strokeWidth={2.5} />
    </Link>
  );
}
