import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIAssistant from '@/components/AIAssistant';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'Sportsx Table Tennis Hub — Premium Club Experience',
  description:
    'Sportsx Table Tennis Hub — premium club management, social matchmaking, leaderboard, e-commerce, cafe, AI assistant.',
  keywords: [
    'table tennis',
    'ping pong club',
    'sportsx',
    'leaderboard',
    'social nights',
  ],
  metadataBase: new URL('https://sportsx.com.au'),
  openGraph: {
    title: 'Sportsx Table Tennis Hub',
    description:
      'The premium 3D dark-themed table tennis club platform — by Sportsx.',
    type: 'website',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#04060a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen bg-ink-950 text-white antialiased overflow-x-hidden">
        <div className="relative isolate">
          <div className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-[0.18]" />
          <div className="pointer-events-none fixed inset-0 -z-10 bg-grid-fade" />
          <Navbar />
          <main className="relative">{children}</main>
          <Footer />
          <AIAssistant />
        </div>
      </body>
    </html>
  );
}
