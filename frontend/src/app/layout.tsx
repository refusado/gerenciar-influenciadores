import { Open_Sans as FontSans } from 'next/font/google';
import './globals.css';
import { Navigate } from '@/components/navigate';
import { Suspense } from 'react';
import { Providers } from './providers';

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
      <body
        className="bg-zinc-900 text-zinc-200"
        style={{ marginRight: '0px !important' }}
      >
        <Providers>
          {children}

          <Suspense>
            <Navigate />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
