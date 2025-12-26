"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { Calculator, Sun, Moon, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only apply hide behavior on mobile (< 768px) and when menu is closed
      if (window.innerWidth < 768 && !isMenuOpen) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down & past 100px
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMenuOpen]);

  const navLinks = [
    { href: "/kidem-tazminati-hesaplama", label: "Kıdem ve İhbar" },
    { href: "/issizlik-maasi-hesaplama", label: "İşsizlik Maaşı" },
    { href: "/sgk-cikis-kodlari", label: "SGK Çıkış Kodları" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <nav 
      className={`sticky top-0 z-50 border-b border-[var(--border-light)] bg-[var(--card)]/95 backdrop-blur-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-[var(--primary)]">
            <Calculator className="text-xl w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">
            Hakkım Ne?
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
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
          
          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center size-10 rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
            aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-[var(--text-muted)]" />
            ) : (
              <Menu className="w-5 h-5 text-[var(--text-muted)]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-[var(--border-light)] bg-[var(--card)] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block py-3 px-4 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--muted)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

