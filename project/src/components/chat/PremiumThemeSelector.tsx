import React from 'react';
import { useThemeStore, ThemeName } from '../../store/themeStore';

const premiumThemes: { [key in ThemeName]?: { label: string; color: string; bgImage: string } } = {
  premium1: {
    label: 'Pink Blossom',
    color: 'bg-pink-500',
    bgImage: 'url("/images/premium1-bg.png")',
  },
  premium2: {
    label: 'Green Meadow',
    color: 'bg-green-500',
    bgImage: 'url("/images/premium2-bg.png")',
  },
  premium3: {
    label: 'Purple Haze',
    color: 'bg-purple-500',
    bgImage: 'url("/images/premium3-bg.png")',
  },
};

export const PremiumThemeSelector: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  const handleSelect = (themeName: ThemeName) => {
    setTheme(themeName);
  };

  return (
    <div className="p-4 bg-background rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-3 text-white">Select Your Premium Theme</h3>
      <div className="flex space-x-4">
        {Object.entries(premiumThemes).map(([key, { label, color, bgImage }]) => (
          <button
            key={key}
            onClick={() => handleSelect(key as ThemeName)}
            className={\`flex flex-col items-center p-2 rounded-lg cursor-pointer border-2 \${theme === key ? 'border-white' : 'border-transparent'} hover:border-white transition-all\`}
            style={{ backgroundImage: bgImage, backgroundSize: 'cover', backgroundPosition: 'center' }}
            aria-label={label}
          >
            <div className={\`w-12 h-12 rounded-full \${color} mb-2\`} />
            <span className="text-white text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
