'use client';

import { useMemo, useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import { products as productsSeed, Product } from '@/lib/data';
import { useCollection } from '@/lib/useData';
import { currency } from '@/lib/utils';
import { Heart, Search, ShoppingCart, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  'All',
  'Rackets',
  'Rubbers',
  'Balls',
  'Tables',
  'Nets',
  'Shoes',
  'Clothing',
  'Accessories',
] as const;

export default function ShopPage() {
  const products = useCollection<Product>('/api/products', productsSeed);
  const [cat, setCat] = useState<(typeof categories)[number]>('All');
  const [q, setQ] = useState('');
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([
    { id: 'pr001', qty: 1 },
    { id: 'pr002', qty: 2 },
  ]);
  const [wish, setWish] = useState<Record<string, boolean>>({});
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (cat === 'All' || p.category === cat) &&
          p.name.toLowerCase().includes(q.toLowerCase()),
      ),
    [cat, q, products],
  );

  const cartLines = cart
    .map((c) => ({
      ...c,
      product: products.find((p) => p.id === c.id),
    }))
    .filter((l): l is typeof l & { product: Product } => Boolean(l.product));
  const subtotal = cartLines.reduce((a, l) => a + l.product.price * l.qty, 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 250 ? 0 : 12;
  const total = subtotal + tax + shipping;

  const addToCart = (id: string) =>
    setCart((c) =>
      c.find((l) => l.id === id)
        ? c.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
        : [...c, { id, qty: 1 }],
    );

  return (
    <div className="container-px pt-28">
      <SectionHeading
        eyebrow="Pro shop"
        title={
          <>
            Gear that <span className="text-neon">performs</span>
          </>
        }
        description="From premium carbon rackets to tournament balls. Tour-grade gear, club pricing."
        action={
          <button
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass hover:shadow-glow transition"
          >
            <ShoppingCart size={16} />
            <span className="text-sm">Cart</span>
            {cart.length > 0 && (
              <span className="ml-1 text-[10px] font-bold px-1.5 rounded-full bg-neon-grad text-ink-950">
                {cart.reduce((a, l) => a + l.qty, 0)}
              </span>
            )}
          </button>
        }
      />

      <div className="mt-8 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="inline-flex glass rounded-xl p-1 overflow-auto no-scrollbar">
          {categories.map((c) => (
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
        <label className="relative glass rounded-xl h-11 flex items-center pl-3 pr-1 max-w-xs w-full">
          <Search size={16} className="text-white/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search gear"
            className="flex-1 bg-transparent border-0 outline-none px-3 text-sm"
          />
        </label>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            wished={!!wish[p.id]}
            onWish={() => setWish((w) => ({ ...w, [p.id]: !w[p.id] }))}
            onAdd={() => addToCart(p.id)}
          />
        ))}
      </div>

      {/* Cart drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 transition',
          cartOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!cartOpen}
      >
        <div
          onClick={() => setCartOpen(false)}
          className={cn(
            'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity',
            cartOpen ? 'opacity-100' : 'opacity-0',
          )}
        />
        <aside
          className={cn(
            'absolute right-0 top-0 h-full w-full sm:w-[420px] glass-strong border-l border-white/10 p-5 transition-transform duration-300 flex flex-col',
            cartOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold">Your cart</h3>
            <button
              onClick={() => setCartOpen(false)}
              className="h-9 w-9 grid place-items-center rounded-lg glass"
              aria-label="Close cart"
            >
              <X size={16} />
            </button>
          </div>
          <div className="mt-4 flex-1 overflow-auto space-y-3">
            {cartLines.map((l) => (
              <div key={l.id} className="glass rounded-xl p-3 flex gap-3">
                <img
                  src={l.product.image}
                  className="h-16 w-16 rounded-lg object-cover"
                  alt=""
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {l.product.name}
                  </div>
                  <div className="text-xs text-white/45">{l.product.category}</div>
                  <div className="mt-1 text-sm text-neon-cyan font-display">
                    {currency(l.product.price)}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() =>
                      setCart((c) => c.filter((x) => x.id !== l.id))
                    }
                    className="text-white/40 hover:text-white"
                    aria-label="Remove"
                  >
                    <X size={14} />
                  </button>
                  <div className="inline-flex glass rounded-lg overflow-hidden text-xs">
                    <button
                      onClick={() =>
                        setCart((c) =>
                          c
                            .map((x) =>
                              x.id === l.id ? { ...x, qty: Math.max(0, x.qty - 1) } : x,
                            )
                            .filter((x) => x.qty > 0),
                        )
                      }
                      className="px-2 py-1"
                    >
                      –
                    </button>
                    <span className="px-3 py-1">{l.qty}</span>
                    <button
                      onClick={() =>
                        setCart((c) =>
                          c.map((x) => (x.id === l.id ? { ...x, qty: x.qty + 1 } : x)),
                        )
                      }
                      className="px-2 py-1"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="text-center text-white/50 py-12">
                Your cart is empty.
              </div>
            )}
          </div>

          <div className="border-t border-white/5 pt-4 space-y-1 text-sm">
            <Row label="Subtotal" value={currency(subtotal)} />
            <Row label="Tax (10% GST)" value={currency(tax)} />
            <Row
              label="Shipping"
              value={shipping === 0 ? 'Free' : currency(shipping)}
            />
            <div className="border-t border-white/10 my-2" />
            <Row label="Total" value={currency(total)} strong />
            <button className="mt-4 w-full h-12 rounded-xl bg-neon-grad text-ink-950 font-semibold shadow-glow">
              Checkout
            </button>
            <div className="flex items-center justify-center gap-3 mt-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
              <span>Card</span>
              <span>•</span>
              <span>PayPal</span>
              <span>•</span>
              <span>Apple Pay</span>
              <span>•</span>
              <span>Google Pay</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className={cn('text-white/60', strong && 'text-white')}>{label}</span>
      <span className={cn(strong && 'font-display text-lg text-neon-cyan')}>
        {value}
      </span>
    </div>
  );
}

function ProductCard({
  product,
  wished,
  onWish,
  onAdd,
}: {
  product: Product;
  wished: boolean;
  onWish: () => void;
  onAdd: () => void;
}) {
  return (
    <GlassCard className="group !p-0 overflow-hidden hover:shadow-glow transition">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          className="h-full w-full object-cover transition group-hover:scale-105"
          alt={product.name}
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {product.badge && (
            <span className="px-2 py-1 rounded-full bg-neon-grad text-ink-950 text-[10px] font-semibold uppercase tracking-wider">
              {product.badge}
            </span>
          )}
        </div>
        <button
          onClick={onWish}
          className="absolute top-2 right-2 h-9 w-9 grid place-items-center rounded-full glass-strong hover:shadow-glow"
          aria-label="Wishlist"
        >
          <Heart
            size={14}
            className={cn(
              'transition',
              wished ? 'fill-neon-cyan text-neon-cyan' : 'text-white/70',
            )}
          />
        </button>
      </div>
      <div className="p-4">
        <div className="text-xs uppercase tracking-[0.18em] text-white/40">
          {product.category}
        </div>
        <h3 className="mt-1 font-display font-semibold leading-tight">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-xs text-white/60">
          <Star size={12} className="fill-neon-cyan text-neon-cyan" />
          {product.rating} <span className="text-white/30">({product.reviews})</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="font-display text-lg text-neon-cyan">
            {currency(product.price)}
          </div>
          <button
            onClick={onAdd}
            className="px-3 py-2 rounded-lg bg-neon-grad text-ink-950 text-xs font-semibold shadow-glow"
          >
            Add to cart
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
