'use client';

import { useEffect, useRef, useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import { players } from '@/lib/data';
import { ImageIcon, LockKeyhole, Search, Send, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

type Msg = {
  id: string;
  from: 'me' | 'them';
  text: string;
  time: string;
};

const initialThreads: Record<string, Msg[]> = {
  p001: [
    { id: '1', from: 'them', text: 'Easy on me Friday yeah?', time: '6:12 PM' },
    { id: '2', from: 'me', text: 'No promises. Court 1, 7:30?', time: '6:13 PM' },
    { id: '3', from: 'them', text: 'Locked in 🔒', time: '6:14 PM' },
  ],
  p003: [
    { id: '1', from: 'them', text: 'GG yesterday — your backhand is insane', time: '11:02 AM' },
    { id: '2', from: 'me', text: 'Thanks! Rematch this week?', time: '11:04 AM' },
  ],
  p004: [
    { id: '1', from: 'them', text: 'Thursday doubles, you in?', time: '8:45 PM' },
  ],
};

export default function MessagesPage() {
  const [activeId, setActiveId] = useState('p001');
  const [threads, setThreads] = useState(initialThreads);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [threads, activeId]);

  const active = players.find((p) => p.id === activeId)!;
  const msgs = threads[activeId] ?? [];

  const send = () => {
    if (!draft.trim()) return;
    const newMsg: Msg = {
      id: Math.random().toString(36).slice(2),
      from: 'me',
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setThreads((s) => ({ ...s, [activeId]: [...(s[activeId] ?? []), newMsg] }));
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      setThreads((s) => ({
        ...s,
        [activeId]: [
          ...(s[activeId] ?? []),
          {
            id: Math.random().toString(36).slice(2),
            from: 'them',
            text: 'Sounds good — see you there!',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
      setTyping(false);
    }, 1400);
  };

  return (
    <div className="container-px pt-28">
      <SectionHeading
        eyebrow="Messages"
        title={
          <>
            Stay <span className="text-neon">connected</span>
          </>
        }
        description="One-to-one chat with online status, typing indicators and match invites."
      />

      <div className="mt-8 grid lg:grid-cols-[320px,1fr] gap-4 h-[68vh]">
        <GlassCard className="!p-0 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <label className="relative glass rounded-xl h-10 flex items-center pl-3 pr-1">
              <Search size={14} className="text-white/50" />
              <input
                placeholder="Search"
                className="flex-1 bg-transparent border-0 outline-none px-3 text-sm"
              />
            </label>
          </div>
          <div className="flex-1 overflow-auto">
            {players.slice(0, 6).map((p) => {
              const last = threads[p.id]?.at(-1);
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveId(p.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 text-left border-b border-white/5 transition',
                    activeId === p.id ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]',
                  )}
                >
                  <div className="relative">
                    <img src={p.avatar} className="h-11 w-11 rounded-full" alt="" />
                    {p.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-neon-cyan ring-2 ring-ink-900" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs text-white/45 truncate">
                      {last?.text ?? 'Say hi'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="!p-0 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-3">
            <img src={active.avatar} className="h-10 w-10 rounded-full" alt="" />
            <div className="flex-1">
              <div className="font-medium">{active.name}</div>
              <div className="text-xs text-white/45 flex items-center gap-2">
                {active.online ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan" /> Online
                  </>
                ) : (
                  'Offline'
                )}
              </div>
            </div>
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-neon-grad text-ink-950 text-xs font-semibold shadow-glow">
              <LockKeyhole size={12} /> Invite to match
            </button>
          </div>

          <div ref={scrollerRef} className="flex-1 overflow-auto p-5 space-y-3">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex',
                  m.from === 'me' ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-[78%] px-4 py-2.5 rounded-2xl text-sm',
                    m.from === 'me'
                      ? 'bg-neon-grad text-ink-950 rounded-br-md'
                      : 'glass rounded-bl-md',
                  )}
                >
                  <div>{m.text}</div>
                  <div
                    className={cn(
                      'mt-1 text-[10px]',
                      m.from === 'me' ? 'text-ink-950/60' : 'text-white/40',
                    )}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="glass rounded-2xl rounded-bl-md px-3 py-2 inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse [animation-delay:240ms]" />
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/5 flex items-center gap-2">
            <button className="h-10 w-10 grid place-items-center rounded-xl glass text-white/60 hover:text-white">
              <ImageIcon size={16} />
            </button>
            <button className="h-10 w-10 grid place-items-center rounded-xl glass text-white/60 hover:text-white">
              <Smile size={16} />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type a message"
              className="flex-1 h-10 px-4 rounded-xl bg-ink-800/80 border border-white/10 focus:border-neon-cyan/60 outline-none text-sm"
            />
            <button
              onClick={send}
              className="h-10 px-4 rounded-xl bg-neon-grad text-ink-950 text-sm font-semibold inline-flex items-center gap-2 shadow-glow"
            >
              <Send size={14} /> Send
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
