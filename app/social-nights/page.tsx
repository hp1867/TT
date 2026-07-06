'use client';

import { useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import {
  events as eventsSeed,
  players as playersSeed,
  type Player,
} from '@/lib/data';
import { useCollection } from '@/lib/useData';
import { Check, Sparkles, Users, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SocialNightsPage() {
  const events = useCollection<(typeof eventsSeed)[number]>(
    '/api/events',
    eventsSeed,
  );
  const players = useCollection<Player>('/api/members', playersSeed);
  const [rsvped, setRsvped] = useState<Record<string, boolean>>({ e1: true, e4: true });

  return (
    <div className="container-px pt-28">
      <SectionHeading
        eyebrow="Social nights"
        title={
          <>
            Meet, play and <span className="text-neon">connect</span>
          </>
        }
        description="Sportsx social nights are the heartbeat of the club. Show up, play, win, repeat."
      />

      <div className="mt-8 grid lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">This week</h3>
            <span className="text-xs text-white/50">Tue → Fri • 7 PM – 9 PM</span>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {events.map((e) => {
              const isIn = !!rsvped[e.id];
              return (
                <div
                  key={e.id}
                  className={cn(
                    'relative rounded-2xl p-[1px]',
                    isIn ? 'bg-neon-grad shadow-glow' : 'bg-white/10',
                  )}
                >
                  <div className="rounded-[15px] bg-ink-900/95 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.22em] text-neon-cyan">
                        {e.day}
                      </span>
                      <span className="text-xs text-white/40">
                        {e.rsvp}/{e.capacity}
                      </span>
                    </div>
                    <h4 className="mt-2 font-display font-semibold">{e.title}</h4>
                    <p className="text-sm text-white/60">{e.time}</p>
                    <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neon-grad"
                        style={{ width: `${(e.rsvp / e.capacity) * 100}%` }}
                      />
                    </div>
                    <button
                      onClick={() =>
                        setRsvped((s) => ({ ...s, [e.id]: !s[e.id] }))
                      }
                      className={cn(
                        'mt-4 w-full h-10 rounded-xl text-sm font-medium transition',
                        isIn
                          ? 'bg-neon-grad text-ink-950'
                          : 'glass hover:bg-white/10',
                      )}
                    >
                      {isIn ? (
                        <span className="inline-flex items-center gap-2">
                          <Check size={14} /> RSVPed
                        </span>
                      ) : (
                        'RSVP'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 text-neon-cyan">
            <Users size={16} />
            <span className="text-xs uppercase tracking-[0.2em]">Live tonight</span>
          </div>
          <div className="mt-3 font-display text-3xl font-bold">38 / 60</div>
          <div className="text-sm text-white/60">Players currently on the floor</div>

          <div className="mt-5 grid gap-3">
            {players
              .filter((p) => p.online)
              .slice(0, 5)
              .map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.avatar} className="h-9 w-9 rounded-full" alt="" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-white/40">{p.level}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-neon-cyan">
                    Online
                  </span>
                </div>
              ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-10 grid lg:grid-cols-2 gap-4">
        <GlassCard>
          <div className="flex items-center gap-2 text-neon-cyan">
            <Wand2 size={16} />
            <span className="text-xs uppercase tracking-[0.2em]">AI matchmaking</span>
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold">
            Suggested opponents tonight
          </h3>
          <p className="text-sm text-white/55">
            Based on your skill, recent results and tonight's attendance.
          </p>
          <div className="mt-4 grid gap-2">
            {players.slice(2, 5).map((p) => (
              <div
                key={p.id}
                className="glass rounded-xl p-3 flex items-center gap-3"
              >
                <img src={p.avatar} className="h-10 w-10 rounded-full" alt="" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-white/45">
                    {p.level} • {p.points} pts
                  </div>
                </div>
                <NeonButton href="/matchmaking" variant="outline" className="!px-3 !py-2 text-xs">
                  Lock match
                </NeonButton>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 text-neon-cyan">
            <Sparkles size={16} />
            <span className="text-xs uppercase tracking-[0.2em]">
              Upcoming events
            </span>
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold">
            June calendar
          </h3>
          <ul className="mt-4 grid gap-3 text-sm">
            <Calendar item="Tue, 02 Jun — Open Play" sub="7:00 PM – 9:00 PM" />
            <Calendar item="Wed, 03 Jun — Skills Clinic" sub="7:00 PM – 9:00 PM" />
            <Calendar item="Thu, 04 Jun — Doubles Night" sub="7:00 PM – 9:00 PM" />
            <Calendar item="Fri, 05 Jun — Tournament Night" sub="7:00 PM – 9:00 PM" />
            <Calendar item="Tue, 09 Jun — Open Play" sub="7:00 PM – 9:00 PM" />
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

function Calendar({ item, sub }: { item: string; sub: string }) {
  return (
    <li className="flex items-center justify-between border-b border-white/5 pb-3 last:border-none last:pb-0">
      <div>
        <div className="font-medium">{item}</div>
        <div className="text-xs text-white/45">{sub}</div>
      </div>
      <button className="text-xs text-neon-cyan hover:underline">Add</button>
    </li>
  );
}
