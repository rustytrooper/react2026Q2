import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import ThemeToggle from '../../ui-kit/ButtonSwitchTheme';

export function Header(): ReactNode {
  return (
    <header className="flex justify-center items-center bg-purple-400 dark:bg-purple-950 transition-all duration-300  text-white p-4">
      <nav className="container justify-center mx-auto flex gap-50">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `hover:text-purple-200 transition ${isActive ? 'font-bold underline' : ''}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `hover:text-purple-200 transition ${isActive ? 'font-bold underline' : ''}`
          }
        >
          About
        </NavLink>
        <ThemeToggle />
      </nav>
    </header>
  );
}
