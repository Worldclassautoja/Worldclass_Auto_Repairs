import Link from 'next/link';
import {
  Wrench, Activity, Disc3, Settings, Truck, Zap,
  Circle, Battery, Droplets, Wind, Search, Thermometer,
  Phone, Shield, Clock, CheckCircle, Star, Calendar,
  ArrowRight, MapPin,
} from 'lucide-react';

const SERVICES = [
  { icon: Wrench,      name: 'General Repairs',           desc: 'Comprehensive vehicle check-ups, fluid top-ups, filters, belts, and scheduled servicing.' },
  { icon: Activity,    name: 'Engine Diagnostics',         desc: 'Advanced computer diagnostics, fault code reading, and full engine rebuild services.' },
  { icon: Disc3,       name: 'Brake System Service',       desc: 'Brake pads, rotors, drums, calipers, and full hydraulic system inspections and repairs.' },
  { icon: Settings,    name: 'Transmission Service',       desc: 'Auto and manual gearbox servicing, fluid changes, clutch replacements, and overhauls.' },
  { icon: Truck,       name: 'Suspension & Steering',      desc: 'Shock absorbers, struts, tie rods, bushings, and full steering system diagnostics.' },
  { icon: Zap,         name: 'Electrical Systems',         desc: 'Wiring, alternators, starters, lighting systems, sensors, and ECU troubleshooting.' },
  { icon: Circle,      name: 'Tyre & Wheel Alignment',     desc: 'Tyre fitting, balancing, puncture repair, rotation, and computerised alignment.' },
  { icon: Battery,     name: 'Battery Service',            desc: 'Load testing, voltage checks, and quality replacement batteries for all models.' },
  { icon: Droplets,    name: 'Oil & Fluid Services',       desc: 'Engine oil changes, coolant flushes, brake fluid, power steering, and transmission oil.' },
  { icon: Wind,        name: 'Exhaust System Repair',      desc: 'Muffler replacement, pipe welding, catalytic converter service, and emissions checks.' },
  { icon: Search,      name: 'Pre-Purchase Inspection',    desc: 'Thorough inspection report before you buy — mechanical, electrical, body, and safety.' },
  { icon: Thermometer, name: 'AC System Service',          desc: 'Refrigerant recharge, compressor diagnostics, leak detection, and full AC overhaul.' },
];

const STATS = [
  { num: '500+', label: 'Vehicles Serviced' },
  { num: '15+',  label: 'Years of Excellence' },
  { num: '12',   label: 'Service Categories' },
  { num: '98%',  label: 'Satisfaction Rate' },
];

const VEHICLES = ['Toyota', 'Honda', 'Nissan', 'Mitsubishi', 'Mazda', 'Hyundai', 'Kia', 'Suzuki', 'Ford', 'BMW', 'Mercedes'];

const PROCESS = [
  { num: '01', title: 'Book Online',           body: 'Fill out our quick booking form with your vehicle details, service type, and preferred date. Available 24/7 — takes under 2 minutes.' },
  { num: '02', title: 'Drop Off Your Vehicle', body: 'Bring your car to our workshop. Our team inspects it, confirms the scope of work, and provides a clear quote before any work begins.' },
  { num: '03', title: 'Pick Up & Drive Away',  body: 'We contact you the moment your vehicle is ready. Drive away with confidence knowing every job was completed to the highest standard.' },
];

const TESTIMONIALS = [
  { init: 'M', name: 'Marcus Thompson',  loc: 'Kingston',             rating: 5, text: 'WorldClass Auto sorted out my Toyota Corolla\'s transmission issue in a single day. Professional, clear communication, and fair pricing. I won\'t take my car anywhere else.' },
  { init: 'D', name: 'Diane Brown',      loc: 'Spanish Town',         rating: 5, text: 'Had a serious electrical fault that two other mechanics couldn\'t diagnose. WorldClass found and fixed it same day. Honest, skilled, and incredibly fast.' },
  { init: 'K', name: 'Kevin Francis',    loc: 'Portmore',             rating: 5, text: 'Booked online for a full brake service on my Nissan X-Trail. The team was ready when I arrived, work done in 3 hours. The car drives like new — truly world class.' },
];

export default function HomePage() {
  return (
    <div className="bg-[#0A0A0A] overflow-x-hidden">

      {/* ================================================================
          HERO
      ================================================================ */}
      <section className="relative min-h-screen flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#0f0800]" />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(rgba(245,166,35,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,166,35,.03) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

        {/* Glow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(245,166,35,.07) 0%,transparent 65%)' }} />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-36 pb-24 flex flex-col lg:flex-row items-center gap-16">

          {/* LEFT */}
          <div className="flex-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/8 text-primary text-[11px] font-bold tracking-[.12em] uppercase px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              Jamaica&apos;s Premier Automotive Service
            </div>

            <h1 className="text-[clamp(40px,6vw,76px)] font-black text-white leading-[1.05] tracking-[-0.02em] mb-6">
              Your Car Deserves<br />
              <span className="text-primary">World Class</span> Care
            </h1>

            <p className="text-[17px] text-white/55 leading-relaxed max-w-[500px] mb-10">
              Expert automotive repairs and maintenance right here in Jamaica.
              From quick diagnostics to full engine overhauls — certified service
              you can trust, every time.
            </p>

            <div className="flex gap-4 flex-wrap mb-14">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-black font-bold px-8 py-4 rounded-xl text-[15px] transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/30"
              >
                <Calendar size={16} />
                Book an Appointment
              </Link>
              <a
                href="#services"
                className="inline-flex items-center gap-2 text-white/80 border border-white/15 hover:border-white/35 px-8 py-4 rounded-xl text-[15px] font-semibold transition-all hover:bg-white/5"
              >
                Our Services
                <ArrowRight size={15} />
              </a>
            </div>

            {/* Trust pills */}
            <div className="flex items-center gap-6 flex-wrap">
              {[
                { Icon: Shield,      text: 'Certified Mechanics' },
                { Icon: Clock,       text: 'Same-Day Service'    },
                { Icon: CheckCircle, text: 'All Makes & Models'  },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/40 text-[13px]">
                  <Icon size={14} className="text-primary" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — decorative wheel graphic */}
          <div className="hidden lg:flex flex-shrink-0 w-[420px] h-[420px] relative items-center justify-center">
            <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Outer ring */}
              <circle cx="210" cy="210" r="200" stroke="#F5A623" strokeWidth="0.5" strokeOpacity="0.15" />
              <circle cx="210" cy="210" r="160" stroke="#F5A623" strokeWidth="1"   strokeOpacity="0.12" />
              <circle cx="210" cy="210" r="110" stroke="#F5A623" strokeWidth="1.5" strokeOpacity="0.20" />
              <circle cx="210" cy="210" r="55"  stroke="#F5A623" strokeWidth="2"   strokeOpacity="0.30" fill="rgba(245,166,35,0.06)" />
              <circle cx="210" cy="210" r="16"  fill="#F5A623" fillOpacity="0.35" />
              {/* Spokes */}
              {[0,60,120,180,240,300].map(a => {
                const rad = (a * Math.PI) / 180;
                return (
                  <line key={a}
                    x1={210 + 16 * Math.cos(rad)} y1={210 + 16 * Math.sin(rad)}
                    x2={210 + 200 * Math.cos(rad)} y2={210 + 200 * Math.sin(rad)}
                    stroke="#F5A623" strokeWidth="0.8" strokeOpacity="0.15"
                  />
                );
              })}
              {/* Tick marks */}
              {Array.from({length: 36}).map((_, i) => {
                const a = (i * 10 * Math.PI) / 180;
                const r1 = 195, r2 = i % 3 === 0 ? 180 : 188;
                return (
                  <line key={i}
                    x1={210 + r1 * Math.cos(a)} y1={210 + r1 * Math.sin(a)}
                    x2={210 + r2 * Math.cos(a)} y2={210 + r2 * Math.sin(a)}
                    stroke="#F5A623" strokeWidth={i % 3 === 0 ? 1.5 : 0.8} strokeOpacity={i % 3 === 0 ? 0.4 : 0.2}
                  />
                );
              })}
            </svg>

            {/* Floating stat badges */}
            <div className="absolute top-6 right-4 bg-[#111] border border-white/10 rounded-2xl px-5 py-4 text-center shadow-2xl">
              <div className="text-3xl font-black text-primary leading-none">500+</div>
              <div className="text-[11px] text-white/50 mt-1 font-medium">Happy Clients</div>
            </div>
            <div className="absolute bottom-6 left-4 bg-[#111] border border-white/10 rounded-2xl px-5 py-4 text-center shadow-2xl">
              <div className="text-3xl font-black text-primary leading-none">15+</div>
              <div className="text-[11px] text-white/50 mt-1 font-medium">Years Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          VEHICLES WE SERVICE
      ================================================================ */}
      <div className="border-y border-white/[0.06] bg-[#0d0d0d] py-5 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-bold text-white/30 tracking-[.1em] uppercase">Vehicles We Service</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {VEHICLES.map(v => (
              <span key={v} className="text-[13px] font-semibold text-white/40 hover:text-white/70 transition-colors cursor-default">{v}</span>
            ))}
            <span className="text-[13px] font-semibold text-primary/60">& many more</span>
          </div>
        </div>
      </div>

      {/* ================================================================
          STATS
      ================================================================ */}
      <div className="bg-primary py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 divide-x divide-black/20">
          {STATS.map(({ num, label }) => (
            <div key={label} className="text-center py-2 px-4">
              <div className="text-[52px] font-black text-black leading-none tracking-tight mb-1">{num}</div>
              <div className="text-[12px] font-bold text-black/60 uppercase tracking-[.08em]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================
          SERVICES
      ================================================================ */}
      <section id="services" className="py-28 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-primary text-[11px] font-bold tracking-[.12em] uppercase mb-4">
                <div className="w-6 h-px bg-primary" />
                What We Do
              </div>
              <h2 className="text-[clamp(28px,4vw,52px)] font-black text-white tracking-tight leading-tight">
                Comprehensive<br />Automotive Services
              </h2>
            </div>
            <p className="text-white/45 text-[15px] leading-relaxed max-w-[380px]">
              From routine maintenance to complex repairs — our certified technicians handle it all with precision and care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {SERVICES.map(({ icon: Icon, name, desc }) => (
              <div
                key={name}
                className="group relative bg-[#111] border border-white/[0.07] rounded-2xl p-6 hover:border-primary/30 hover:bg-[#141414] transition-all duration-300 overflow-hidden cursor-default"
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary mb-5 group-hover:bg-primary/15 transition-colors">
                  <Icon size={19} />
                </div>
                <div className="text-[14px] font-bold text-white mb-2">{name}</div>
                <div className="text-[12.5px] text-white/40 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          ABOUT
      ================================================================ */}
      <section id="about" className="py-28 bg-[#0d0d0d] border-y border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Visual side */}
            <div className="relative">
              <div className="aspect-square max-w-[460px] bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-3xl border border-white/[0.06] flex items-center justify-center overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0"
                  style={{ backgroundImage: 'radial-gradient(circle at 2px 2px,rgba(245,166,35,.08) 1px,transparent 0)', backgroundSize: '28px 28px' }} />
                {/* Large icon */}
                <Wrench size={120} className="text-primary/15 relative z-10" />
              </div>

              {/* Floating cards */}
              <div className="absolute -bottom-6 -right-4 lg:right-0 bg-primary rounded-2xl px-6 py-5 shadow-2xl shadow-primary/20">
                <div className="text-[38px] font-black text-black leading-none">98%</div>
                <div className="text-[11px] font-bold text-black/65 uppercase tracking-wide mt-1">Satisfaction Rate</div>
              </div>

              <div className="absolute -top-4 -right-4 lg:right-0 bg-[#111] border border-white/10 rounded-2xl px-6 py-5 shadow-2xl">
                <div className="text-[38px] font-black text-white leading-none">2009</div>
                <div className="text-[11px] font-medium text-white/40 mt-1">Established</div>
              </div>
            </div>

            {/* Text side */}
            <div>
              <div className="inline-flex items-center gap-2 text-primary text-[11px] font-bold tracking-[.12em] uppercase mb-4">
                <div className="w-6 h-px bg-primary" />
                About Us
              </div>
              <h2 className="text-[clamp(28px,4vw,48px)] font-black text-white tracking-tight leading-tight mb-6">
                Trusted by Jamaican<br />Drivers Since 2009
              </h2>
              <p className="text-white/50 text-[15px] leading-relaxed mb-4">
                WorldClass Auto has been serving the Jamaican motoring community for over 15 years. We combine modern diagnostic technology with experienced, qualified technicians to deliver repairs done right the first time.
              </p>
              <p className="text-white/50 text-[15px] leading-relaxed mb-10">
                Whether you drive a Japanese import, a local market vehicle, or a commercial fleet — we have the knowledge, equipment, and parts to get you back on the road with confidence.
              </p>

              <div className="flex flex-col gap-4">
                {[
                  { title: 'Certified mechanics',      desc: 'Qualified technicians with training in JDM and modern vehicles' },
                  { title: 'OEM-quality parts',        desc: 'Genuine parts sourced locally and internationally' },
                  { title: 'Transparent pricing',      desc: 'Full cost confirmed before any work begins — no surprises' },
                  { title: 'Online booking available', desc: 'Schedule your appointment in under 2 minutes, 24/7' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={11} className="text-black" />
                    </div>
                    <div>
                      <span className="text-[14px] font-bold text-white">{title}</span>
                      <span className="text-[14px] text-white/45"> — {desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          PROCESS
      ================================================================ */}
      <section id="how" className="py-28 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary text-[11px] font-bold tracking-[.12em] uppercase mb-4">
              <div className="w-6 h-px bg-primary" />
              Our Process
              <div className="w-6 h-px bg-primary" />
            </div>
            <h2 className="text-[clamp(28px,4vw,52px)] font-black text-white tracking-tight">Service in Three Steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
            {PROCESS.map(({ num, title, body }) => (
              <div key={num} className="bg-[#0d0d0d] p-10 relative group hover:bg-[#111] transition-colors">
                <div className="text-[72px] font-black text-primary/10 leading-none mb-6 group-hover:text-primary/20 transition-colors">{num}</div>
                <div className="text-[18px] font-bold text-white mb-3">{title}</div>
                <p className="text-[14px] text-white/45 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          TESTIMONIALS
      ================================================================ */}
      <section id="reviews" className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-primary text-[11px] font-bold tracking-[.12em] uppercase mb-4">
              <div className="w-6 h-px bg-primary" />
              Client Reviews
              <div className="w-6 h-px bg-primary" />
            </div>
            <h2 className="text-[clamp(28px,4vw,48px)] font-black text-gray-900 tracking-tight mb-3">What Our Customers Say</h2>
            <p className="text-gray-500 text-[16px]">Hear from Jamaican drivers who trust WorldClass Auto with their vehicles.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ init, name, loc, rating, text }) => (
              <div key={name} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-[14.5px] text-gray-600 leading-relaxed mb-7">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3.5 pt-6 border-t border-gray-100">
                  <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-black font-black text-[16px] flex-shrink-0 group-hover:scale-105 transition-transform">
                    {init}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-gray-900">{name}</div>
                    <div className="text-[12px] text-gray-400 flex items-center gap-1">
                      <MapPin size={10} />
                      {loc}, Jamaica
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA
      ================================================================ */}
      <section className="relative py-28 overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#000] via-[#0a0500] to-[#0a0a0a]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(ellipse,rgba(245,166,35,.12) 0%,transparent 65%)' }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 text-primary text-[11px] font-bold tracking-[.12em] uppercase mb-6">
            <div className="w-6 h-px bg-primary" />
            Get Started Today
            <div className="w-6 h-px bg-primary" />
          </div>
          <h2 className="text-[clamp(32px,5vw,58px)] font-black text-white tracking-tight leading-tight mb-5">
            Ready to Book<br />Your Service?
          </h2>
          <p className="text-[17px] text-white/50 max-w-[480px] mx-auto mb-12 leading-relaxed">
            Schedule online in under 2 minutes. Our certified team is ready to get your vehicle performing at its best.
          </p>
          <div className="flex justify-center gap-4 flex-wrap mb-10">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-black font-bold px-10 py-4 rounded-xl text-[15px] transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/30"
            >
              <Calendar size={16} />
              Book Appointment
            </Link>
            <a
              href="tel:8764629709"
              className="inline-flex items-center gap-2 text-white/85 border border-white/20 hover:border-white/50 px-10 py-4 rounded-xl text-[15px] font-semibold transition-all hover:bg-white/5"
            >
              <Phone size={16} />
              (876) 462-9709
            </a>
          </div>

          <div className="flex justify-center items-center gap-2 text-white/30 text-[13px]">
            <MapPin size={13} className="text-primary/50" />
            51B Waltham Park Rd, Shop 8 Padlock Plaza, Kingston, Jamaica
          </div>
        </div>
      </section>

    </div>
  );
}
