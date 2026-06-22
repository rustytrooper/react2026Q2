'use client'  

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggleButton from '../../ui-kit/ButtonSwitchTheme';

export function Header(): ReactNode {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="flex justify-center items-center bg-purple-400 dark:bg-purple-950 transition-all duration-300 text-white p-4">
      <nav className="container justify-center mx-auto flex gap-50">
        <Link
          href="/"
          className={`hover:text-purple-200 transition ${
            isActive('/') ? 'font-bold underline' : ''
          }`}
        >
          Home
        </Link>

        <Link
          href="/about"
          className={`hover:text-purple-200 transition ${
            isActive('/about') ? 'font-bold underline' : ''
          }`}
        >
          About
        </Link>

        <ThemeToggleButton />
      </nav>
    </header>
  );
}