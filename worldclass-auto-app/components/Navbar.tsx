'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Calendar, Menu, X } from 'lucide-react';

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        opaque ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center h-[70px]">
        {/* Logo */}
        <Link href="/" className={`text-[18px] font-black tracking-tight ${opaque ? 'text-gray-900' : 'text-white'}`}>
          WorldClass <span className="text-primary">Auto</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7 ml-10">
          {[
            { href: '/#services',    label: 'Services'     },
            { href: '/#about',       label: 'About'        },
            { href: '/#how',         label: 'How It Works' },
            { href: '/#reviews',     label: 'Reviews'      },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium relative group transition-colors duration-200 ${
                opaque ? 'text-gray-600 hover:text-primary' : 'text-white/85 hover:text-white'
              }`}
            >
              {label}
              <span className="absolute left-0 -bottom-0.5 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="flex-1" />

        {/* Phone */}
        <div className={`hidden md:flex items-center gap-1.5 text-sm font-semibold mr-4 ${opaque ? 'text-gray-500' : 'text-white/75'}`}>
          <Phone size={13} />
          (876) 462-9709
        </div>

        {/* Book CTA */}
        <Link
          href="/booking"
          className="hidden md:inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-[13px] font-bold px-5 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/30"
        >
          <Calendar size={13} />
          Book Now
        </Link>

        {/* Hamburger */}
        <button
          className={`md:hidden p-1.5 ml-auto transition-colors ${opaque ? 'text-gray-800' : 'text-white'}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          {[
            { href: '/',           label: 'Home'              },
            { href: '/#services',  label: 'Services'          },
            { href: '/#about',     label: 'About Us'          },
            { href: '/#reviews',   label: 'Reviews'           },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3.5 text-[15px] font-medium text-gray-700 border-b border-gray-100 hover:bg-gray-50"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/booking"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-3.5 text-[15px] font-bold text-primary hover:bg-red-50"
          >
            Book Appointment →
          </Link>
        </div>
      )}
    </nav>
  );
}
