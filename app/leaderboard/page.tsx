'use client';

import { useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import { players as playersSeed, type Player } from '@/lib/data';
import { useCollection } from '@/lib/useData';
import { Crown, Medal, Search, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const ranges = ['Daily', 'Weekly', 'Monthly', 'All Time'] as const;
type Range = (typeof ranges)[number];

export default function LeaderboardPage() {
  const players = useCollection<Player>('/api/members', playersSeed);
  const [range, setRange] = useState<Range>('All Time');
  const [q, setQ] = useState('');

  const sorted = [...players].sort((a, b) => b.points - a.points);
  const filtered = sorted.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()),
  );

  const podium = sorted.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <div className="container-px pt-28">
      <SectionHeading
        eyebrow="Global rankings"
        title={
          <>
            The <span className="text-neon">leaderboard</span>
          </>
        }
        description="Top players across the club. Filter by time range or search by name."
      />

      <div className="mt-8 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="inline-flex glass rounded-xl p-1 self-start">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'px-4 py-2 text-sm rounded-lg transition',
                range === r
                  ? 'bg-neon-grad text-ink-950 font-semibold shadow-glow'
                  : 'text-white/70 hover:text-white',
              )}
            >
              {r}
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

      {/* Podium */}
      <div className="mt-10 grid md:grid-cols-3 gap-4">
        {podium.map((p, i) => (
          <Podium key={p.id} player={p} rank={i + 1} />
        ))}
      </div>

      {/* Table */}
      <GlassCard className="mt-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 text-xs uppercase tracking-wider">
                <th className="py-3 px-3 font-normal">#</th>
                <th className="py-3 px-3 font-normal">Player</th>
                <th className="py-3 px-3 font-normal">Style</th>
                <th className="py-3 px-3 font-normal">Level</th>
                <th className="py-3 px-3 font-normal">Matches</th>
                <th className="py-3 px-3 font-normal text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((p) => (
                <tr key={p.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 px-3 text-white/60 font-display">#{p.rank}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} className="h-8 w-8 rounded-full object-cover" alt="" />
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-white/40">@{p.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-white/70">{p.style}</td>
                  <td className="py-3 px-3 text-white/70">{p.level}</td>
                  <td className="py-3 px-3 text-white/70">{p.wins + p.losses}</td>
                  <td className="py-3 px-3 text-right font-display text-neon-cyan">
                    {p.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

function Podium({
  player,
  rank,
}: {
  player: Player;
  rank: number;
}) {
  const styles =
    rank === 1
      ? 'from-neon-cyan/40 via-neon-blue/30 to-neon-violet/40'
      : rank === 2
        ? 'from-white/30 via-white/10 to-white/5'
        : 'from-amber-500/30 via-amber-300/10 to-transparent';

  return (
    <div
      className={cn(
        'relative rounded-2xl p-[1px] bg-gradient-to-br',
        styles,
      )}
    >
      <div className="rounded-[15px] bg-ink-900/95 p-6 text-center">
        <div className="flex justify-center">
          <div
            className={cn(
              'h-10 w-10 grid place-items-center rounded-xl glass',
              rank === 1 && 'text-neon-cyan shadow-glow',
            )}
          >
            {rank === 1 ? <Crown size={18} /> : <Medal size={18} />}
          </div>
        </div>
        <div
          className={cn(
            'mt-2 text-[10px] uppercase tracking-[0.22em]',
            rank === 1 ? 'text-neon-cyan' : 'text-white/50',
          )}
        >
          Rank #{rank}
        </div>
        <img
          src={player.avatar}
          className="mt-4 mx-auto h-24 w-24 rounded-2xl object-cover ring-2 ring-white/10"
          alt=""
        />
        <div className="mt-3 font-display text-lg font-semibold">
          {player.name}
        </div>
        <div className="text-xs text-white/50">@{player.username}</div>
        <div className="mt-4 flex items-center justify-center gap-1 text-neon-cyan font-display text-2xl">
          <Trophy size={16} />
          {player.points}
        </div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
          Total points
        </div>
      </div>
    </div>
  );
}
