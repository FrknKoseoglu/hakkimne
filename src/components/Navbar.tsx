"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { Calculator, Sun, Moon, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

// Navigation structure
const navCategories = {
  istenCikis: {
    label: "İşten Çıkış",
    items: [
      { href: "/kidem-tazminati-hesaplama", label: "Tazminat Hesaplama" },
      { href: "/issizlik-maasi-hesaplama", label: "İşsizlik Maaşı" },
      { href: "/ihbar-suresi-hesaplama", label: "İhbar Süresi" },
      { href: "/istifa-dilekcesi-olustur", label: "İstifa Dilekçesi Oluştur" },
      { href: "/sgk-cikis-kodlari", label: "SGK Çıkış Kodları" },
    ],
  },
  hesaplamalar: {
    label: "Hesaplamalar",
    items: [
      { href: "/netten-brute-hesaplama", label: "Netten Brüte Hesaplama" },
      { href: "/fazla-mesai-ucreti-hesaplama", label: "Fazla Mesai" },
      { href: "/bedelli-askerlik-ucreti-hesaplama", label: "Bedelli Askerlik" },
      { href: "/kira-artis-orani-hesaplama", label: "Kira Artış Oranı" },
      { href: "/maas-zammi-hesaplama", label: "Maaş Zammı" },
      { href: "/mtv-hesaplama", label: "MTV Hesaplama" },
    ],
  },

};

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              {/* İşten Çıkış Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>{navCategories.istenCikis.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[220px] gap-1 p-2">
                    {navCategories.istenCikis.items.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-[var(--muted)] hover:text-[var(--text-main)] text-[var(--text-muted)]"
                          >
                            {item.label}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Hesaplamalar Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>{navCategories.hesaplamalar.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[220px] gap-1 p-2">
                    {navCategories.hesaplamalar.items.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-[var(--muted)] hover:text-[var(--text-main)] text-[var(--text-muted)]"
                          >
                            {item.label}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Blog Link */}
              <NavigationMenuItem>
                <Link
                  href="/blog"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors bg-transparent hover:bg-[var(--muted)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  Blog
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
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
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-[var(--border-light)] bg-[var(--card)] px-4 py-3 space-y-2">
          {/* İşten Çıkış Section */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection("istenCikis")}
              className="flex items-center justify-between w-full py-3 px-4 rounded-lg text-sm font-medium text-[var(--text-main)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
            >
              <span>{navCategories.istenCikis.label}</span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${
                  expandedSection === "istenCikis" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                expandedSection === "istenCikis" ? "max-h-48" : "max-h-0"
              }`}
            >
              <div className="pl-4 space-y-1">
                {navCategories.istenCikis.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2.5 px-4 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--muted)] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Hesaplamalar Section */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection("hesaplamalar")}
              className="flex items-center justify-between w-full py-3 px-4 rounded-lg text-sm font-medium text-[var(--text-main)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
            >
              <span>{navCategories.hesaplamalar.label}</span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${
                  expandedSection === "hesaplamalar" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                expandedSection === "hesaplamalar" ? "max-h-48" : "max-h-0"
              }`}
            >
              <div className="pl-4 space-y-1">
                {navCategories.hesaplamalar.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2.5 px-4 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--muted)] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Link */}
          <Link
            href="/blog"
            onClick={() => setIsMenuOpen(false)}
            className="block py-3 px-4 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--muted)] transition-colors"
          >
            Blog
          </Link>
        </div>
      </div>
    </nav>
  );
}
