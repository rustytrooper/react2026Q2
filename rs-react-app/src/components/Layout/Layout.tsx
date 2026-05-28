import { Outlet } from 'react-router';
import { Header } from '../Header/Header';
import { ThemeProvider } from '../../context/ThemeContext';

export function Layout() {
  return (
    <ThemeProvider>
      <div className="bg-gray-100 dark:bg-purple-900 transition-all duration-300">
        <Header />
        <Outlet />
      </div>
    </ThemeProvider>
  );
}
