'use client';

import dynamic from 'next/dynamic';

const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-24 w-24 rounded-full border-2 border-neon-cyan/30 border-t-neon-cyan animate-spin" />
    </div>
  ),
});

export default HeroScene;
