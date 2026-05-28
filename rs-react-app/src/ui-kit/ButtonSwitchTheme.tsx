import sun from '../assets/sun.png';
import moon from '../assets/moon.png';
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
        <img src={sun} alt="light" />
      ) : (
        <img src={moon} alt="dark" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
