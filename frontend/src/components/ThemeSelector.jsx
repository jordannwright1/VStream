import React, { useState } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { PaletteIcon } from 'lucide-react';
import { THEMES } from '../constants';

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="btn btn-ghost btn-circle mr-1.5"
      >
        <PaletteIcon className="size-5" />
      </button>

      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto z-50"
        >
          <div className="space-y-1">
            {THEMES.map((themeOption) => (
              <button
                key={themeOption.name}
                className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
                  theme === themeOption.name
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-base-content/5'
                }`}
                onClick={() => {
                  setTheme(themeOption.name);
                }}
              >
                <PaletteIcon className="size-4" />
                <span className="text-sm font-medium">{themeOption.label}</span>
                <div className="ml-auto flex gap-1">
                  {themeOption.colors.map((color, i) => (
                    <span
                      className="size-2 rounded-full"
                      key={i}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
