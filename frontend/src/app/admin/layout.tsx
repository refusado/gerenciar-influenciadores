import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { LogoutBtn } from './components/logout-btn';
import { AdminHeader } from './components/admin-header';
import { ChartBar } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin - Influenciadores e Marcas',
  description: 'Seção de administradores para o site da plataforma',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <AdminHeader />
      <div className="container py-8">
        <p>
          <LogoutBtn />
        </p>
        <h1 className="flex items-center gap-3">
          <Link href="/admin">
            <ChartBar className="inline-block size-8 text-zinc-200/90" /> Painel
            administrativo
          </Link>
        </h1>

        {children}
      </div>
    </>
  );
}
