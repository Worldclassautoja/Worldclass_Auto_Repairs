import Link from 'next/link';
import {
  Wrench, Activity, Disc3, Settings, Truck, Zap,
  Circle, Battery, Droplets, Wind, Search, Thermometer,
  Phone, Shield, Clock, CheckCircle, Star, Calendar,
} from 'lucide-react';

const SERVICES = [
  { icon: Wrench,      name: 'General Repairs & Maintenance',    desc: 'Comprehensive vehicle check-ups, fluid top-ups, filters, belts, and scheduled servicing.' },
  { icon: Activity,    name: 'Engine Diagnostics & Repair',       desc: 'Advanced computer diagnostics, fault code reading, and full engine rebuild services.' },
  { icon: Disc3,       name: 'Brake System Service',              desc: 'Brake pads, rotors, drums, calipers, and full hydraulic system inspections and repairs.' },
  { icon: Settings,    name: 'Transmission Service',              desc: 'Auto and manual gearbox servicing, fluid changes, clutch replacements, and overhauls.' },
  { icon: Truck,       name: 'Suspension & Steering',             desc: 'Shock absorbers, struts, tie rods, bushings, and full steering system diagnostics.' },
  { icon: Zap,         name: 'Electrical System Repair',          desc: 'Wiring, alternators, starters, lighting systems, sensors, and ECU troubleshooting.' },
  { icon: Circle,      name: 'Tyre Services & Wheel Alignment',   desc: 'Tyre fitting, balancing, puncture repair, rotation, and computerised wheel alignment.' },
  { icon: Battery,     name: 'Battery Testing & Replacement',     desc: 'Load testing, voltage checks, and supply of quality replacement batteries for all models.' },
  { icon: Droplets,    name: 'Oil & Fluid Services',              desc: 'Engine oil changes, coolant flushes, brake fluid, power steering fluid, and transmission oil.' },
  { icon: Wind,        name: 'Exhaust System Repair',             desc: 'Muffler replacement, exhaust pipe welding, catalytic converter service, and emissions checks.' },
  { icon: Search,      name: 'Pre-Purchase Vehicle Inspection',   desc: 'Thorough inspection report before you buy — mechanical, electrical, body, and safety checks.' },
  { icon: Thermometer, name: 'AC System Service',                 desc: 'Refrigerant recharge, compressor diagnostics, leak detection, and full AC system overhaul.' },
];

const STATS = [
  { num: '500+', label: 'Happy Customers' },
  { num: '12',   label: 'Expert Services' },
  { num: '15+',  label: 'Years Experience' },
  { num: '98%',  label: 'Satisfaction Rate' },
];

const STEPS = [
  { num: 1, title: 'Book Online',          body: 'Fill out our quick booking form with your vehicle details, service needed, and preferred date. Takes less than 2 minutes.' },
  { num: 2, title: 'Drop Off Your Vehicle', body: 'Bring your car to our workshop. Our team will inspect it, confirm the scope of work, and give you a clear quote.' },
  { num: 3, title: 'Pick Up & Drive',       body: "We'll call you the moment your vehicle is ready. Drive away knowing the job was done right the first time." },
];

const TESTIMONIALS = [
  { init: 'M', name: 'Marcus Thompson',   loc: 'Kingston, Jamaica',        text: '"WorldClass Auto sorted out my Toyota Corolla\'s transmission issue in a single day. The team was professional, explained everything clearly, and the price was fair. I won\'t take my car anywhere else."' },
  { init: 'D', name: 'Diane Brown',       loc: 'Spanish Town, St. Catherine', text: '"Had a serious electrical fault in my Honda Fit that two other mechanics couldn\'t fix. WorldClass found and repaired it same day. Honest, skilled, and fast — highly recommend."' },
  { init: 'K', name: 'Kevin Francis',     loc: 'Portmore, St. Catherine',  text: '"Booked online for a full brake service on my Nissan X-Trail. The work was done in 3 hours, and the car drives like new. The online booking system is so convenient!"' },
];

export default function HomePage() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c0c] via-[#1a0404] to-[#230808]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full" style={{ background: 'radial-gradient(ellipse,rgba(220,38,38,.13) 0%,transparent 65%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 pt-32">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/25 text-red-300 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-7">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Jamaica's Premier Auto Service
          </div>

          <h1 className="text-[clamp(38px,5.5vw,68px)] font-black text-white leading-[1.08] tracking-tight mb-5">
            Your Car Deserves<br />
            <span className="text-primary">World Class</span> Care
          </h1>

          <p className="text-[17px] text-white/60 leading-relaxed max-w-[520px] mb-10">
            Expert automotive repairs and maintenance right here in Jamaica. From quick diagnostics to full engine overhauls — professional service you can trust every time.
          </p>

          <div className="flex gap-3.5 flex-wrap mb-12">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-7 py-3.5 rounded-lg text-[15px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/40"
            >
              <Calendar size={16} />
              Book an Appointment
            </Link>
            <a
              href="#services"
              className="inline-flex items-center gap-2 text-white/85 border border-white/20 hover:border-white/50 hover:bg-white/7 px-7 py-3.5 rounded-lg text-[15px] font-semibold transition-all"
            >
              View Our Services
            </a>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            {[
              { Icon: Shield, text: 'Certified Mechanics'     },
              { Icon: Clock,  text: 'Same-Day Service'        },
              { Icon: CheckCircle, text: 'All Makes & Models' },
            ].map(({ Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2 text-white/50 text-[13px]">
                <Icon size={15} className="text-primary" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <div className="bg-primary py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={i} className={`text-center py-2 ${i < 3 ? 'border-r border-white/20' : ''}`}>
              <div className="text-[44px] font-black text-white leading-none mb-1.5 tracking-tight">{s.num}</div>
              <div className="text-[13px] text-white/78 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SERVICES ===== */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-primary px-3 py-1 rounded-full text-[11px] font-bold tracking-[.8px] uppercase mb-3.5">What We Do</div>
            <h2 className="text-[clamp(26px,3.5vw,42px)] font-black tracking-tight mb-4">Comprehensive Auto Services</h2>
            <p className="text-gray-500 text-[16px] leading-relaxed max-w-[580px] mx-auto">From routine maintenance to complex repairs — our certified technicians handle it all with precision and care.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map(({ icon: Icon, name, desc }) => (
              <div key={name} className="group bg-white border border-gray-200 rounded-xl p-6 hover:-translate-y-1 hover:shadow-xl hover:border-red-100 transition-all duration-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="w-11 h-11 bg-red-50 rounded-lg flex items-center justify-center text-primary mb-4">
                  <Icon size={20} />
                </div>
                <div className="text-[14px] font-bold mb-2">{name}</div>
                <div className="text-[12.5px] text-gray-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="hidden lg:flex relative">
              <div className="aspect-[4/3] w-full bg-gradient-to-br from-[#111] via-[#1a0505] to-[#2d0a0a] rounded-2xl flex items-center justify-center">
                <Wrench size={96} className="text-primary/30" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-white p-5 rounded-2xl shadow-2xl text-center">
                <div className="text-[36px] font-black leading-none">15+</div>
                <div className="text-[11px] font-semibold uppercase tracking-wide opacity-85 mt-1">Years in<br/>Business</div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 bg-red-50 text-primary px-3 py-1 rounded-full text-[11px] font-bold tracking-[.8px] uppercase mb-3.5">About Us</div>
              <h2 className="text-[clamp(26px,3.5vw,42px)] font-black tracking-tight mb-4">Trusted by Jamaican<br/>Drivers Since 2009</h2>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-3">WorldClass Auto Repairs has been serving the Jamaican motoring community for over 15 years. We combine modern diagnostic technology with experienced, qualified technicians to deliver repairs done right the first time.</p>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-7">Whether you drive a Japanese import, a local market vehicle, or a commercial fleet — we have the knowledge, equipment, and parts to get you back on the road with confidence.</p>

              <div className="flex flex-col gap-3.5">
                {[
                  'Certified mechanics with training in JDM and modern vehicles',
                  'Genuine and OEM-quality parts sourced locally and internationally',
                  'Transparent pricing — you\'ll know the full cost before any work begins',
                  'Online booking system — schedule your appointment in under 2 minutes',
                ].map(text => (
                  <div key={text} className="flex items-start gap-3 text-[14px] text-gray-600">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-primary px-3 py-1 rounded-full text-[11px] font-bold tracking-[.8px] uppercase mb-3.5">Simple Process</div>
            <h2 className="text-[clamp(26px,3.5vw,42px)] font-black tracking-tight mb-4">Book in 3 Easy Steps</h2>
            <p className="text-gray-500 text-[16px] leading-relaxed max-w-[560px] mx-auto">Getting your vehicle serviced has never been easier.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-11 left-[calc(16.667%+16px)] right-[calc(16.667%+16px)] h-0.5 bg-gradient-to-r from-red-100 via-primary to-red-100 opacity-50" />
            {STEPS.map(({ num, title, body }) => (
              <div key={num} className="group text-center relative z-10">
                <div className="w-[88px] h-[88px] border-2 border-gray-200 group-hover:border-primary group-hover:bg-primary rounded-full flex items-center justify-center mx-auto mb-6 bg-white transition-all duration-300">
                  <span className="text-[28px] font-black text-primary group-hover:text-white transition-colors">{num}</span>
                </div>
                <div className="text-[16px] font-bold mb-2.5">{title}</div>
                <p className="text-[14px] text-gray-500 leading-relaxed max-w-[260px] mx-auto">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-primary px-3 py-1 rounded-full text-[11px] font-bold tracking-[.8px] uppercase mb-3.5">Customer Reviews</div>
            <h2 className="text-[clamp(26px,3.5vw,42px)] font-black tracking-tight mb-4">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ init, name, loc, text }) => (
              <div key={name} className="bg-gray-50 border border-gray-200 hover:border-red-100 hover:shadow-md rounded-xl p-7 transition-all duration-200">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-5 italic">{text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-[16px] flex-shrink-0">{init}</div>
                  <div>
                    <div className="text-[14px] font-bold">{name}</div>
                    <div className="text-[12px] text-gray-500">{loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c0c] via-[#1a0404] to-[#7f1d1d]" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(220,38,38,.18) 0%,transparent 65%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-[clamp(28px,4vw,50px)] font-black text-white tracking-tight mb-4">Ready to Book Your Service?</h2>
          <p className="text-[17px] text-white/60 max-w-[480px] mx-auto mb-10 leading-relaxed">Schedule your appointment online in under 2 minutes. Our team is ready to get your vehicle back in top shape.</p>
          <div className="flex justify-center gap-3.5 flex-wrap">
            <Link href="/booking" className="inline-flex items-center gap-2 bg-white text-primary hover:bg-gray-50 px-8 py-3.5 rounded-lg text-[15px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-xl">
              <Calendar size={16} />
              Book Appointment Now
            </Link>
            <a href="tel:8764629709" className="inline-flex items-center gap-2 text-white/90 border border-white/25 hover:border-white/60 hover:bg-white/8 px-8 py-3.5 rounded-lg text-[15px] font-semibold transition-all">
              <Phone size={16} />
              Call (876) 462-9709
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
