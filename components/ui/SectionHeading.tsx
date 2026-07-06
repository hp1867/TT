import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex items-end gap-6',
        align === 'center'
          ? 'flex-col text-center items-center'
          : 'flex-col sm:flex-row sm:items-end justify-between',
        className,
      )}
    >
      <div className={align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-neon-cyan/90 px-3 py-1 rounded-full glass">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulseGlow" />
            {eyebrow}
          </div>
        )}
        <h2 className="mt-3 font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-white/60 max-w-xl">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
