import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Clock, Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Contact Us — WorldClass Auto Repairs',
  description: 'Get in touch with WorldClass Auto Repairs in Jamaica. Call, WhatsApp, or email us. Located at 51B Waltham Park Rd, Shop 8 Padlock Plaza.',
};

export default function ContactPage() {
  return (
    <div className="bg-[#0A0A0A]">

      {/* ===== HERO ===== */}
      <div className="relative bg-[#000] pt-40 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(rgba(245,166,35,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,166,35,.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 100%,rgba(245,166,35,.08) 0%,transparent 60%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/8 text-primary text-[11px] font-bold tracking-[.12em] uppercase px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            Get In Touch
          </div>
          <h1 className="text-[clamp(36px,6vw,76px)] font-black text-white tracking-[-0.02em] leading-none mb-6">
            Contact Us
          </h1>
          <p className="text-[17px] text-white/45 leading-relaxed max-w-[500px] mx-auto">
            Have a question about your vehicle? Ready to book a service? We&apos;re here to help — reach out any way that works for you.
          </p>
        </div>
      </div>

      {/* ===== CONTACT CARDS ===== */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">

          {/* Phone */}
          <a href="tel:8766720125" className="group bg-[#111] border border-white/[0.07] hover:border-primary/30 rounded-2xl p-7 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 block">
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary mb-5 group-hover:bg-primary/20 transition-colors">
              <Phone size={22} />
            </div>
            <div className="text-[11px] font-bold text-white/30 uppercase tracking-[.1em] mb-2">Call Us</div>
            <div className="text-[16px] font-bold text-white mb-1">(876) 672-0125</div>
            <div className="text-[14px] text-white/45">(876) 254-6914</div>
            <div className="text-[12px] text-white/25 mt-3">Mon – Sat · 8 AM – 6 PM</div>
          </a>

          {/* WhatsApp */}
          <a href="https://wa.me/18764629709" target="_blank" rel="noopener noreferrer"
            className="group bg-[#111] border border-white/[0.07] hover:border-primary/30 rounded-2xl p-7 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 block">
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary mb-5 group-hover:bg-primary/20 transition-colors">
              <MessageCircle size={22} />
            </div>
            <div className="text-[11px] font-bold text-white/30 uppercase tracking-[.1em] mb-2">WhatsApp</div>
            <div className="text-[16px] font-bold text-white mb-1">(876) 462-9709</div>
            <div className="text-[14px] text-white/45">Message us anytime</div>
            <div className="text-[12px] text-primary/60 mt-3 flex items-center gap-1">
              Open WhatsApp <ArrowRight size={11} />
            </div>
          </a>

          {/* Email */}
          <a href="mailto:worldclassautorepairs1@gmail.com"
            className="group bg-[#111] border border-white/[0.07] hover:border-primary/30 rounded-2xl p-7 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 block">
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary mb-5 group-hover:bg-primary/20 transition-colors">
              <Mail size={22} />
            </div>
            <div className="text-[11px] font-bold text-white/30 uppercase tracking-[.1em] mb-2">Email</div>
            <div className="text-[14px] font-bold text-white mb-1 break-all">worldclassautorepairs1@gmail.com</div>
            <div className="text-[12px] text-white/25 mt-3">We reply within 24 hours</div>
          </a>

          {/* Location */}
          <a href="https://www.google.com/maps/search/?api=1&query=51B+Waltham+Park+Rd+Shop+8+Padlock+Plaza+Jamaica"
            target="_blank" rel="noopener noreferrer"
            className="group bg-[#111] border border-white/[0.07] hover:border-primary/30 rounded-2xl p-7 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 block">
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary mb-5 group-hover:bg-primary/20 transition-colors">
              <MapPin size={22} />
            </div>
            <div className="text-[11px] font-bold text-white/30 uppercase tracking-[.1em] mb-2">Location</div>
            <div className="text-[15px] font-bold text-white mb-1">51B Waltham Park Rd</div>
            <div className="text-[14px] text-white/45">Shop 8, Padlock Plaza</div>
            <div className="text-[12px] text-primary/60 mt-3 flex items-center gap-1">
              Get directions <ArrowRight size={11} />
            </div>
          </a>
        </div>

        {/* ===== HOURS + MAP ROW ===== */}
        <div className="grid lg:grid-cols-2 gap-6 mb-16">

          {/* Hours */}
          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary">
                <Clock size={18} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white/30 uppercase tracking-[.1em]">Business Hours</div>
                <div className="text-[17px] font-black text-white">Opening Hours</div>
              </div>
            </div>

            <div className="flex flex-col divide-y divide-white/[0.05]">
              {[
                { day: 'Monday',    hrs: '8:00 AM – 6:00 PM', open: true  },
                { day: 'Tuesday',   hrs: '8:00 AM – 6:00 PM', open: true  },
                { day: 'Wednesday', hrs: '8:00 AM – 6:00 PM', open: true  },
                { day: 'Thursday',  hrs: '8:00 AM – 6:00 PM', open: true  },
                { day: 'Friday',    hrs: '8:00 AM – 6:00 PM', open: true  },
                { day: 'Saturday',  hrs: '8:00 AM – 5:00 PM', open: true  },
                { day: 'Sunday',    hrs: 'Closed',            open: false },
              ].map(({ day, hrs, open }) => (
                <div key={day} className="flex justify-between items-center py-3.5">
                  <span className="text-[14px] text-white/55 font-medium">{day}</span>
                  <span className={`text-[14px] font-semibold ${open ? 'text-white' : 'text-white/25'}`}>{hrs}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-primary/8 border border-primary/20 rounded-xl p-4 text-[13px] text-white/50 leading-relaxed">
              For urgent same-day service, call <strong className="text-primary">(876) 672-0125</strong> directly — we&apos;ll do our best to accommodate you.
            </div>
          </div>

          {/* Map + Address */}
          <div className="flex flex-col gap-4">
            {/* Map embed */}
            <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden flex-1 min-h-[300px]">
              <iframe
                title="WorldClass Auto Location"
                width="100%"
                height="100%"
                style={{ minHeight: '300px', border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=51B+Waltham+Park+Road,+Kingston,+Jamaica&z=15&output=embed"
              />
            </div>

            {/* Address card */}
            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6">
              <div className="text-[11px] font-bold text-white/30 uppercase tracking-[.1em] mb-4">Workshop Address</div>
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-white">51B Waltham Park Rd, Shop 8</div>
                  <div className="text-[14px] text-white/45">Padlock Plaza, Kingston, Jamaica</div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=51B+Waltham+Park+Rd+Shop+8+Padlock+Plaza+Jamaica"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary text-[13px] font-semibold mt-3 hover:underline"
                  >
                    Open in Google Maps <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div className="relative bg-[#111] border border-white/[0.07] rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(245,166,35,.06) 0%,transparent 60%)' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 text-primary text-[11px] font-bold tracking-[.12em] uppercase mb-4">
              <div className="w-6 h-px bg-primary" />
              Ready to Book?
              <div className="w-6 h-px bg-primary" />
            </div>
            <h2 className="text-[clamp(24px,4vw,44px)] font-black text-white tracking-tight mb-4">
              Schedule Your Service Today
            </h2>
            <p className="text-[16px] text-white/45 max-w-[440px] mx-auto mb-8 leading-relaxed">
              Book your appointment online in under 2 minutes — or call us directly and we&apos;ll sort you out right away.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-black font-bold px-8 py-3.5 rounded-xl text-[15px] transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/30"
              >
                <Calendar size={16} />
                Book Appointment
              </Link>
              <a
                href="tel:8766720125"
                className="inline-flex items-center gap-2 text-white/80 border border-white/15 hover:border-white/35 px-8 py-3.5 rounded-xl text-[15px] font-semibold transition-all hover:bg-white/5"
              >
                <Phone size={16} />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
