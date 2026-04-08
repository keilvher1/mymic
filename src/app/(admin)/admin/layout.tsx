'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Music,
  Share2,
  Shield,
  LogOut,
  Mic,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/users', label: '사용자 관리', icon: Users },
  { href: '/admin/songs', label: '곡 관리', icon: Music },
  { href: '/admin/shares', label: '공유 리스트', icon: Share2 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [adminCheck, setAdminCheck] = useState<'loading' | 'admin' | 'denied'>('loading');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/admin/check')
        .then((res) => res.json())
        .then((data) => {
          if (data.isAdmin) {
            setAdminCheck('admin');
          } else {
            setAdminCheck('denied');
          }
        })
        .catch(() => setAdminCheck('denied'));
    }
  }, [status, router]);

  if (status === 'loading' || adminCheck === 'loading') {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400">권한 확인 중...</p>
        </div>
      </div>
    );
  }

  if (adminCheck === 'denied') {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center px-6">
        <div className="card-neon p-8 rounded-2xl text-center max-w-sm">
          <Shield size={48} className="text-tertiary mx-auto mb-4" />
          <h1 className="font-heading font-bold text-xl mb-2">접근 권한 없음</h1>
          <p className="text-sm text-gray-400 mb-6">
            관리자 권한이 필요합니다.
          </p>
          <Link href="/home" className="btn-primary inline-block">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-white/5 flex flex-col fixed h-full z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-neon flex items-center justify-center">
              <Mic size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-sm">
                <span className="bg-gradient-neon bg-clip-text text-transparent">마이마이크</span>
              </h1>
              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                <Shield size={10} /> Admin
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                      isActive
                        ? 'bg-primary/20 text-primary-light font-semibold'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <ChevronRight size={14} className="text-primary-light" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-neon flex items-center justify-center text-xs font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">
                {session?.user?.name || 'Admin'}
              </p>
              <p className="text-[10px] text-gray-500">관리자</p>
            </div>
          </div>
          <Link
            href="/home"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-white/5 hover:text-white transition-all"
          >
            <LogOut size={16} />
            <span>서비스로 돌아가기</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
