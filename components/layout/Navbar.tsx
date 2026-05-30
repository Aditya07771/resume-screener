/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Home, Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <nav className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40 dark:border-zinc-800/80 dark:bg-black/80">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg shadow-md shadow-blue-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-extrabold tracking-tight dark:from-blue-400 dark:to-indigo-400">
              ResumeRank AI
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-blue-600 dark:hover:text-blue-400",
                pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400'
              )}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300 active:scale-95 cursor-pointer border border-zinc-200/50 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm flex items-center justify-center"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <Sun 
                  className={cn(
                    "absolute h-5 w-5 text-amber-500 transition-all duration-300 transform",
                    mounted && theme === 'dark' ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
                  )} 
                />
                <Moon 
                  className={cn(
                    "absolute h-5 w-5 text-zinc-700 dark:text-zinc-300 transition-all duration-300 transform",
                    mounted && theme === 'light' ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                  )} 
                />
                {!mounted && <span className="block w-5 h-5" />}
              </div>
            </button>

            <Link
              href="/upload"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]",
                pathname === '/upload'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
              )}
            >
              Start Screening
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
