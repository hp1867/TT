import { ReactNode } from 'react';
import GlassCard from './GlassCard';

export default function StatTile({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  icon?: ReactNode;
}) {
  return (
    <GlassCard className="group hover:shadow-glow transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-white/40">
            {label}
          </div>
          <div className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">
            {value}
          </div>
          {delta && (
            <div className="mt-1 text-xs text-neon-cyan/90">{delta}</div>
          )}
        </div>
        {icon && (
          <div className="h-10 w-10 rounded-xl grid place-items-center glass text-neon-cyan group-hover:shadow-glow">
            {icon}
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-neon-cyan/10 blur-2xl opacity-60 group-hover:opacity-100 transition" />
    </GlassCard>
  );
}
