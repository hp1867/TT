'use client';

import { useMemo, useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import { cafeItems as cafeSeed, type CafeItem } from '@/lib/data';
import { useCollection } from '@/lib/useData';
import { currency, cn } from '@/lib/utils';
import { Coffee, Plus, ShoppingBag, Minus } from 'lucide-react';

const cats = [
  'All',
  'Coffee',
  'Tea',
  'Cold Drinks',
  'Smoothies',
  'Burgers',
  'Sandwiches',
  'Snacks',
  'Desserts',
] as const;

export default function CafePage() {
  const cafeItems = useCollection<CafeItem>('/api/cafe', cafeSeed);
  const [cat, setCat] = useState<(typeof cats)[number]>('All');
  const [order, setOrder] = useState<Record<string, number>>({});

  const filtered = useMemo(
    () => (cat === 'All' ? cafeItems : cafeItems.filter((i) => i.category === cat)),
    [cat, cafeItems],
  );

  const lines = Object.entries(order)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({
      id,
      qty,
      item: cafeItems.find((i) => i.id === id),
    }))
    .filter((l): l is typeof l & { item: CafeItem } => Boolean(l.item));
  const total = lines.reduce((a, l) => a + l.item.price * l.qty, 0);

  const setQty = (id: string, qty: number) =>
    setOrder((s) => ({ ...s, [id]: Math.max(0, qty) }));

  return (
    <div className="container-px pt-28">
      <SectionHeading
        eyebrow="Sportsx Cafe"
        title={
          <>
            Fuel between <span className="text-neon">games</span>
          </>
        }
        description="Order from your phone, collect at the bar. Coffee, smoothies, burgers and more."
      />

      <div className="mt-8 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="inline-flex glass rounded-xl p-1 overflow-auto no-scrollbar">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                'px-4 py-2 text-sm rounded-lg whitespace-nowrap transition',
                cat === c
                  ? 'bg-neon-grad text-ink-950 font-semibold shadow-glow'
                  : 'text-white/70 hover:text-white',
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm">
          <Coffee size={14} className="text-neon-cyan" /> Opens 8 AM • Closes 9 PM
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-[1fr,360px] gap-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const qty = order[item.id] ?? 0;
            return (
              <GlassCard key={item.id} className="!p-0 overflow-hidden hover:shadow-glow transition">
                <div className="aspect-[5/4] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover hover:scale-105 transition"
                  />
                </div>
                <div className="p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    {item.category}
                  </div>
                  <h3 className="mt-1 font-display font-semibold">{item.name}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="font-display text-lg text-neon-cyan">
                      {currency(item.price)}
                    </div>
                    {qty === 0 ? (
                      <button
                        onClick={() => setQty(item.id, 1)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-neon-grad text-ink-950 text-xs font-semibold shadow-glow"
                      >
                        <Plus size={12} /> Add
                      </button>
                    ) : (
                      <div className="inline-flex items-center glass rounded-lg overflow-hidden">
                        <button onClick={() => setQty(item.id, qty - 1)} className="px-2 py-2">
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-sm">{qty}</span>
                        <button onClick={() => setQty(item.id, qty + 1)} className="px-2 py-2">
                          <Plus size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <GlassCard className="h-fit lg:sticky lg:top-28">
          <div className="flex items-center gap-2 text-neon-cyan">
            <ShoppingBag size={16} />
            <span className="text-xs uppercase tracking-[0.2em]">Your order</span>
          </div>
          {lines.length === 0 ? (
            <p className="mt-3 text-sm text-white/55">
              Add items to start your order.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {lines.map((l) => (
                <li key={l.id} className="flex items-center gap-3 text-sm">
                  <img src={l.item.image} className="h-10 w-10 rounded-lg object-cover" alt="" />
                  <div className="flex-1">
                    <div className="font-medium">{l.item.name}</div>
                    <div className="text-xs text-white/45">x{l.qty}</div>
                  </div>
                  <div className="text-neon-cyan font-display">
                    {currency(l.item.price * l.qty)}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 border-t border-white/5 pt-3 flex items-center justify-between">
            <span className="text-white/60 text-sm">Total</span>
            <span className="font-display text-xl text-neon-cyan">{currency(total)}</span>
          </div>
          <button
            disabled={lines.length === 0}
            className={cn(
              'mt-4 w-full h-12 rounded-xl font-semibold transition',
              lines.length === 0
                ? 'glass text-white/40 cursor-not-allowed'
                : 'bg-neon-grad text-ink-950 shadow-glow',
            )}
          >
            Pay & collect
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
