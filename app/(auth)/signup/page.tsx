'use client';

import Link from 'next/link';
import NeonButton from '@/components/ui/NeonButton';
import { ImagePlus, Sparkles, UserPlus } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] tracking-[0.2em] uppercase text-white/70">
          <Sparkles size={12} className="text-neon-cyan" />
          Join Sportsx
        </div>
        <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight">
          Claim your <span className="text-neon">player card</span>
        </h1>
        <p className="mt-3 text-white/60">
          Your member ID and rank are minted the moment you join.
        </p>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-10 glass-strong rounded-3xl p-7 grid gap-5"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Full name" placeholder="Aarav Kumar" />
          <Field label="Username" placeholder="aarav.k" />
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Email" type="email" placeholder="you@sportsx.com.au" />
          <Field label="Phone number" type="tel" placeholder="+61 412 345 678" />
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Date of birth" type="date" />
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-white/50">
              Profile photo
            </label>
            <label className="mt-2 flex items-center gap-3 h-12 px-4 rounded-xl glass cursor-pointer hover:bg-white/10 transition">
              <ImagePlus size={16} className="text-neon-cyan" />
              <span className="text-sm text-white/70">Upload a photo</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Password" type="password" placeholder="••••••••" />
          <Field
            label="Confirm password"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-white/65">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-white/20 bg-ink-800 accent-neon-cyan"
            defaultChecked
          />
          <span>
            I agree to the Sportsx{' '}
            <Link href="#" className="text-neon-cyan hover:underline">
              terms
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-neon-cyan hover:underline">
              privacy policy
            </Link>
            .
          </span>
        </label>

        <NeonButton className="w-full" icon={<UserPlus size={16} />}>
          Create account
        </NeonButton>

        <p className="text-center text-sm text-white/60">
          Already a member?{' '}
          <Link href="/login" className="text-neon-cyan hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-white/40">
          A verification email will be sent to your inbox.
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
