'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function NavItems() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
    },
    {
      href: '/search',
      label: 'Book Search',
      icon: Search,
    },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center space-x-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'text-primary bg-primary/10 shadow-lg'
                : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* Theme Toggle Button */}
      {mounted && (
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 text-foreground/80 hover:text-primary hover:bg-primary/5"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}
