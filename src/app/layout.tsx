import type { Metadata, Viewport } from 'next';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: '마이마이크 MyMic — 나만의 애창곡 관리',
  description: 'AI가 추천해주는 나만의 애창곡 관리 서비스. 노래방에서 뭐 부를지 고민하지 마세요!',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F0F12',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen bg-surface-dark text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
