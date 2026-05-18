import type { ReactNode } from 'react';
import { NavLink } from 'react-router';

export function Header(): ReactNode {
  return (
    <header className="flex justify-center items-center bg-purple-400  text-white p-4">
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
      </nav>
    </header>
  );
}
