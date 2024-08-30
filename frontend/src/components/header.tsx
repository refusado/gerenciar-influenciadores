'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const currentPath = usePathname();

  const paths = [
    { title: 'início', path: '/' },
    { title: 'gerenciar', path: '/admin' },
  ];

  return (
    <header id="header" className="mt-4">
      <nav className="mx-auto flex w-fit flex-wrap rounded-full bg-zinc-700 *:text-zinc-100">
        {paths.map(({ title, path }, i) => (
          <Link
            key={i}
            tabIndex={currentPath == path ? -1 : 1}
            className={`px-6 py-2 capitalize ring-inset first:rounded-l-full last:rounded-r-full hover:no-underline ${currentPath == path ? 'cursor-default opacity-70' : 'hover:bg-white/10 focus-visible:ring-2'}`}
            href={path}
          >
            {title}
          </Link>
        ))}
      </nav>
    </header>
  );
}
