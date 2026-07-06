import Link from 'next/link';
import { Github, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import BrandName from '@/components/BrandName';
import { readStore } from '@/lib/store';

export default function Footer() {
  const site = readStore().site;
  return (
    <footer className="relative mt-32 border-t border-white/5 bg-gradient-to-b from-transparent to-black/60">
      <div className="container-px py-16 grid lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-neon-cyan via-neon-blue to-neon-violet grid place-items-center font-black text-ink-950 shadow-glow">
              S
            </div>
            <div className="leading-tight">
              <BrandName className="font-display font-bold tracking-wide block" />
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Table Tennis Hub
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/60 max-w-xs">
            Premium table tennis club, social hub, and online community.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <a
              aria-label="Instagram"
              href="#"
              className="h-9 w-9 grid place-items-center rounded-lg glass hover:shadow-glow transition"
            >
              <Instagram size={16} />
            </a>
            <a
              aria-label="Twitter"
              href="#"
              className="h-9 w-9 grid place-items-center rounded-lg glass hover:shadow-glow transition"
            >
              <Twitter size={16} />
            </a>
            <a
              aria-label="GitHub"
              href="#"
              className="h-9 w-9 grid place-items-center rounded-lg glass hover:shadow-glow transition"
            >
              <Github size={16} />
            </a>
          </div>
        </div>

        <FooterColumn
          title="Club"
          links={[
            { label: 'Leaderboard', href: '/leaderboard' },
            { label: 'Social Nights', href: '/social-nights' },
            { label: 'Matchmaking', href: '/matchmaking' },
            { label: 'Messages', href: '/messages' },
          ]}
        />
        <FooterColumn
          title="Marketplace"
          links={[
            { label: 'Shop', href: '/shop' },
            { label: 'Cafe', href: '/cafe' },
            { label: 'My Orders', href: '/dashboard' },
          ]}
        />
        <div>
          <h4 className="text-sm font-semibold text-white/90">Contact</h4>
          <ul className="mt-4 grid gap-3 text-sm text-white/60">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 text-neon-cyan" />
              {site.address}
            </li>
            <li className="flex items-start gap-2">
              <Phone size={14} className="mt-0.5 text-neon-cyan" />
              {site.phone}
            </li>
            <li className="flex items-start gap-2">
              <Mail size={14} className="mt-0.5 text-neon-cyan" />
              {site.email}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-px py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>
            © {new Date().getFullYear()} {site.clubName} Table Tennis Hub.
          </span>
          <span className="flex gap-4">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Cookies</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white/90">{title}</h4>
      <ul className="mt-4 grid gap-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-white/60 hover:text-neon-cyan transition"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
