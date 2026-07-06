'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Mic, Send, Sparkles, X } from 'lucide-react';
import {
  faq,
  products as productsSeed,
  cafeItems as cafeSeed,
  events as eventsSeed,
  players as membersSeed,
  type Product,
  type CafeItem,
  type Player,
} from '@/lib/data';
import { useCollection, useSite } from '@/lib/useData';
import { cn, currency } from '@/lib/utils';

type Msg = {
  id: string;
  from: 'me' | 'ai';
  text: string;
  source?: 'faq' | 'kb' | 'api';
  links?: { label: string; href: string }[];
};

type Answer = {
  text: string;
  source?: 'faq' | 'kb' | 'api';
  links?: { label: string; href: string }[];
};

type EventItem = (typeof eventsSeed)[number];
type SiteInfo = {
  clubName: string;
  address: string;
  phone: string;
  email: string;
};

/** The live website knowledge base the assistant searches first. */
type KB = {
  products: Product[];
  cafe: CafeItem[];
  events: EventItem[];
  members: Player[];
  site: SiteInfo;
};

const SITE_FALLBACK: SiteInfo = {
  clubName: 'Sportsx',
  address: '42 Cyber Ave, Sydney NSW 2000',
  phone: '+61 2 5550 0420',
  email: 'contact@sportsx.com.au',
};

const has = (q: string, ...words: string[]) => words.some((w) => q.includes(w));

/**
 * STEP 1 — search the live website data for a specific answer.
 * Returns null when the site has nothing specific, so the caller asks Gemini.
 */
function searchWebsite(input: string, kb: KB): Answer | null {
  const q = input.toLowerCase().trim();
  if (!q) return null;
  const words = q.replace(/[^\w$.\s-]/g, ' ').split(/\s+/).filter(Boolean);
  const priceIntent = has(q, 'price', 'cost', 'how much', 'cheap', 'expensive', 'afford', '$');

  // ---- Players / leaderboard ----
  const ranked = [...kb.members].sort((a, b) => b.points - a.points);
  if (has(q, 'top player', 'number 1', 'number one', 'rank 1', '#1', 'who is winning', 'who is first', 'who is the best', 'who is leading', 'leader', 'top of the')) {
    const t = ranked[0];
    if (t)
      return {
        text: `${t.name} is currently #1 with ${t.points} points — ${t.wins} wins, ${t.losses} losses.`,
        source: 'kb',
        links: [{ label: 'View leaderboard', href: '/leaderboard' }],
      };
  }
  const rankMatch = q.match(/(?:rank|number|#|position|no\.?)\s*(\d{1,3})/);
  if (rankMatch) {
    const p = ranked[parseInt(rankMatch[1], 10) - 1];
    if (p)
      return {
        text: `#${rankMatch[1]} is ${p.name} with ${p.points} points.`,
        source: 'kb',
        links: [{ label: 'Leaderboard', href: '/leaderboard' }],
      };
  }
  for (const m of kb.members) {
    const first = m.name.toLowerCase().split(' ')[0];
    if (
      q.includes(m.name.toLowerCase()) ||
      q.includes(m.username.toLowerCase()) ||
      (first.length >= 3 && words.includes(first))
    ) {
      const total = m.wins + m.losses;
      const pct = total ? Math.round((m.wins / total) * 100) : 0;
      return {
        text: `${m.name} is rank #${m.rank} (${m.level}, ${m.style}) with ${m.points} points — ${m.wins} wins / ${m.losses} losses (${pct}% win rate).`,
        source: 'kb',
        links: [{ label: 'Leaderboard', href: '/leaderboard' }],
      };
    }
  }

  // ---- Social night events ----
  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const day = dayNames.find((d) => q.includes(d));
  if (day && has(q, 'night', 'social', 'event', 'play', 'on', 'happening', 'what')) {
    const ev = kb.events.find((e) => e.day.toLowerCase() === day);
    if (ev)
      return {
        text: `${ev.day}: ${ev.title}, ${ev.time}. ${ev.rsvp}/${ev.capacity} players have RSVPed.`,
        source: 'kb',
        links: [{ label: 'RSVP now', href: '/social-nights' }],
      };
    return {
      text: `There's no social night scheduled on ${day[0].toUpperCase()}${day.slice(1)}. Social nights run ${kb.events.map((e) => e.day).join(', ')}, 7–9 PM.`,
      source: 'kb',
      links: [{ label: 'Social nights', href: '/social-nights' }],
    };
  }
  const evTitle = kb.events.find(
    (e) =>
      has(q, 'tournament', 'doubles', 'clinic', 'open play', 'mini-league', 'skills') &&
      e.title.toLowerCase().split(/\W+/).some((w) => w.length > 3 && q.includes(w)),
  );
  if (evTitle)
    return {
      text: `${evTitle.title} is on ${evTitle.day}, ${evTitle.time}.`,
      source: 'kb',
      links: [{ label: 'Social nights', href: '/social-nights' }],
    };
  if (has(q, 'social night', 'what nights', 'when can i play', 'when are events', 'this week', "what's on") && kb.events.length) {
    return {
      text: `Social nights: ${kb.events.map((e) => `${e.day} — ${e.title} (${e.time})`).join('; ')}.`,
      source: 'kb',
      links: [{ label: 'RSVP', href: '/social-nights' }],
    };
  }

  // ---- Shop products ----
  let product: Product | undefined;
  for (const p of kb.products) {
    const nameWords = p.name.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    if (nameWords.some((w) => q.includes(w))) {
      product = p;
      break;
    }
  }
  if (product && (priceIntent || has(q, 'shop', 'buy', 'rating', 'review', 'sell', product.category.toLowerCase()))) {
    return {
      text: `${product.name} is ${currency(product.price)} (${product.category}), rated ${product.rating}/5 from ${product.reviews} reviews.`,
      source: 'kb',
      links: [{ label: 'Open in shop', href: '/shop' }],
    };
  }
  const cat = ['racket', 'rubber', 'ball', 'table', 'net', 'shoe', 'clothing', 'accessor'].find((c) => q.includes(c));
  if (cat) {
    const inCat = kb.products.filter((p) => p.category.toLowerCase().includes(cat));
    if (inCat.length) {
      if (has(q, 'cheap', 'least expensive', 'lowest', 'budget')) {
        const c = inCat.reduce((a, b) => (a.price < b.price ? a : b));
        return {
          text: `The cheapest ${c.category.toLowerCase()} is ${c.name} at ${currency(c.price)}.`,
          source: 'kb',
          links: [{ label: 'Shop', href: '/shop' }],
        };
      }
      if (has(q, 'expensive', 'priciest', 'best', 'top', 'premium', 'highest', 'recommend')) {
        const c = inCat.reduce((a, b) => (a.rating > b.rating ? a : b));
        return {
          text: `Our top ${c.category.toLowerCase()} is ${c.name} — ${currency(c.price)}, rated ${c.rating}/5.`,
          source: 'kb',
          links: [{ label: 'Shop', href: '/shop' }],
        };
      }
      if (priceIntent || has(q, 'have', 'sell', 'stock', 'do you', 'got', 'show')) {
        const list = inCat.slice(0, 4).map((p) => `${p.name} ${currency(p.price)}`).join(', ');
        return {
          text: `In ${inCat[0].category}: ${list}.`,
          source: 'kb',
          links: [{ label: 'Shop', href: '/shop' }],
        };
      }
    }
  }

  // ---- Cafe ----
  let cafe: CafeItem | undefined;
  for (const c of kb.cafe) {
    const nameWords = c.name.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    if (nameWords.some((w) => q.includes(w))) {
      cafe = c;
      break;
    }
  }
  if (cafe && (priceIntent || has(q, 'cafe', 'menu', 'order', 'coffee', 'drink', 'eat', cafe.category.toLowerCase()))) {
    return {
      text: `${cafe.name} is ${currency(cafe.price)} (${cafe.category}).`,
      source: 'kb',
      links: [{ label: 'Cafe menu', href: '/cafe' }],
    };
  }
  const cafeCat = ['coffee', 'tea', 'cold drink', 'smoothie', 'burger', 'sandwich', 'snack', 'dessert'].find((c) => q.includes(c));
  if (cafeCat) {
    const inCat = kb.cafe.filter((c) => c.category.toLowerCase().includes(cafeCat));
    if (inCat.length) {
      const list = inCat.slice(0, 5).map((c) => `${c.name} ${currency(c.price)}`).join(', ');
      return {
        text: `${inCat[0].category}: ${list}.`,
        source: 'kb',
        links: [{ label: 'Cafe menu', href: '/cafe' }],
      };
    }
  }

  // ---- Contact / site info ----
  if (has(q, 'address', 'where are you', 'where is', 'located', 'location', 'find you', 'directions')) {
    return {
      text: `${kb.site.clubName} is at ${kb.site.address}.`,
      source: 'kb',
      links: [{ label: 'Contact', href: '/contact' }],
    };
  }
  if (has(q, 'phone', 'call you', 'number to call', 'telephone')) {
    return { text: `Call us on ${kb.site.phone}.`, source: 'kb', links: [{ label: 'Contact', href: '/contact' }] };
  }
  if (has(q, 'email', 'e-mail')) {
    return { text: `Email us at ${kb.site.email}.`, source: 'kb', links: [{ label: 'Contact', href: '/contact' }] };
  }

  // ---- FAQ (require a specific match, else defer to Gemini) ----
  let best: { q: string; a: string } | null = null;
  let bestScore = 0;
  for (const f of faq) {
    const keys = f.q.toLowerCase().replace(/[?.,]/g, '').split(' ').filter((w) => w.length > 3);
    const hits = keys.filter((k) => q.includes(k)).length;
    if (hits > bestScore) {
      bestScore = hits;
      best = f;
    }
  }
  if (best && bestScore >= 2) return { text: best.a, source: 'faq' };

  return null;
}

/** Only shown if the website has no answer AND Gemini can't be reached. */
function errorFallback(): Answer {
  return {
    text: "Sorry — I couldn't reach the assistant just now. Please try again in a moment, or browse the site directly.",
    links: [
      { label: 'Social nights', href: '/social-nights' },
      { label: 'Shop', href: '/shop' },
    ],
  };
}

function id() {
  return Math.random().toString(36).slice(2);
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---- Direct browser -> Google Gemini call (no backend) -------------------
const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_MODEL =
  process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash-lite';

function clubContext(kb: KB): string {
  const prod = kb.products
    .slice(0, 12)
    .map((p) => `${p.name} ${currency(p.price)} (${p.category})`)
    .join('; ');
  const caf = kb.cafe
    .slice(0, 12)
    .map((c) => `${c.name} ${currency(c.price)}`)
    .join('; ');
  const ev = kb.events.map((e) => `${e.day}: ${e.title} ${e.time}`).join('; ');
  const top = [...kb.members]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5)
    .map((m, i) => `${i + 1}. ${m.name} ${m.points}pts`)
    .join('; ');
  const faqs = faq.map((f) => `Q:${f.q} A:${f.a}`).join(' ');
  return [
    `You are "${kb.site.clubName} AI", the friendly assistant and coach for ${kb.site.clubName} Table Tennis Hub.`,
    'For anything about THIS club — hours, prices, events, players, joining, contact — use the CLUB FACTS below and be accurate.',
    'You may ALSO help with general table tennis topics: coaching tips, practice plans, drills, technique, strategy, rules and equipment advice. Be a friendly, encouraging coach and genuinely answer these.',
    'Keep simple answers short (1-3 sentences). For plans, drills or step-by-step requests, you may use a short numbered or bulleted list. Where relevant, tie advice back to the club (e.g. suggest practising at a social night).',
    'Politely decline only topics that have nothing to do with table tennis or the club.',
    '',
    'CLUB FACTS:',
    'Hours: Mon-Fri 8AM-11PM, Sat 9AM-11PM, Sun 9AM-9PM.',
    'Social nights: Tuesday to Friday, 7PM-9PM.',
    'Membership: from $39/month, unlimited play. Join via the sign-up page.',
    'Points: Win = +5, Loss = 0, never expire; both players must confirm a match.',
    `Address: ${kb.site.address}. Phone: ${kb.site.phone}. Email: ${kb.site.email}.`,
    `Social night events: ${ev}.`,
    `Top players: ${top}.`,
    `Shop items: ${prod}.`,
    `Cafe menu: ${caf}.`,
    `FAQ: ${faqs}`,
  ].join('\n');
}

async function askGemini(message: string, context: string): Promise<string | null> {
  if (!GEMINI_KEY) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: context }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts as
      | { text?: string }[]
      | undefined;
    const text = parts?.map((p) => p.text ?? '').join('').trim();
    return text || null;
  } catch {
    return null;
  }
}

const initial: Msg[] = [
  {
    id: 'welcome',
    from: 'ai',
    text: "Hi! I'm Sportsx AI. Ask me about social nights, the leaderboard, the shop, the cafe — or anything else about the club.",
  },
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [busy, setBusy] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Live website data — reflects anything edited in the admin control panel.
  const products = useCollection<Product>('/api/products', productsSeed);
  const cafe = useCollection<CafeItem>('/api/cafe', cafeSeed);
  const events = useCollection<EventItem>('/api/events', eventsSeed);
  const members = useCollection<Player>('/api/members', membersSeed);
  const site = useSite<SiteInfo>(SITE_FALLBACK);
  const kb: KB = { products, cafe, events, members, site };

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, open]);

  const pushAnswer = (a: Answer) =>
    setMessages((m) => [
      ...m,
      { id: id(), from: 'ai', text: a.text, source: a.source, links: a.links },
    ]);

  const ask = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setMessages((m) => [...m, { id: id(), from: 'me', text: trimmed }]);
    setDraft('');
    setBusy(true);

    // PRIORITY 1 — answer from the website's own data.
    const fromSite = searchWebsite(trimmed, kb);
    if (fromSite) {
      await wait(300);
      pushAnswer(fromSite);
      setBusy(false);
      return;
    }

    // PRIORITY 2 — not on the site, so ask Gemini directly from the browser.
    const aiText = await askGemini(trimmed, clubContext(kb));
    if (aiText) {
      pushAnswer({ text: aiText, source: 'api' });
      setBusy(false);
      return;
    }

    // Only if both fail (e.g. offline / quota).
    pushAnswer(errorFallback());
    setBusy(false);
  };

  const suggestions = [
    'When are social nights?',
    'How does the points system work?',
    'Show me the leaderboard',
    'Best racket on the shop?',
  ];

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Sportsx AI"
        className={cn(
          'fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full grid place-items-center shadow-glow transition-all',
          'bg-neon-grad text-ink-950 hover:scale-105 animate-pulseGlow',
        )}
      >
        {open ? <X size={20} /> : <Bot size={22} />}
      </button>

      <div
        className={cn(
          'fixed bottom-24 right-4 sm:right-5 z-40 w-[min(380px,calc(100vw-2rem))] origin-bottom-right transition-all',
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none',
        )}
      >
        <div className="rounded-2xl glass-strong shadow-glow overflow-hidden flex flex-col h-[520px]">
          <div className="p-3 border-b border-white/5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-neon-grad grid place-items-center text-ink-950">
              <Sparkles size={16} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-display font-semibold">Sportsx AI</div>
              <div className="text-[10px] text-white/45 uppercase tracking-[0.2em]">
                FAQ • KB • AI
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="h-8 w-8 grid place-items-center rounded-lg glass"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          <div ref={scrollerRef} className="flex-1 overflow-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex',
                  m.from === 'me' ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm',
                    m.from === 'me'
                      ? 'bg-neon-grad text-ink-950 rounded-br-md'
                      : 'glass rounded-bl-md',
                  )}
                >
                  <div>{m.text}</div>
                  {m.links && m.links.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          className="text-[11px] px-2 py-1 rounded-full bg-ink-950/30 text-ink-950 font-medium border border-ink-950/20"
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  )}
                  {m.source && m.from === 'ai' && (
                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
                      via {m.source}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="glass rounded-2xl rounded-bl-md px-3 py-2 inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse [animation-delay:240ms]" />
                </div>
              </div>
            )}

            {messages.length <= 1 && (
              <div className="pt-2 space-y-2">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Try
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="text-xs glass px-3 py-1.5 rounded-full hover:bg-white/10"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/5 flex items-center gap-2">
            <button
              className="h-10 w-10 grid place-items-center rounded-xl glass text-white/60 hover:text-white"
              aria-label="Voice input"
            >
              <Mic size={16} />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask(draft)}
              placeholder="Ask me anything"
              className="flex-1 h-10 px-3 rounded-xl bg-ink-800/80 border border-white/10 focus:border-neon-cyan/60 outline-none text-sm"
            />
            <button
              onClick={() => ask(draft)}
              className="h-10 px-3 rounded-xl bg-neon-grad text-ink-950 inline-flex items-center gap-2 shadow-glow"
              aria-label="Send"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
