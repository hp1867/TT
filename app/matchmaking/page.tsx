'use client';

import { useState, useMemo } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { players, Player } from '@/lib/data';
import { cn } from '@/lib/utils';
import { LockKeyhole, MessageCircle, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Professional'] as const;
type Level = (typeof levels)[number];

export default function MatchmakingPage() {
  const [level, setLevel] = useState<Level>('All');
  const [q, setQ] = useState('');
  const [locked, setLocked] = useState<Record<string, 'pending' | 'locked' | undefined>>({});

  const filtered = useMemo(() => {
    return players.filter(
      (p) =>
        (level === 'All' || p.level === level) &&
        p.name.toLowerCase().includes(q.toLowerCase()),
    );
  }, [level, q]);

  const handleLock = (id: string) => {
    setLocked((s) => ({ ...s, [id]: s[id] === 'locked' ? undefined : 'locked' }));
  };

  return (
    <div className="container-px pt-28">
      <SectionHeading
        eyebrow="Matchmaking"
        title={
          <>
            Find your next <span className="text-neon">match</span>
          </>
        }
        description="Filter by skill, check availability, lock a match. Both players must accept for it to count."
      />

      <div className="mt-8 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="inline-flex glass rounded-xl p-1 overflow-auto no-scrollbar">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={cn(
                'px-4 py-2 text-sm rounded-lg whitespace-nowrap transition',
                level === l
                  ? 'bg-neon-grad text-ink-950 font-semibold shadow-glow'
                  : 'text-white/70 hover:text-white',
              )}
            >
              {l}
            </button>
          ))}
        </div>
        <label className="relative glass rounded-xl h-11 flex items-center pl-3 pr-1 max-w-xs w-full">
          <Search size={16} className="text-white/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search player"
            className="flex-1 bg-transparent border-0 outline-none px-3 text-sm"
          />
        </label>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-3">
          {filtered.map((p) => (
            <PlayerRow
              key={p.id}
              player={p}
              status={locked[p.id]}
              onLock={() => handleLock(p.id)}
            />
          ))}
        </div>
        <GlassCard className="h-fit">
          <div className="flex items-center gap-2 text-neon-cyan">
            <Sparkles size={16} />
            <span className="text-xs uppercase tracking-[0.2em]">AI Suggestions</span>
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold">
            Closest in skill
          </h3>
          <p className="text-sm text-white/55">
            Players within ±25 points of your rank with availability tonight.
          </p>
          <div className="mt-4 grid gap-2">
            {players.slice(1, 4).map((p) => (
              <div
                key={p.id}
                className="glass rounded-xl p-3 flex items-center gap-3"
              >
                <img src={p.avatar} className="h-9 w-9 rounded-full" alt="" />
                <div className="flex-1 text-sm">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-white/45">
                    {p.points} pts • {p.available}
                  </div>
                </div>
                <button
                  onClick={() => handleLock(p.id)}
                  className="text-[10px] uppercase tracking-[0.18em] px-2.5 py-1.5 rounded-lg bg-neon-grad text-ink-950 font-semibold"
                >
                  Lock
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function PlayerRow({
  player,
  status,
  onLock,
}: {
  player: Player;
  status?: 'pending' | 'locked';
  onLock: () => void;
}) {
  return (
    <GlassCard className="hover:shadow-glow transition">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={player.avatar}
            className="h-14 w-14 rounded-xl object-cover ring-2 ring-white/10"
            alt=""
          />
          {player.online && (
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-neon-cyan ring-2 ring-ink-900" />
          )}
        </div>
        <div className="flex-1">
          <div className="font-display font-semibold">{player.name}</div>
          <div className="text-xs text-white/45">
            {player.level} • {player.style} • {player.points} pts
          </div>
          <div className="text-[11px] text-white/40 mt-1">
            Available: {player.available}
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onLock}
          className={cn(
            'flex-1 h-10 rounded-xl text-sm font-medium transition inline-flex items-center justify-center gap-2',
            status === 'locked'
              ? 'bg-neon-grad text-ink-950 shadow-glow'
              : 'glass hover:bg-white/10',
          )}
        >
          <LockKeyhole size={14} />
          {status === 'locked' ? 'Match Locked' : 'Lock Match'}
        </button>
        <Link
          href="/messages"
          className="h-10 px-3 rounded-xl glass grid place-items-center text-white/70 hover:text-white"
          aria-label="Message"
        >
          <MessageCircle size={16} />
        </Link>
      </div>
    </GlassCard>
  );
}
