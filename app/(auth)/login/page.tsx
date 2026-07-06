'use client';

import Link from 'next/link';
import { useState } from 'react';
import NeonButton from '@/components/ui/NeonButton';
import { Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="mx-auto max-w-md">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] tracking-[0.2em] uppercase text-white/70">
          <Sparkles size={12} className="text-neon-cyan" />
          Welcome back
        </div>
        <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight">
          Step back <span className="text-neon">on court</span>
        </h1>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-10 glass-strong rounded-3xl p-7 space-y-5"
      >
        <Field label="Email" type="email" placeholder="you@sportsx.com.au" />
        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-white/50">
            Password
          </label>
          <div className="relative mt-2">
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full h-12 px-4 pr-12 rounded-xl bg-ink-800/80 border border-white/10 focus:border-neon-cyan/60 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              aria-label="Toggle password"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-ink-800 accent-neon-cyan"
              defaultChecked
            />
            <span className="text-white/70">Remember me</span>
          </label>
          <Link href="#" className="text-neon-cyan hover:underline">
            Forgot password?
          </Link>
        </div>

        <NeonButton className="w-full" icon={<LogIn size={16} />}>
          Sign in
        </NeonButton>

        <div className="relative my-2 text-center">
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
          <span className="relative px-3 bg-ink-900 text-xs text-white/40 uppercase tracking-[0.2em]">
            or continue with
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <SocialButton label="Google" />
          <SocialButton label="Apple" />
          <SocialButton label="Facebook" />
        </div>

        <p className="text-center text-sm text-white/60">
          New to Sportsx?{' '}
          <Link href="/signup" className="text-neon-cyan hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  type = 'text',
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.18em] text-white/50">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full h-12 px-4 rounded-xl bg-ink-800/80 border border-white/10 focus:border-neon-cyan/60 outline-none transition"
      />
    </div>
  );
}

function SocialButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="h-11 rounded-xl glass text-sm hover:bg-white/10 transition"
    >
      {label}
    </button>
  );
}
