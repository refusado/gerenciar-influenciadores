import { Open_Sans as FontSans } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/toast';
import { Navigate } from '@/components/navigate';
import { Suspense } from 'react';

const sans = FontSans({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`overflow-x-hidden overflow-y-scroll ${sans.variable}`}
    >
      <body className="bg-zinc-900 text-zinc-50">
        <ToastProvider>
          {children}

          <Suspense>
            <Navigate />
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}
