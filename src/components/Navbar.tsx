"use client";

import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-[var(--border-light)] bg-[var(--card)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[960px] items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-[var(--primary)]">
            <span className="material-symbols-outlined text-xl">calculate</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-main)]">
            Hakkım Ne?
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-light)] bg-[var(--background-light)] hover:bg-[var(--muted)] transition-colors"
            title={theme === "dark" ? "Açık Tema" : "Koyu Tema"}
          >
            <span className="material-symbols-outlined text-lg text-[var(--text-muted)]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
            <span className="text-xs font-medium text-[var(--text-muted)] hidden sm:inline">
              {theme === "dark" ? "Açık" : "Koyu"}
            </span>
          </button>
          
          <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-200 dark:ring-blue-700">
            2025 Güncel
          </span>
        </div>
      </div>
    </nav>
  );
}
