'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const pathname = usePathname();

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

          <div className="flex items-center gap-6">
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
