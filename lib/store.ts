// NOTE: server-only module — only import from API routes or server components,
// never from a 'use client' file (it uses the Node fs module).
import fs from 'fs';
import path from 'path';
import {
  players as seedPlayers,
  products as seedProducts,
  cafeItems as seedCafe,
  events as seedEvents,
  type Player,
  type Product,
  type CafeItem,
} from './data';

export type SiteSettings = {
  clubName: string;
  heroLine1: string;
  heroLine2: string;
  heroSubtitle: string;
  activeMembers: string;
  matchesPlayed: string;
  phone: string;
  email: string;
  address: string;
};

export type EventItem = (typeof seedEvents)[number];

export type Store = {
  site: SiteSettings;
  members: Player[];
  products: Product[];
  cafeItems: CafeItem[];
  events: EventItem[];
};

export type CollectionKey = 'members' | 'products' | 'cafeItems' | 'events';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

const defaults: Store = {
  site: {
    clubName: 'Sportsx',
    heroLine1: 'Where speed',
    heroLine2: 'meets precision.',
    heroSubtitle:
      'Sportsx Table Tennis Hub — premium club management, social matchmaking, leaderboard, e-commerce, cafe ordering and an always-on AI assistant. All wrapped in a futuristic 3D arena.',
    activeMembers: '1,284',
    matchesPlayed: '9,742',
    phone: '+61 2 5550 0420',
    email: 'contact@sportsx.com.au',
    address: '42 Cyber Ave, Sydney NSW 2000',
  },
  members: seedPlayers,
  products: seedProducts,
  cafeItems: seedCafe,
  events: seedEvents,
};

function ensureStore(): Store {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(defaults, null, 2), 'utf-8');
    return structuredClone(defaults);
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<Store>;
    // merge in any newly added default keys
    return {
      site: { ...defaults.site, ...(parsed.site ?? {}) },
      members: parsed.members ?? defaults.members,
      products: parsed.products ?? defaults.products,
      cafeItems: parsed.cafeItems ?? defaults.cafeItems,
      events: parsed.events ?? defaults.events,
    };
  } catch {
    return structuredClone(defaults);
  }
}

export function readStore(): Store {
  return ensureStore();
}

export function writeStore(store: Store): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}
