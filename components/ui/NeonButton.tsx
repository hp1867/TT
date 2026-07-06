'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'outline';

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
};

type AsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = CommonProps & { href: string };

export default function NeonButton(props: AsButton | AsLink) {
  const { children, variant = 'primary', className, icon } = props;

  const base =
    'relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 select-none';

  const styles: Record<Variant, string> = {
    primary:
      'bg-neon-grad text-ink-950 shadow-glow hover:brightness-110 active:scale-[0.98]',
    ghost:
      'glass text-white/90 hover:bg-white/10 hover:shadow-glow',
    outline:
      'neon-border bg-transparent text-white hover:bg-white/5',
  };

  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={cn(base, styles[variant], className)}>
        {content}
      </Link>
    );
  }
  const { href: _omit, ...rest } = props as AsButton;
  return (
    <button {...rest} className={cn(base, styles[variant], className)}>
      {content}
    </button>
  );
}
