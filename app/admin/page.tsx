'use client';

import { useEffect, useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import StatTile from '@/components/ui/StatTile';
import EntityManager from '@/components/admin/EntityManager';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';
import { getToken, clearToken, login } from '@/lib/adminClient';
import { cn } from '@/lib/utils';
import {
  Coffee,
  DollarSign,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  Users,
  Lock,
} from 'lucide-react';

const tabs = ['Overview', 'Site', 'Members', 'Products', 'Cafe', 'Events'] as const;
type Tab = (typeof tabs)[number];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>('Overview');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setAuthed(!!getToken());
    setReady(true);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    const ok = await login(password);
    if (ok) {
      setAuthed(true);
    } else {
      setError(true);
    }
  };

  if (!ready) return null;

  if (!authed) {
    return (
      <div className="container-px pt-32 pb-24">
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] tracking-[0.2em] uppercase text-white/70">
              <Lock size={12} className="text-neon-cyan" /> Control Panel
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">
              Admin <span className="text-neon">access</span>
            </h1>
            <p className="mt-2 text-white/55 text-sm">
              Enter the admin password to manage the site.
            </p>
          </div>
          <form
            onSubmit={submit}
            className="mt-8 glass-strong rounded-3xl p-7 space-y-4"
          >
            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-white/50">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                className="mt-2 w-full h-12 px-4 rounded-xl bg-ink-800/80 border border-white/10 focus:border-neon-cyan/60 outline-none transition"
              />
              {error && (
                <p className="mt-2 text-xs text-rose-400">
                  Incorrect password. Try again.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-neon-grad text-ink-950 font-semibold shadow-glow"
            >
              Unlock
            </button>
            <p className="text-center text-[11px] text-white/35">
              Default password: <span className="text-white/60">sportsx2026</span>{' '}
              — change it by adding ADMIN_PASSWORD to .env.local
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container-px pt-28">
      <SectionHeading
        eyebrow="Admin"
        title={
          <>
            Club <span className="text-neon">control room</span>
          </>
        }
        description="Add, edit and delete content. Everything you change here updates the live website."
        action={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl glass text-xs">
              <ShieldCheck size={14} className="text-neon-cyan" /> Super Admin
            </span>
            <button
              onClick={() => {
                clearToken();
                setAuthed(false);
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl glass text-xs hover:text-rose-400"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        }
      />

      <div className="mt-8 inline-flex glass rounded-xl p-1 overflow-auto no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 text-sm rounded-lg whitespace-nowrap transition',
              tab === t
                ? 'bg-neon-grad text-ink-950 font-semibold shadow-glow'
                : 'text-white/70 hover:text-white',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'Overview' && <Overview />}
        {tab === 'Site' && <SiteSettingsForm />}
        {tab === 'Members' && (
          <EntityManager
            title="Members"
            endpoint="/api/members"
            columns={[
              { name: 'name', label: 'Name' },
              { name: 'level', label: 'Level' },
              { name: 'style', label: 'Style' },
              { name: 'points', label: 'Points' },
              { name: 'rank', label: 'Rank' },
            ]}
            fields={[
              { name: 'name', label: 'Full name' },
              { name: 'username', label: 'Username' },
              { name: 'avatar', label: 'Avatar URL', type: 'image' },
              { name: 'points', label: 'Points', type: 'number' },
              { name: 'rank', label: 'Rank', type: 'number' },
              { name: 'wins', label: 'Wins', type: 'number' },
              { name: 'losses', label: 'Losses', type: 'number' },
              {
                name: 'level',
                label: 'Level',
                type: 'select',
                options: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
              },
              {
                name: 'style',
                label: 'Style',
                type: 'select',
                options: ['Attacker', 'Defender', 'All-rounder', 'Spinner'],
              },
              { name: 'available', label: 'Availability' },
              { name: 'joined', label: 'Join date', placeholder: '2024-01-01' },
            ]}
          />
        )}
        {tab === 'Products' && (
          <EntityManager
            title="Products"
            endpoint="/api/products"
            columns={[
              { name: 'name', label: 'Product' },
              { name: 'category', label: 'Category' },
              { name: 'price', label: 'Price' },
              { name: 'rating', label: 'Rating' },
            ]}
            fields={[
              { name: 'name', label: 'Name' },
              { name: 'price', label: 'Price (AUD)', type: 'number', step: '0.01' },
              {
                name: 'category',
                label: 'Category',
                type: 'select',
                options: [
                  'Rackets',
                  'Rubbers',
                  'Balls',
                  'Tables',
                  'Nets',
                  'Shoes',
                  'Clothing',
                  'Accessories',
                ],
              },
              { name: 'image', label: 'Image URL', type: 'image' },
              { name: 'rating', label: 'Rating (0-5)', type: 'number', step: '0.1' },
              { name: 'reviews', label: 'Reviews', type: 'number' },
              { name: 'badge', label: 'Badge (optional)', placeholder: 'New' },
            ]}
          />
        )}
        {tab === 'Cafe' && (
          <EntityManager
            title="Cafe items"
            endpoint="/api/cafe"
            columns={[
              { name: 'name', label: 'Item' },
              { name: 'category', label: 'Category' },
              { name: 'price', label: 'Price' },
            ]}
            fields={[
              { name: 'name', label: 'Name' },
              { name: 'price', label: 'Price (AUD)', type: 'number', step: '0.01' },
              {
                name: 'category',
                label: 'Category',
                type: 'select',
                options: [
                  'Coffee',
                  'Tea',
                  'Cold Drinks',
                  'Smoothies',
                  'Burgers',
                  'Sandwiches',
                  'Snacks',
                  'Desserts',
                ],
              },
              { name: 'image', label: 'Image URL', type: 'image' },
            ]}
          />
        )}
        {tab === 'Events' && (
          <EntityManager
            title="Social night events"
            endpoint="/api/events"
            columns={[
              { name: 'day', label: 'Day' },
              { name: 'title', label: 'Title' },
              { name: 'time', label: 'Time' },
              { name: 'rsvp', label: 'RSVP' },
            ]}
            fields={[
              {
                name: 'day',
                label: 'Day',
                type: 'select',
                options: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              },
              { name: 'title', label: 'Title' },
              { name: 'time', label: 'Time', placeholder: '7:00 PM – 9:00 PM' },
              { name: 'rsvp', label: 'RSVP count', type: 'number' },
              { name: 'capacity', label: 'Capacity', type: 'number' },
            ]}
          />
        )}
      </div>
    </div>
  );
}

function Overview() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Revenue (mo)" value="$84,210" delta="+18%" icon={<DollarSign size={18} />} />
        <StatTile label="New Members" value="142" delta="+22 this week" icon={<Users size={18} />} />
        <StatTile label="Shop Orders" value="438" delta="$26.4k" icon={<ShoppingBag size={18} />} />
        <StatTile label="Cafe Orders" value="1,204" delta="$11.8k" icon={<Coffee size={18} />} />
      </div>
      <div className="rounded-2xl glass p-6">
        <h3 className="font-display text-lg font-semibold">Welcome to the control room</h3>
        <p className="mt-2 text-sm text-white/60 max-w-2xl">
          Use the tabs above to manage your site. <strong>Site</strong> edits the
          club name, hero text and contact details. <strong>Members</strong>,{' '}
          <strong>Products</strong>, <strong>Cafe</strong> and{' '}
          <strong>Events</strong> let you add, edit and delete items that appear on
          the leaderboard, shop, cafe and social-nights pages. Changes are saved to
          the server and show on the live site after a refresh.
        </p>
      </div>
    </div>
  );
}
