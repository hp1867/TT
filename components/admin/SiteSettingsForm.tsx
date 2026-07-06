'use client';

import { useEffect, useState } from 'react';
import { Save, Check, Loader2 } from 'lucide-react';
import { apiGet, apiUpdate } from '@/lib/adminClient';

type Site = Record<string, string>;

const fields: { name: string; label: string; area?: boolean }[] = [
  { name: 'clubName', label: 'Club name' },
  { name: 'email', label: 'Contact email' },
  { name: 'phone', label: 'Phone' },
  { name: 'address', label: 'Address' },
  { name: 'heroLine1', label: 'Hero headline (line 1)' },
  { name: 'heroLine2', label: 'Hero headline (line 2)' },
  { name: 'activeMembers', label: 'Active members (stat)' },
  { name: 'matchesPlayed', label: 'Matches played (stat)' },
  { name: 'heroSubtitle', label: 'Hero subtitle', area: true },
];

export default function SiteSettingsForm() {
  const [site, setSite] = useState<Site>({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet<Site>('/api/site')
      .then(setSite)
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await apiUpdate('/api/site', site);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="rounded-2xl glass p-10 grid place-items-center text-white/50">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="rounded-2xl glass p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Site settings</h3>
        <span className="text-xs text-white/40">
          Changes show on the live site after refresh
        </span>
      </div>
      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.name} className={f.area ? 'sm:col-span-2' : ''}>
            <label className="text-xs uppercase tracking-[0.16em] text-white/50">
              {f.label}
            </label>
            {f.area ? (
              <textarea
                rows={3}
                value={site[f.name] ?? ''}
                onChange={(e) => setSite({ ...site, [f.name]: e.target.value })}
                className="mt-2 w-full p-3 rounded-xl bg-ink-800 border border-white/10 focus:border-neon-cyan/60 outline-none text-sm"
              />
            ) : (
              <input
                value={site[f.name] ?? ''}
                onChange={(e) => setSite({ ...site, [f.name]: e.target.value })}
                className="mt-2 w-full h-11 px-3 rounded-xl bg-ink-800 border border-white/10 focus:border-neon-cyan/60 outline-none text-sm"
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-grad text-ink-950 text-sm font-semibold shadow-glow disabled:opacity-60"
        >
          {saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved' : saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
