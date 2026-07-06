'use client';

import { useSite } from '@/lib/useData';

/** Renders the club name from site settings (falls back to "SPORTSX"). */
export default function BrandName({
  className,
  uppercase = true,
}: {
  className?: string;
  uppercase?: boolean;
}) {
  const site = useSite<{ clubName: string }>({ clubName: 'Sportsx' });
  const name = uppercase ? site.clubName.toUpperCase() : site.clubName;
  return <span className={className}>{name}</span>;
}
