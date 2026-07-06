import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import SectionHeading from '@/components/ui/SectionHeading';
import { Award, Users, Sparkles, History } from 'lucide-react';

const timeline = [
  {
    year: '2018',
    title: 'Sportsx is founded',
    desc: '12 friends. Two tables. One shared obsession with the perfect topspin.',
  },
  {
    year: '2020',
    title: 'First state-level final',
    desc: 'Three Sportsx players reach finals at the NSW Open. The club rebrands.',
  },
  {
    year: '2022',
    title: 'New 12-table arena',
    desc: 'We move into a purpose-built facility in Sydney with full cafe, pro shop, and broadcast court.',
  },
  {
    year: '2024',
    title: 'Sportsx AI launches',
    desc: 'The first table tennis club AI matchmaker. Members get personalized opponents in real time.',
  },
  {
    year: '2026',
    title: 'Sportsx Hub goes premium',
    desc: 'Full re-launch — 3D club platform, social nights every weekday, club + cafe + shop all under one roof.',
  },
];

export default function AboutPage() {
  return (
    <div className="container-px pt-28">
      <SectionHeading
        eyebrow="Our story"
        title={
          <>
            Built by players, <span className="text-neon">for players</span>
          </>
        }
        description="Sportsx Table Tennis Hub is more than a club. It's a community."
      />

      <div className="mt-10 grid lg:grid-cols-3 gap-4">
        <GlassCard>
          <div className="h-10 w-10 grid place-items-center rounded-xl glass text-neon-cyan">
            <Users size={18} />
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold">Community</h3>
          <p className="mt-2 text-sm text-white/60">
            1,284 ranked members. Tuesday → Friday social nights packed every
            week. The most welcoming room in Sydney TT.
          </p>
        </GlassCard>
        <GlassCard>
          <div className="h-10 w-10 grid place-items-center rounded-xl glass text-neon-cyan">
            <Award size={18} />
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold">Achievements</h3>
          <p className="mt-2 text-sm text-white/60">
            5× state finalists, 12 nationally-ranked juniors, 1 ITTF certified
            coach on staff full-time.
          </p>
        </GlassCard>
        <GlassCard>
          <div className="h-10 w-10 grid place-items-center rounded-xl glass text-neon-cyan">
            <Sparkles size={18} />
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold">Vision</h3>
          <p className="mt-2 text-sm text-white/60">
            To become Australia's most premium, most fun, most welcoming
            table-tennis-first community.
          </p>
        </GlassCard>
      </div>

      <div className="mt-20">
        <SectionHeading
          eyebrow="Milestones"
          title={
            <>
              The Sportsx <span className="text-neon">timeline</span>
            </>
          }
        />
        <div className="mt-10 relative">
          <div className="absolute left-3 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan/0 via-neon-cyan/40 to-neon-violet/0" />
          <ul className="space-y-10">
            {timeline.map((t, idx) => (
              <li
                key={t.year}
                className={`relative grid md:grid-cols-2 gap-6 ${
                  idx % 2 === 0 ? '' : 'md:[direction:rtl]'
                }`}
              >
                <div className="md:[direction:ltr] relative pl-10 md:pl-0">
                  <span className="absolute left-0 top-1 md:left-1/2 md:-translate-x-1/2 grid place-items-center h-6 w-6 rounded-full bg-neon-grad shadow-glow text-ink-950 font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <GlassCard className="ml-2 md:ml-0 md:mr-8 md:[direction:ltr] hover:shadow-glow transition">
                    <div className="text-xs uppercase tracking-[0.22em] text-neon-cyan">
                      {t.year}
                    </div>
                    <h4 className="mt-2 font-display text-xl font-semibold">
                      {t.title}
                    </h4>
                    <p className="mt-1 text-sm text-white/60">{t.desc}</p>
                  </GlassCard>
                </div>
                <div className="hidden md:block" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-24 relative overflow-hidden rounded-3xl glass-strong p-10 text-center">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-neon-cyan/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-neon-violet/15 blur-3xl" />
        <History className="mx-auto text-neon-cyan" size={28} />
        <h2 className="mt-4 font-display text-4xl font-bold">
          Become part of the <span className="text-neon">next chapter</span>
        </h2>
        <p className="mt-3 text-white/60 max-w-xl mx-auto">
          Memberships start at $39/month and include unlimited play.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <NeonButton href="/signup">Join Sportsx</NeonButton>
          <NeonButton href="/contact" variant="ghost">
            Contact us
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
