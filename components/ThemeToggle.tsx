'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Evita hidratação incorreta (mismatch entre server e client)
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-6" />; // Placeholder para evitar layout shift
  }

  return (
    <div className="flex items-center justify-center mb-4">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`
          relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
          ${theme === 'dark' ? 'bg-gray-700' : 'bg-pink-100'}
        `}
        aria-label="Alternar tema"
      >
        <span className="sr-only">Alternar tema</span>
        <span
          className={`
            ${theme === 'dark' ? 'translate-x-9 bg-gray-900' : 'translate-x-1 bg-white'}
            inline-block h-6 w-6 transform rounded-full shadow-md transition-transform duration-300 flex items-center justify-center
          `}
        >
          {theme === 'dark' ? (
            <Moon className="h-4 w-4 text-yellow-300" />
          ) : (
            <Sun className="h-4 w-4 text-orange-400" />
          )}
        </span>
      </button>
    </div>
  );
}
