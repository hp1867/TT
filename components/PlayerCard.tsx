'use client';

import { Player } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Crown, Star } from 'lucide-react';

export default function PlayerCard({
  player,
  highlight = false,
}: {
  player: Player;
  highlight?: boolean;
}) {
  const winPct =
    player.wins + player.losses === 0
      ? 0
      : Math.round((player.wins / (player.wins + player.losses)) * 100);

  return (
    <div
      className={cn(
        'group relative rounded-2xl p-[1px] overflow-hidden',
        highlight ? 'bg-neon-grad shadow-glow' : 'bg-white/10',
      )}
      style={{ perspective: 800 }}
    >
      <div className="relative h-full rounded-[15px] bg-ink-900/95 p-5">
        {/* Holographic shimmer */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 [background:conic-gradient(from_var(--a,0deg),transparent_0_30%,rgba(0,240,255,0.15)_50%,transparent_70%_100%)] [animation:spin_6s_linear_infinite]" />
        <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-neon-cyan/20 blur-3xl" />

        <div className="relative flex items-start justify-between">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] uppercase tracking-[0.2em]',
              highlight
                ? 'bg-neon-grad text-ink-950 font-semibold'
                : 'glass text-white/70',
            )}
          >
            {highlight && <Crown size={10} />} Rank #{player.rank}
          </span>
          <div className="flex items-center gap-1 text-xs text-white/60">
            <Star size={12} className="text-neon-cyan" /> {player.style}
          </div>
        </div>

        <div className="relative mt-5 flex flex-col items-center">
          <div className="relative">
            <img
              src={player.avatar}
              alt={player.name}
              className="h-24 w-24 rounded-2xl object-cover ring-2 ring-white/10"
            />
            {player.online && (
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-neon-cyan ring-2 ring-ink-900 animate-pulseGlow" />
            )}
          </div>
          <div className="mt-3 text-center">
            <div className="font-display font-semibold">{player.name}</div>
            <div className="text-xs text-white/45">@{player.username}</div>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-2 text-center">
          <Cell label="Points" value={player.points} accent />
          <Cell label="Win %" value={`${winPct}%`} />
          <Cell label="Wins" value={player.wins} />
          <Cell label="Losses" value={player.losses} />
        </div>
      </div>
    </div>
  );
}

function Cell({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl glass py-2">
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
        {label}
      </div>
      <div
        className={cn(
          'mt-1 font-display font-semibold',
          accent ? 'text-neon-cyan text-xl' : 'text-white text-lg',
        )}
      >
        {value}
      </div>
    </div>
  );
}
