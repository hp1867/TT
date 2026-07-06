import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import StatTile from '@/components/ui/StatTile';
import PlayerCard from '@/components/PlayerCard';
import NeonButton from '@/components/ui/NeonButton';
import { matchHistory, players } from '@/lib/data';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  LockKeyhole,
  Settings,
  Swords,
  Trophy,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
  const me = players[1]; // demo: "Hard Patel"

  return (
    <div className="container-px pt-28">
      <SectionHeading
        eyebrow="Your dashboard"
        title={
          <>
            Welcome back, <span className="text-neon">{me.name.split(' ')[0]}</span>
          </>
        }
        description="Your card, your matches, your upcoming locks — all in one place."
        action={
          <div className="flex gap-2">
            <NeonButton href="#" variant="ghost" icon={<Edit3 size={14} />}>
              Edit profile
            </NeonButton>
            <NeonButton href="/admin" variant="outline" icon={<Settings size={14} />}>
              Settings
            </NeonButton>
          </div>
        }
      />

      <div className="mt-10 grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <PlayerCard player={me} highlight />
          <GlassCard className="mt-4">
            <div className="text-xs uppercase tracking-[0.18em] text-white/40">
              Member ID
            </div>
            <div className="font-display text-2xl font-semibold mt-1">
              VTT-{me.id.toUpperCase()}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <Info label="Joined" value={me.joined} />
              <Info label="Level" value={me.level} />
              <Info label="Style" value={me.style} />
              <Info label="Status" value="Active" />
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-8 grid gap-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatTile label="Total Points" value={me.points} icon={<Trophy size={18} />} />
            <StatTile label="Wins" value={me.wins} icon={<CheckCircle2 size={18} />} />
            <StatTile label="Losses" value={me.losses} icon={<Swords size={18} />} />
            <StatTile
              label="Win %"
              value={`${Math.round((me.wins / (me.wins + me.losses)) * 100)}%`}
              icon={<Users size={18} />}
            />
          </div>

          <GlassCard>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">
                Match history
              </h3>
              <span className="text-xs text-white/40">Last 30 days</span>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/40 text-xs uppercase tracking-wider">
                    <th className="py-2 pr-3 font-normal">Date</th>
                    <th className="py-2 pr-3 font-normal">Opponent</th>
                    <th className="py-2 pr-3 font-normal">Court</th>
                    <th className="py-2 pr-3 font-normal">Score</th>
                    <th className="py-2 pr-3 font-normal">Result</th>
                    <th className="py-2 pr-3 font-normal">Status</th>
                    <th className="py-2 pr-3 font-normal">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {matchHistory.map((m) => (
                    <tr key={m.id} className="border-t border-white/5">
                      <td className="py-3 pr-3 text-white/70">{m.date}</td>
                      <td className="py-3 pr-3">{m.opponent}</td>
                      <td className="py-3 pr-3 text-white/60">{m.court}</td>
                      <td className="py-3 pr-3 font-display">{m.score}</td>
                      <td
                        className={`py-3 pr-3 font-medium ${
                          m.result === 'WIN' ? 'text-neon-cyan' : 'text-white/50'
                        }`}
                      >
                        {m.result}
                      </td>
                      <td className="py-3 pr-3">
                        {m.confirmed ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle2 size={12} /> Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-3 text-white">
                        {m.confirmed ? `+${m.points}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">
                  Locked matches
                </h3>
                <span className="inline-flex items-center gap-1 text-xs text-neon-cyan">
                  <LockKeyhole size={12} /> 2 locked
                </span>
              </div>
              <div className="mt-3 grid gap-3">
                <LockedMatch
                  opponent="Aarav Kumar"
                  date="2026-06-04"
                  time="7:30 PM"
                  court="Court 1"
                />
                <LockedMatch
                  opponent="Liam OConnor"
                  date="2026-06-07"
                  time="8:15 PM"
                  court="Court 3"
                />
              </div>
              <NeonButton href="/matchmaking" variant="ghost" className="mt-4 w-full">
                Lock a new match
              </NeonButton>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">
                  Upcoming events
                </h3>
                <Calendar size={16} className="text-neon-cyan" />
              </div>
              <ul className="mt-3 grid gap-3 text-sm">
                <li className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <div className="font-medium">Tuesday — Open Play</div>
                    <div className="text-white/50 text-xs">7 PM – 9 PM</div>
                  </div>
                  <span className="text-xs text-neon-cyan">RSVPed</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <div className="font-medium">Wednesday — Skills Clinic</div>
                    <div className="text-white/50 text-xs">7 PM – 9 PM</div>
                  </div>
                  <span className="text-xs text-white/40">Not RSVPed</span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Friday — Tournament Night</div>
                    <div className="text-white/50 text-xs">7 PM – 9 PM</div>
                  </div>
                  <span className="text-xs text-neon-cyan">RSVPed</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl glass p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
        {label}
      </div>
      <div className="mt-0.5 text-sm text-white/90 font-medium">{value}</div>
    </div>
  );
}

function LockedMatch({
  opponent,
  date,
  time,
  court,
}: {
  opponent: string;
  date: string;
  time: string;
  court: string;
}) {
  return (
    <div className="rounded-xl glass p-3 flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">{opponent}</div>
        <div className="text-xs text-white/50">
          {date} • {time} • {court}
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full bg-neon-grad text-ink-950 font-semibold">
        Locked
      </span>
    </div>
  );
}
