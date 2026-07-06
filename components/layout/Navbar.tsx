'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import BrandName from '@/components/BrandName';

const navLinks: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Social Nights', href: '/social-nights' },
  { label: 'Matchmaking', href: '/matchmaking' },
  { label: 'Shop', href: '/shop' },
  { label: 'Cafe', href: '/cafe' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled ? 'py-2' : 'py-4',
      )}
    >
      <div className="container-px">
        <div
          className={cn(
            'glass rounded-2xl flex items-center justify-between gap-4 px-4 md:px-6 py-3 transition-all',
            scrolled && 'shadow-glow',
          )}
        >
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-neon-cyan via-neon-blue to-neon-violet shadow-glow grid place-items-center font-black text-ink-950">
              S
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <BrandName className="font-display font-bold tracking-wide text-sm md:text-base" />

              <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                Table Tennis Hub
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-sm">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/5 transition"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl text-sm font-medium text-ink-950 bg-neon-grad shadow-glow hover:brightness-110 transition"
            >
              Join Now
            </Link>
          </div>

          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden grid place-items-center h-10 w-10 rounded-xl glass"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-3 grid gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                onClick={() => setOpen(false)}
                href={l.href}
                className="px-3 py-3 rounded-lg text-white/80 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-center px-4 py-2 rounded-xl text-sm glass"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="text-center px-4 py-2 rounded-xl text-sm font-medium text-ink-950 bg-neon-grad shadow-glow"
              >
                Join Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
