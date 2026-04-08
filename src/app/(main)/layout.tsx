import BottomNav from '@/components/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-dark">
      <main className="mx-auto max-w-lg pb-safe">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
