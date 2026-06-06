import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#000] border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-white/[0.06]">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="text-white text-[22px] font-black tracking-tight mb-1">
              WorldClass <span className="text-primary">Auto</span>
            </div>
            <div className="text-[11px] text-white/30 font-medium tracking-[.1em] uppercase mb-5">
              Jamaica&apos;s Premier Auto Service
            </div>
            <p className="text-white/35 text-[13px] leading-relaxed mb-7 max-w-[240px]">
              Professional automotive repairs and maintenance serving Jamaica since 2009. Quality you can count on, every time.
            </p>
            <div className="flex flex-col gap-3">
              <a href="tel:8764629709" className="flex items-center gap-2.5 text-white/40 hover:text-white/80 text-[13px] transition-colors">
                <Phone size={13} className="text-primary flex-shrink-0" />
                (876) 462-9709
              </a>
              <a href="tel:8766720125" className="flex items-center gap-2.5 text-white/40 hover:text-white/80 text-[13px] transition-colors">
                <MessageCircle size={13} className="text-primary flex-shrink-0" />
                (876) 462-9709 WhatsApp
              </a>
              <a href="mailto:worldclassautorepairs1@gmail.com" className="flex items-center gap-2.5 text-white/40 hover:text-white/80 text-[13px] transition-colors">
                <Mail size={13} className="text-primary flex-shrink-0" />
                worldclassautorepairs1@gmail.com
              </a>
              <div className="flex items-start gap-2.5 text-white/40 text-[13px]">
                <MapPin size={13} className="text-primary flex-shrink-0 mt-0.5" />
                51B Waltham Park Rd, Shop 8<br />Padlock Plaza, Kingston
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[11px] font-bold text-white/60 uppercase tracking-[.1em] mb-5">Services</h4>
            <ul className="flex flex-col gap-3">
              {[
                'General Repairs & Maintenance',
                'Engine Diagnostics',
                'Brake System Service',
                'Transmission Service',
                'Electrical Systems',
                'AC System Service',
                'Tyre & Wheel Alignment',
                'Oil & Fluid Services',
              ].map(s => (
                <li key={s}>
                  <Link href="/#services" className="text-[13px] text-white/35 hover:text-white/75 transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-bold text-white/60 uppercase tracking-[.1em] mb-5">Company</h4>
            <ul className="flex flex-col gap-3">
              {[
                { href: '/',         label: 'Home'          },
                { href: '/#about',   label: 'About Us'      },
                { href: '/#how',     label: 'How It Works'  },
                { href: '/#reviews', label: 'Client Reviews' },
                { href: '/booking',  label: 'Book Online'   },
                { href: '/admin',      label: 'Admin Portal'      },
                { href: '/technician', label: 'Technician Portal' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[13px] text-white/35 hover:text-white/75 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-[11px] font-bold text-white/60 uppercase tracking-[.1em] mb-5">Opening Hours</h4>
            <div className="flex flex-col gap-4 text-[13px]">
              <div>
                <div className="text-white/35 mb-0.5">Monday – Friday</div>
                <div className="text-white/75 font-semibold">8:00 AM – 6:00 PM</div>
              </div>
              <div>
                <div className="text-white/35 mb-0.5">Saturday</div>
                <div className="text-white/75 font-semibold">8:00 AM – 5:00 PM</div>
              </div>
              <div>
                <div className="text-white/35 mb-0.5">Sunday</div>
                <div className="text-white/30">Closed</div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-black text-[13px] font-bold px-5 py-2.5 rounded-lg transition-all"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-6 gap-2 text-[12px] text-white/20">
          <span>&copy; {new Date().getFullYear()} WorldClass Auto Repairs. All rights reserved.</span>
          <span>Serving all parishes across Jamaica 🇯🇲</span>
        </div>
      </div>
    </footer>
  );
}
