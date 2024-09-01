'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const currentPath = usePathname();

  // paths for client side routing with SPA using nextjs prefetch
  const spaPaths = [
    { title: 'início', path: '/' },
    { title: 'entrar', path: '/login' },
  ];

  // paths for standard navigation with full page reload (for backend validation)
  const paths = [{ title: 'gerenciar', path: '/admin' }];

  return (
    <header id="header" className="mt-4">
      <nav className="mx-auto flex w-fit select-none flex-wrap rounded-full *:bg-zinc-700 *:text-zinc-100 *:ring-inset *:focus-visible:ring-2">
        {spaPaths.map(({ title, path }, i) => (
          <Link
            key={i}
            data-disabled={currentPath == path}
            aria-disabled={currentPath == path}
            tabIndex={currentPath == path ? -1 : 1}
            className="px-6 py-2 first:rounded-l-full last:rounded-r-full hover:bg-white/10 hover:no-underline data-[disabled='true']:pointer-events-none data-[disabled='true']:cursor-default data-[disabled='true']:opacity-70"
            href={path}
          >
            {title}
          </Link>
        ))}
        {paths.map(({ title, path }, i) => (
          <a
            key={i}
            data-disabled={currentPath == path}
            aria-disabled={currentPath == path}
            tabIndex={currentPath == path ? -1 : 1}
            className="px-6 py-2 first:rounded-l-full last:rounded-r-full hover:bg-white/10 hover:no-underline data-[disabled='true']:pointer-events-none data-[disabled='true']:cursor-default data-[disabled='true']:opacity-70"
            href={path}
          >
            {title}
          </a>
        ))}
      </nav>
    </header>
  );
}
