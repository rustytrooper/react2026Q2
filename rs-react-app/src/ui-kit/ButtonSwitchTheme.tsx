import sun from '../public/sun.png';
import moon from '../public/moon.png';
import { useTheme } from '../context/ThemeContext';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 
        rounded-lg 
        transition-colors 
        duration-300
        bg-gray-200 
        hover:bg-gray-300 
        cursor-pointer
      "
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <img src={sun.src} alt="light" />
      ) : (
        <img src={moon.src} alt="dark" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
