'use client';

import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import SectionHeading from '@/components/ui/SectionHeading';
import { Clock, MapPin, Phone, Send } from 'lucide-react';
import { useSite } from '@/lib/useData';

export default function ContactPage() {
  const site = useSite({
    address: '42 Cyber Ave, Sydney NSW 2000',
    phone: '+61 2 5550 0420',
    email: 'contact@sportsx.com.au',
  });
  return (
    <div className="container-px pt-28">
      <SectionHeading
        eyebrow="Contact us"
        title={
          <>
            Say <span className="text-neon">hello</span>
          </>
        }
        description="Booking a court, joining the club, gear questions — drop us a message."
      />

      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Message sent — admin will be in touch.');
            }}
            className="grid gap-4"
          >
            <Field label="Name" placeholder="Your name" required />
            <Field label="Email" type="email" placeholder="you@example.com" required />
            <Field label="Phone" type="tel" placeholder="+61 412 345 678" />
            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-white/50">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="How can we help?"
                className="mt-2 w-full p-4 rounded-xl bg-ink-800/80 border border-white/10 focus:border-neon-cyan/60 outline-none transition"
              />
            </div>
            <NeonButton icon={<Send size={14} />} className="justify-self-start">
              Send message
            </NeonButton>
          </form>
        </GlassCard>

        <div className="grid gap-4">
          <GlassCard>
            <div className="flex items-center gap-3 text-neon-cyan">
              <MapPin size={18} />
              <h3 className="font-display text-lg">Visit us</h3>
            </div>
            <p className="mt-2 text-sm text-white/70">{site.address}</p>
            <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-white/10 bg-ink-800 grid place-items-center text-white/50 text-sm">
              <div className="text-center">
                <MapPin size={28} className="mx-auto text-neon-cyan" />
                <div className="mt-2">Google Maps embed</div>
                <div className="text-xs text-white/30 mt-1">
                  (add NEXT_PUBLIC_MAPS_KEY to enable)
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid sm:grid-cols-2 gap-4">
            <GlassCard>
              <div className="flex items-center gap-3 text-neon-cyan">
                <Clock size={16} />
                <h4 className="text-sm uppercase tracking-[0.18em]">Hours</h4>
              </div>
              <ul className="mt-3 text-sm text-white/70 space-y-1">
                <li>Mon – Fri: 8 AM – 11 PM</li>
                <li>Sat: 9 AM – 11 PM</li>
                <li>Sun: 9 AM – 9 PM</li>
              </ul>
            </GlassCard>
            <GlassCard>
              <div className="flex items-center gap-3 text-neon-cyan">
                <Phone size={16} />
                <h4 className="text-sm uppercase tracking-[0.18em]">Reach us</h4>
              </div>
              <ul className="mt-3 text-sm text-white/70 space-y-1">
                <li>{site.phone}</li>
                <li>{site.email}</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.18em] text-white/50">
        {label}
      </label>
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full h-12 px-4 rounded-xl bg-ink-800/80 border border-white/10 focus:border-neon-cyan/60 outline-none transition"
      />
    </div>
  );
}
