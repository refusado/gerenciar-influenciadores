'use client';

import { Header } from '@/components/header';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [headerBottom, setHeaderBottom] = useState(56);

  useEffect(() => {
    const header = document.getElementById('header');
    if (!header) return;

    const endsAt = header.offsetHeight + header.offsetTop;

    setHeaderBottom(endsAt);
  }, []);

  return (
    <>
      <Header />
      <main
        className="container flex animate-fade items-center justify-center animate-duration-300"
        style={{
          height: `calc(100vh - ${headerBottom}px)`,
        }}
      >
        <section className="flex flex-col items-center gap-8">
          <h1 className="text-2xl">Página não encontrada :/</h1>
          <p className="pointer-events-none skew-y-6 scale-y-150 font-mono text-[10rem] font-bold text-blue-100/70">
            404
          </p>
          <Link className="p-1" href="/">
            Voltar para o início
          </Link>
        </section>
      </main>
    </>
  );
}
