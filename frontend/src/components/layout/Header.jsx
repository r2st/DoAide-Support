import { Sun, Moon, Monitor, Bell, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

export default function Header({ title }) {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const themeIcons = { light: Sun, dark: Moon, system: Monitor };
  const nextTheme = { dark: 'light', light: 'system', system: 'dark' };
  const ThemeIcon = themeIcons[theme];

  return (
    <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-[var(--color-bg)] rounded-lg px-3 py-1.5 border border-[var(--color-border)]">
          <Search className="h-4 w-4 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] outline-none w-48"
          />
        </div>

        <button className="relative p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <button
          onClick={() => setTheme(nextTheme[theme])}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
          title={`Theme: ${theme}`}
        >
          <ThemeIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
