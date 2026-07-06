import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export default function GlassCard({
  className,
  children,
  glow = false,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { glow?: boolean }) {
  return (
    <div
      {...rest}
      className={cn(
        'relative rounded-2xl glass p-5 overflow-hidden',
        glow && 'shadow-glow',
        className,
      )}
    >
      {children}
    </div>
  );
}
