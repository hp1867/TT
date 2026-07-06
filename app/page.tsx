import Link from 'next/link';
import HeroScene from '@/components/three/HeroSceneLazy';
import NeonButton from '@/components/ui/NeonButton';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import StatTile from '@/components/ui/StatTile';
import {
  ArrowRight,
  Compass,
  Sparkles,
  Trophy,
  Users,
  Swords,
  CalendarClock,
  ShoppingBag,
  Coffee,
  Bot,
} from 'lucide-react';
import { readStore } from '@/lib/store';
import PlayerCard from '@/components/PlayerCard';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const store = readStore();
  const site = store.site;
  const players = store.members;
  const events = store.events;
  const topPlayers = [...players].sort((a, b) => b.points - a.points).slice(0, 5);
  const topPlayer = topPlayers[0];

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center pt-24">
        <div className="absolute inset-0 -z-10">
          <HeroScene />
        </div>

        <div className="container-px relative grid lg:grid-cols-12 gap-10 items-center w-full pb-24">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] tracking-[0.2em] uppercase text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulseGlow" />
              Premium 3D club experience
            </span>
            <h1 className="mt-5 font-display font-bold leading-[0.95] tracking-tight text-5xl sm:text-6xl md:text-7xl">
              {site.heroLine1}
              <br />
              <span className="text-neon">{site.heroLine2}</span>
            </h1>
            <p className="mt-5 max-w-xl text-white/70 text-lg">
              {site.heroSubtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <NeonButton href="/signup" icon={<Sparkles size={16} />}>
                Join Now
              </NeonButton>
              <NeonButton
                href="/about"
                variant="ghost"
                icon={<Compass size={16} />}
              >
                Explore Club
              </NeonButton>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-white/60">
              <div className="flex -space-x-2">
                {players.slice(0, 4).map((p) => (
                  <img
                    key={p.id}
                    src={p.avatar}
                    alt=""
                    className="h-9 w-9 rounded-full ring-2 ring-ink-950 object-cover"
                  />
                ))}
              </div>
              <span>
                <span className="text-white font-semibold">
                  {site.activeMembers}+
                </span>{' '}
                active members ranked this season
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block" />
        </div>
      </section>

      {/* STATS */}
      <section className="container-px mt-4 md:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Active Members"
          value={site.activeMembers}
          delta="+12% this month"
          icon={<Users size={18} />}
        />
        <StatTile
          label="Matches Played"
          value={site.matchesPlayed}
          delta="+416 this week"
          icon={<Swords size={18} />}
        />
        <StatTile
          label="Upcoming Events"
          value={String(events.length)}
          delta="Tue–Fri 7 PM"
          icon={<CalendarClock size={18} />}
        />
        <StatTile
          label="Top Player Points"
          value={topPlayer ? String(topPlayer.points) : '—'}
          delta={topPlayer?.name ?? ''}
          icon={<Trophy size={18} />}
        />
      </section>

      {/* QUICK ACCESS GRID */}
      <section className="container-px mt-24">
        <SectionHeading
          eyebrow="Everything you need"
          title={
            <>
              Your club, your <span className="text-neon">hub</span>.
            </>
          }
          description="Dashboards, matchmaking, the shop, cafe ordering and the AI assistant — all from one home."
        />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickTile
            icon={<Trophy size={20} />}
            title="Leaderboard"
            href="/leaderboard"
            desc="See where you stand. Daily, weekly, monthly, all-time."
          />
          <QuickTile
            icon={<CalendarClock size={20} />}
            title="Social Nights"
            href="/social-nights"
            desc="Tuesday → Friday, 7 PM – 9 PM. RSVP in one tap."
          />
          <QuickTile
            icon={<ShoppingBag size={20} />}
            title="Pro Shop"
            href="/shop"
            desc="Rackets, rubbers, balls, shoes — premium gear."
          />
          <QuickTile
            icon={<Coffee size={20} />}
            title="Cafe"
            href="/cafe"
            desc="Coffee, smoothies, burgers — order from your phone."
          />
        </div>
      </section>

      {/* LEADERBOARD PREVIEW */}
      <section className="container-px mt-28">
        <SectionHeading
          eyebrow="Top of the table"
          title={
            <>
              This week's <span className="text-neon">champions</span>
            </>
          }
          description="The five players setting the pace right now."
          action={
            <NeonButton href="/leaderboard" variant="ghost" icon={<ArrowRight size={16} />}>
              Full leaderboard
            </NeonButton>
          }
        />
        <div className="mt-10 grid lg:grid-cols-5 md:grid-cols-2 gap-4">
          {topPlayers.map((p, i) => (
            <PlayerCard key={p.id} player={p} highlight={i === 0} />
          ))}
        </div>
      </section>

      {/* SOCIAL NIGHTS PREVIEW */}
      <section className="container-px mt-28">
        <SectionHeading
          eyebrow="Social nights"
          title={
            <>
              Meet, play, <span className="text-neon">connect</span>.
            </>
          }
          description="Four nights a week, two hours of high-energy play and easy hangs."
          action={
            <NeonButton href="/social-nights" variant="ghost" icon={<ArrowRight size={16} />}>
              See schedule
            </NeonButton>
          }
        />
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.map((e) => (
            <GlassCard key={e.id} className="hover:shadow-glow transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.2em] text-neon-cyan">
                  {e.day}
                </span>
                <span className="text-xs text-white/50">
                  {e.rsvp}/{e.capacity}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-display font-semibold">{e.title}</h3>
              <p className="mt-1 text-sm text-white/60">{e.time}</p>
              <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neon-grad"
                  style={{ width: `${(e.rsvp / e.capacity) * 100}%` }}
                />
              </div>
              <Link
                href="/social-nights"
                className="mt-4 inline-flex items-center gap-2 text-sm text-neon-cyan"
              >
                RSVP <ArrowRight size={14} />
              </Link>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* AI ASSISTANT TEASER */}
      <section className="container-px mt-32">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-8 md:p-14">
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-neon-cyan/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-neon-violet/20 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] tracking-[0.2em] uppercase text-white/70">
                <Bot size={12} className="text-neon-cyan" />
                Sportsx AI
              </span>
              <h2 className="mt-4 font-display font-bold text-3xl md:text-5xl tracking-tight">
                Ask anything.
                <br />
                <span className="text-neon">Get an answer.</span>
              </h2>
              <p className="mt-4 text-white/65 max-w-lg">
                Powered by a layered intelligence — FAQ first, club knowledge
                base next, external AI as the deep fallback. Available on
                every page from the floating button.
              </p>
              <div className="mt-6 flex gap-3">
                <NeonButton href="/contact" icon={<Sparkles size={16} />}>
                  Try the assistant
                </NeonButton>
              </div>
            </div>
            <div>
              <div className="glass rounded-2xl p-5">
                <div className="text-xs text-white/50">You</div>
                <div className="mt-1 text-white/90">When are social nights?</div>
                <div className="mt-4 text-xs text-neon-cyan">Sportsx AI</div>
                <div className="mt-1 text-white/90 text-sm leading-relaxed">
                  Social nights run Tuesday to Friday, 7 PM – 9 PM. Tap the
                  Social Nights page to RSVP for any of them.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function QuickTile({
  icon,
  title,
  href,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-2xl glass p-5 overflow-hidden hover:shadow-glow transition"
    >
      <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-neon-blue/10 blur-2xl opacity-60 group-hover:opacity-100 transition" />
      <div className="h-10 w-10 rounded-xl grid place-items-center glass text-neon-cyan">
        {icon}
      </div>
      <h3 className="mt-4 font-display font-semibold text-lg">{title}</h3>
      <p className="mt-1 text-sm text-white/55">{desc}</p>
      <div className="mt-4 inline-flex items-center gap-2 text-xs text-neon-cyan">
        Open <ArrowRight size={12} />
      </div>
    </Link>
  );
}
