"use client";

import Link from "next/link";
import { Search, Menu, X, Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border/40"
          : "bg-linear-to-b from-black/80 to-transparent",
      )}
    >
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tighter hover:opacity-90 transition-opacity"
        >
          <Rocket className="w-6 h-6" />
          <span>PlayNova</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/tv"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            TV Shows
          </Link>
          <Link
            href="/seasons"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Seasons
          </Link>
          <Link
            href="/movies"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Movies
          </Link>
        </div>

        {/* Search & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center relative"
          >
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 pl-9 bg-secondary/50 border-transparent focus:bg-background focus:border-input transition-all rounded-full h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/40 p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearch} className="flex items-center relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search titles..."
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-4 py-2 hover:bg-secondary rounded-md text-sm font-medium"
          >
            Home
          </Link>
          <Link
            href="/tv"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-4 py-2 hover:bg-secondary rounded-md text-sm font-medium"
          >
            TV Shows
          </Link>
          <Link
            href="/seasons"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-4 py-2 hover:bg-secondary rounded-md text-sm font-medium"
          >
            Seasons
          </Link>
          <Link
            href="/movies"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-4 py-2 hover:bg-secondary rounded-md text-sm font-medium"
          >
            Movies
          </Link>
        </div>
      )}
    </nav>
  );
};
