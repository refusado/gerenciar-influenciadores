'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const currentPath = usePathname();

  // paths for client side routing with SPA using nextjs prefetch
  const spaPaths = [
    { title: 'website', path: '/' },
    { title: 'entrar', path: '/login' },
  ];

  // paths for standard navigation with hard reload
  const paths = [{ title: 'gerenciar', path: '/admin' }];

  const allPaths = [
    ...spaPaths.map((keys) => ({ ...keys, isSPA: true })),
    ...paths.map((keys) => ({ ...keys, isSPA: false })),
  ];

  return (
    <header id="header" className="mt-4">
      <nav className="mx-auto flex w-fit select-none flex-wrap rounded-full *:bg-zinc-700 *:text-zinc-100 *:ring-inset *:focus-visible:ring-2">
        {allPaths.map(({ title, path, isSPA }, i) => {
          let isCurrentPath = false;
          if (path === '/') {
            isCurrentPath = currentPath === path;
          } else {
            isCurrentPath = currentPath.startsWith(path);
          }

          const Comp = isSPA ? Link : 'a';

          return (
            <Comp
              key={i}
              data-disabled={isCurrentPath}
              aria-disabled={isCurrentPath}
              tabIndex={isCurrentPath ? -1 : 1}
              className="px-6 py-2 first:rounded-l-full last:rounded-r-full hover:bg-white/10 hover:no-underline data-[disabled='true']:pointer-events-none data-[disabled='true']:cursor-default data-[disabled='true']:opacity-70"
              href={path}
            >
              {title}
            </Comp>
          );
        })}
      </nav>
    </header>
  );
}
