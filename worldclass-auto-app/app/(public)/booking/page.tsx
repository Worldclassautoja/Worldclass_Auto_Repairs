'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, Phone, Mail, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MODELS: Record<string, string[]> = {
  Toyota:     ['Aqua','Allion','Axio','Camry','CHR','Corolla','Fielder','Harrier','Hilux','Land Cruiser','Mark X','Prado','Premio','RAV4','Vitz','Wish','Yaris'],
  Honda:      ['Accord','City','Civic','CR-V','Fit / Jazz','Freed','HR-V','Odyssey','Stepwagon','Stream','Vezel'],
  Nissan:     ['AD Wagon','Almera','Caravan','Frontier','Leaf','March','Micra','Note','Pathfinder','Sentra','Tiida','X-Trail'],
  Mitsubishi: ['ASX','Colt','Eclipse Cross','Galant','Lancer','Mirage','Outlander','Pajero','Space Star'],
  Mazda:      ['Atenza','Axela','Biante','CX-3','CX-5','Demio','Mazda 2','Mazda 3','Mazda 6'],
  Hyundai:    ['Accent','Creta','Elantra','i10','i20','Santa Fe','Sonata','Tucson'],
  Kia:        ['Cerato','Optima','Picanto','Rio','Seltos','Sorento','Soul','Sportage','Stinger'],
  Suzuki:     ['Alto','Baleno','Cultus','Ignis','Jimny','Swift','SX4','Vitara'],
  Ford:       ['Bronco','EcoSport','Edge','Explorer','F-150','Focus','Ranger'],
};

const SERVICES = [
  'General Repairs & Maintenance','Engine Diagnostics & Repair','Brake System Service',
  'Transmission Service','Suspension & Steering','Electrical System Repair',
  'Tyre Services & Wheel Alignment','Battery Testing & Replacement','Oil & Fluid Services',
  'Exhaust System Repair','Pre-Purchase Vehicle Inspection','AC System Service',
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function genRef() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'WCA-' + Array.from({ length: 6 }, () => c[Math.floor(Math.random() * c.length)]).join('');
}

function formatDate(d: Date) {
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function BookingPage() {
  const [form, setForm] = useState({
    name: '', email: '', areaCode: '+876', phone: '',
    make: '', model: '', modelOther: '', service: '', description: '',
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calOpen, setCalOpen]   = useState(false);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState<string | null>(null);
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setCalOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const today = new Date(); today.setHours(0,0,0,0);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow    = new Date(viewYear, viewMonth, 1).getDay();

  function prevMonth() {
    const d = new Date(viewYear, viewMonth - 1, 1);
    const n = new Date(); n.setDate(1); n.setHours(0,0,0,0);
    if (d >= n) { setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }
  }
  function nextMonth() {
    const d = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(d.getFullYear()); setViewMonth(d.getMonth());
  }

  function selectDay(day: number) {
    const date = new Date(viewYear, viewMonth, day);
    setSelectedDate(date);
    setCalOpen(false);
    setErrors(e => ({ ...e, date: '' }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address.';
    if (form.phone.replace(/\D/g,'').length < 7) e.phone = 'Please enter a valid phone number.';
    if (!form.make) e.make = 'Please select your vehicle make.';
    if (form.make === 'Other' ? !form.modelOther.trim() : !form.model) e.model = 'Please select your vehicle model.';
    if (!form.service) e.service = 'Please select a service type.';
    if (!selectedDate) e.date = 'Please select a preferred date.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const body = {
      name: form.name.trim(),
      phone: (form.areaCode + form.phone).replace(/\D/g,''),
      email: form.email.trim(),
      vehicle_make: form.make,
      vehicle_model: form.make === 'Other' ? form.modelOther.trim() : form.model,
      service_type: form.service,
      preferred_date: selectedDate!.toISOString().split('T')[0],
      description: form.description.trim() || null,
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSuccess(genRef());
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 pb-20">
          <div className="max-w-md w-full mx-4 bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-[22px] font-black text-green-700 mb-2">Booking Submitted!</h2>
            <p className="text-[14px] text-green-800/80 leading-relaxed mb-1">
              Thank you for booking with WorldClass Auto Repairs.<br/>
              We'll contact you within 24 hours to confirm.
            </p>
            <div className="mt-4 text-[13px] text-green-700 font-bold">
              Your reference: <span className="bg-green-50 px-2 py-0.5 rounded-md">{success}</span>
            </div>
            <a href="/" className="mt-8 inline-flex items-center gap-1.5 text-primary font-semibold text-sm">← Back to Home</a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#0c0c0c] via-[#1a0404] to-[#230808] pt-32 pb-14 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 80%,rgba(220,38,38,.1) 0%,transparent 60%)' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-red-600/10 border border-red-600/25 text-red-300 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4">Online Booking</div>
          <h1 className="text-[clamp(30px,4vw,48px)] font-black text-white tracking-tight mb-3">Book Your Appointment</h1>
          <p className="text-[16px] text-white/55">Fill in the details below and we'll confirm within 24 hours.</p>
        </div>
      </div>

      {/* Body */}
      <div className="bg-gray-50 py-16 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">

            {/* Form card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
              <div className="text-[18px] font-black mb-7">Your Booking Details</div>

              <form onSubmit={handleSubmit} noValidate>
                {/* Name */}
                <Field label="Full Name" required error={errors.name}>
                  <input className={input(errors.name)} type="text" placeholder="e.g. John Brown" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                </Field>

                {/* Email + Phone */}
                <div className="grid sm:grid-cols-2 gap-4 mb-5">
                  <Field label="Email Address" required error={errors.email}>
                    <input className={input(errors.email)} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                  </Field>
                  <Field label="Phone Number" required error={errors.phone}>
                    <div className="flex gap-2">
                      <div className="relative w-[115px] flex-shrink-0">
                        <select className={input() + ' pr-8 cursor-pointer'} value={form.areaCode} onChange={e => setForm(f => ({...f, areaCode: e.target.value}))}>
                          <option value="+876">🇯🇲 +876</option>
                          <option value="+658">🇯🇲 +658</option>
                        </select>
                        <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                      </div>
                      <input className={input(errors.phone) + ' flex-1'} type="tel" placeholder="462-9709" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
                    </div>
                  </Field>
                </div>

                {/* Make + Model */}
                <div className="grid sm:grid-cols-2 gap-4 mb-5">
                  <Field label="Vehicle Make" required error={errors.make}>
                    <div className="relative">
                      <select className={input(errors.make) + ' cursor-pointer pr-8'}
                        value={form.make}
                        onChange={e => setForm(f => ({...f, make: e.target.value, model: '', modelOther: ''}))}>
                        <option value="">Select make...</option>
                        {Object.keys(MODELS).map(m => <option key={m}>{m}</option>)}
                        <option>Other</option>
                      </select>
                      <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                    </div>
                  </Field>
                  <Field label="Vehicle Model" required error={errors.model}>
                    {form.make === 'Other' ? (
                      <input className={input(errors.model)} type="text" placeholder="Enter vehicle model" value={form.modelOther} onChange={e => setForm(f => ({...f, modelOther: e.target.value}))} />
                    ) : (
                      <div className="relative">
                        <select className={input(errors.model) + ' cursor-pointer pr-8'} value={form.model} onChange={e => setForm(f => ({...f, model: e.target.value}))} disabled={!form.make}>
                          <option value="">{form.make ? 'Select model...' : 'Select make first...'}</option>
                          {(MODELS[form.make] ?? []).map(m => <option key={m}>{m}</option>)}
                        </select>
                        <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                      </div>
                    )}
                  </Field>
                </div>

                {/* Service */}
                <Field label="Service Type" required error={errors.service}>
                  <div className="relative">
                    <select className={input(errors.service) + ' cursor-pointer pr-8'} value={form.service} onChange={e => setForm(f => ({...f, service: e.target.value}))}>
                      <option value="">Select a service...</option>
                      {SERVICES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                  </div>
                </Field>

                {/* Date picker */}
                <Field label="Preferred Date" required error={errors.date}>
                  <div className="relative" ref={calRef}>
                    <button
                      type="button"
                      onClick={() => setCalOpen(o => !o)}
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-left text-sm flex items-center justify-between transition-all ${errors.date ? 'border-red-400' : calOpen ? 'border-primary shadow-[0_0_0_3px_rgba(220,38,38,.09)]' : 'border-gray-200 hover:border-primary'}`}
                    >
                      {selectedDate
                        ? <span className="font-medium text-gray-900">{formatDate(selectedDate)}</span>
                        : <span className="text-gray-400">Choose a date (weekdays only)...</span>
                      }
                      <Calendar size={15} className="text-gray-400" />
                    </button>

                    {calOpen && (
                      <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-[300px] bg-white border border-gray-200 rounded-xl shadow-2xl p-4">
                        <div className="flex items-center justify-between mb-3.5">
                          <button type="button" onClick={prevMonth} className="w-7 h-7 border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors"><ChevronLeft size={14} /></button>
                          <span className="text-[14px] font-bold">{MONTHS[viewMonth]} {viewYear}</span>
                          <button type="button" onClick={nextMonth} className="w-7 h-7 border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors"><ChevronRight size={14} /></button>
                        </div>
                        <div className="grid grid-cols-7 mb-1.5">
                          {DAYS.map(d => <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1 uppercase">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-0.5">
                          {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
                          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                            const date = new Date(viewYear, viewMonth, d); date.setHours(0,0,0,0);
                            const dow = date.getDay();
                            const isWknd = dow === 0 || dow === 6;
                            const isPast = date < today;
                            const isToday = date.getTime() === today.getTime();
                            const isSel  = selectedDate?.getTime() === date.getTime();
                            const disabled = isWknd || isPast;
                            return (
                              <button
                                key={d} type="button"
                                disabled={disabled}
                                onClick={() => selectDay(d)}
                                className={`aspect-square flex items-center justify-center text-[13px] font-medium rounded-md transition-colors
                                  ${isSel ? 'bg-primary text-white' : ''}
                                  ${isToday && !isSel ? 'border-2 border-primary text-primary font-bold' : ''}
                                  ${!disabled && !isSel && !isToday ? 'hover:bg-red-50 hover:text-primary' : ''}
                                  ${disabled ? 'text-gray-200 cursor-not-allowed' : 'cursor-pointer'}
                                `}
                              >{d}</button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </Field>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-[13px] font-semibold text-gray-800 mb-1.5">
                    Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any extra details about your vehicle issue, symptoms, or special requests..."
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 resize-y min-h-[88px] focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(220,38,38,.09)] transition-all"
                    value={form.description}
                    onChange={e => setForm(f => ({...f, description: e.target.value}))}
                  />
                  <div className="text-[12px] text-gray-400 mt-1">No diagnosis needed — just describe what you're experiencing.</div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-[15px] py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-500/30"
                >
                  {submitting
                    ? <><span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" /> Submitting...</>
                    : <><Calendar size={16} /> Submit Booking Request</>
                  }
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-5">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="text-[14px] font-bold mb-4">Contact Us Directly</h4>
                {[
                  { Icon: Phone, label: '(876) 462-9709',                sub: 'Mon – Sat, 8 AM – 6 PM'     },
                  { Icon: Mail,  label: 'worldclassautorepairs1@gmail.com', sub: 'We reply within 24 hours' },
                  { Icon: MapPin, label: 'Jamaica',                       sub: 'Serving all parishes'       },
                ].map(({ Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3 mb-3 last:mb-0">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-primary flex-shrink-0"><Icon size={14} /></div>
                    <div><div className="text-[13px] font-semibold">{label}</div><div className="text-[12px] text-gray-400">{sub}</div></div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="text-[14px] font-bold mb-4">Opening Hours</h4>
                {[
                  { day: 'Monday – Friday', hrs: '8:00 AM – 6:00 PM' },
                  { day: 'Saturday',        hrs: '9:00 AM – 4:00 PM' },
                  { day: 'Sunday',          hrs: 'Closed'            },
                ].map(({ day, hrs }) => (
                  <div key={day} className="flex justify-between text-[13px] py-2 border-b border-gray-100 last:border-0">
                    <span className="font-semibold">{day}</span>
                    <span className={hrs === 'Closed' ? 'text-gray-400' : 'text-gray-700'}>{hrs}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="text-[14px] font-bold mb-3">Good to Know</h4>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-[12.5px] text-orange-900 leading-relaxed">
                  📋 Bookings are confirmed within 24 hours via phone or email. For urgent same-day service, call <strong>(876) 462-9709</strong> directly.
                </div>
                <p className="text-[13px] text-gray-500 mt-3 leading-relaxed">Weekends fill up fast — book at least <strong>2–3 days ahead</strong> for Saturday appointments.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-[13px] font-semibold text-gray-800 mb-1.5">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
      {error && <p className="text-[12px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function input(error?: string) {
  return `w-full px-3.5 py-2.5 border rounded-lg text-sm text-gray-900 bg-white focus:outline-none transition-all appearance-none ${error ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(220,38,38,.09)]'} disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed`;
}
