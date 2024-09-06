'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminHeader() {
  const currentPath = usePathname();

  const paths = [
    { title: 'inicio', path: '/admin' },
    { title: 'influenciadores', path: '/admin/influenciadores' },
    { title: 'marcas', path: '/admin/marcas' },
  ];

  return (
    <header id="header" className="mt-4">
      <nav className="mx-auto flex w-fit select-none flex-wrap rounded-full *:bg-zinc-700 *:text-zinc-100 *:ring-inset *:focus-visible:ring-2">
        {paths.map(({ title, path }, i) => {
          const pathsMatch = currentPath == path;

          return (
            <Link
              key={i}
              data-disabled={pathsMatch}
              aria-disabled={pathsMatch}
              tabIndex={pathsMatch ? -1 : 1}
              className="px-6 py-2 first:rounded-l-full last:rounded-r-full hover:bg-white/10 hover:no-underline data-[disabled='true']:pointer-events-none data-[disabled='true']:cursor-default data-[disabled='true']:opacity-70"
              href={path}
            >
              {title}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
