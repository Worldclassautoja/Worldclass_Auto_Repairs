import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] pt-16 pb-0">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand */}
          <div>
            <div className="text-white text-[20px] font-black mb-3">
              WorldClass <span className="text-primary">Auto</span>
            </div>
            <p className="text-white/40 text-[13px] leading-relaxed max-w-[260px] mb-5">
              Jamaica's trusted automotive repair and maintenance specialists. Quality service you can count on.
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-white/50 text-[13px]">
                <Phone size={13} className="text-primary flex-shrink-0" />
                (876) 462-9709
              </div>
              <div className="flex items-center gap-2 text-white/50 text-[13px]">
                <Mail size={13} className="text-primary flex-shrink-0" />
                worldclassautorepairs1@gmail.com
              </div>
              <div className="flex items-center gap-2 text-white/50 text-[13px]">
                <MapPin size={13} className="text-primary flex-shrink-0" />
                Jamaica
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[11px] font-bold text-white/90 uppercase tracking-[1px] mb-4">Services</h4>
            <ul className="flex flex-col gap-2.5">
              {['General Repairs', 'Engine Diagnostics', 'Brake Service', 'Transmission', 'Electrical Repair', 'AC Service'].map(s => (
                <li key={s}><Link href="/#services" className="text-[13px] text-white/40 hover:text-white/90 transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-bold text-white/90 uppercase tracking-[1px] mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: '/',         label: 'Home'         },
                { href: '/#about',   label: 'About Us'     },
                { href: '/#how',     label: 'How It Works' },
                { href: '/#reviews', label: 'Reviews'      },
                { href: '/booking',  label: 'Book Online'  },
              ].map(({ href, label }) => (
                <li key={href}><Link href={href} className="text-[13px] text-white/40 hover:text-white/90 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-[11px] font-bold text-white/90 uppercase tracking-[1px] mb-4">Opening Hours</h4>
            <div className="flex flex-col gap-3 text-[13px]">
              <div>
                <div className="text-white/40">Monday – Friday</div>
                <div className="text-white/75 font-semibold">8:00 AM – 6:00 PM</div>
              </div>
              <div>
                <div className="text-white/40">Saturday</div>
                <div className="text-white/75 font-semibold">9:00 AM – 4:00 PM</div>
              </div>
              <div>
                <div className="text-white/40">Sunday</div>
                <div className="text-white/40">Closed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center py-5 flex-wrap gap-2 text-[12px] text-white/25">
          <span>&copy; {new Date().getFullYear()} WorldClass Auto Repairs. All rights reserved.</span>
          <span>Made with care in Jamaica 🇯🇲</span>
        </div>
      </div>
    </footer>
  );
}
