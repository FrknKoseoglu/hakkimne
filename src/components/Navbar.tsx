"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { Calculator, Sun, Moon } from "lucide-react";
import { CURRENT_YEAR } from "@/lib/constants";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-[var(--border-light)] bg-[var(--card)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-[var(--primary)]">
            <Calculator className="text-xl w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">
            Hakkım Ne?
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            Kıdem ve İhbar
          </Link>
          <Link
            href="/issizlik-maasi-hesaplama"
            className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            İşsizlik Maaşı
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            Blog
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-light)] bg-[var(--background-light)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
            title={theme === "dark" ? "Açık Tema" : "Koyu Tema"}
          >
            {theme === "dark" ? (
              <Sun className="text-lg text-[var(--text-muted)] w-5 h-5" />
            ) : (
              <Moon className="text-lg text-[var(--text-muted)] w-5 h-5" />
            )}
            <span className="text-xs font-medium text-[var(--text-muted)] hidden sm:inline">
              {theme === "dark" ? "Açık" : "Koyu"}
            </span>
          </button>
          
          <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-200 dark:ring-blue-700">
            {CURRENT_YEAR} Güncel
          </span>
        </div>
      </div>
    </nav>
  );
}

