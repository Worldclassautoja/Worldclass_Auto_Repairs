'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MapPin, Calendar, Menu, X } from 'lucide-react';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparent]);

  const opaque = !transparent || scrolled;

  return (
    <>
      {/* ===== ANNOUNCE BAR ===== */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#111] text-white/70 text-[12px] border-b border-white/8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-[36px]">
          <div className="flex items-center gap-4">
            <a href="tel:8766720125" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={11} />
              876-672-0125
            </a>
            <span className="text-white/20">|</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <MapPin size={11} />
              51B Waltham Park Rd, Shop 8 Padlock Plaza
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </div>

      {/* ===== MAIN NAVBAR ===== */}
      <nav
        className={`fixed top-[36px] left-0 right-0 z-50 transition-all duration-300 ${
          opaque
            ? 'bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border-b border-white/[0.07] shadow-2xl shadow-black/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center h-[70px]">
          {/* Logo */}
          <Link href="/" className="text-[18px] font-black tracking-tight text-white">
            WorldClass <span className="text-primary">Auto</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7 ml-10">
            {[
              { href: '/#services', label: 'Services'    },
              { href: '/#about',    label: 'About'       },
              { href: '/#how',      label: 'How It Works'},
              { href: '/#reviews',  label: 'Reviews'     },
              { href: '/contact',   label: 'Contact'     },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[13px] font-medium text-white/60 hover:text-white relative group transition-colors duration-200"
              >
                {label}
                <span className="absolute left-0 -bottom-0.5 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <div className="flex-1" />

          {/* Phone */}
          <div className="hidden md:flex items-center gap-1.5 text-[13px] font-semibold text-white/50 mr-4">
            <Phone size={13} className="text-primary" />
            (876) 462-9709
          </div>

          {/* Book CTA */}
          <Link
            href="/booking"
            className="hidden md:inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-black text-[13px] font-bold px-5 py-2.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
          >
            <Calendar size={13} />
            Book Now
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden p-1.5 ml-auto text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#0d0d0d] border-t border-white/[0.07]">
            {[
              { href: '/',          label: 'Home'     },
              { href: '/#services', label: 'Services' },
              { href: '/#about',    label: 'About Us' },
              { href: '/#reviews',  label: 'Reviews'  },
              { href: '/contact',   label: 'Contact'  },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-4 text-[15px] font-medium text-white/60 border-b border-white/[0.05] hover:text-white hover:bg-white/[0.03]"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 text-[15px] font-bold text-primary border-b border-white/[0.05] hover:bg-primary/5"
            >
              Book Appointment →
            </Link>
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 text-[14px] font-medium text-white/30 hover:text-white/60"
            >
              Admin Portal
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
