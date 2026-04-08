'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, Sparkles, Share2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', label: '홈', icon: Home },
  { href: '/search', label: '검색', icon: Search },
  { href: '/recommend', label: 'AI추천', icon: Sparkles },
  { href: '/share', label: '공유', icon: Share2 },
  { href: '/profile', label: '프로필', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">
      <div className="mx-auto max-w-lg flex items-center justify-around px-2 py-2 pb-[max(env(safe-area-inset-bottom),8px)]">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]',
                isActive
                  ? 'text-primary-light'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <div className={cn(
                'p-1.5 rounded-xl transition-all duration-200',
                isActive && 'bg-primary/20'
              )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
