'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, Phone, Mail, MapPin, ChevronLeft, ChevronRight, MessageCircle, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PRESET_CATEGORIES } from '@/lib/presets';

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
    make: '', model: '', modelOther: '', description: '',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceNotes, setServiceNotes]         = useState<Record<string, string>>({});
  const [otherChecked, setOtherChecked]         = useState(false);
  const [otherText, setOtherText]               = useState('');
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

  function toggleService(svc: string) {
    setSelectedServices(prev => {
      if (prev.includes(svc)) {
        setServiceNotes(n => { const c = {...n}; delete c[svc]; return c; });
        return prev.filter(s => s !== svc);
      }
      return [...prev, svc];
    });
    setErrors(e => ({ ...e, service: '' }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address.';
    if (form.phone.replace(/\D/g,'').length < 7) e.phone = 'Please enter a valid phone number.';
    if (!form.make) e.make = 'Please select your vehicle make.';
    if (form.make === 'Other' ? !form.modelOther.trim() : !form.model) e.model = 'Please select your vehicle model.';
    const allServices = [...selectedServices, ...(otherChecked && otherText.trim() ? [`Other: ${otherText.trim()}`] : [])];
    if (allServices.length === 0) e.service = 'Please select at least one service.';
    if (otherChecked && !otherText.trim()) e.otherText = 'Please describe what you need.';
    if (!selectedDate) e.date = 'Please select a preferred date.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const allServices = [...selectedServices, ...(otherChecked && otherText.trim() ? ['Other'] : [])];

    // Build structured notes: one line per service that has a note
    const notesLines: string[] = [];
    selectedServices.forEach(svc => {
      const n = serviceNotes[svc]?.trim();
      if (n) notesLines.push(`${svc}: ${n}`);
    });
    if (otherChecked && otherText.trim()) notesLines.push(`Other: ${otherText.trim()}`);
    if (form.description.trim()) notesLines.push(form.description.trim());
    const description = notesLines.join('\n') || null;

    const body = {
      name: form.name.trim(),
      phone: (form.areaCode + form.phone).replace(/\D/g,''),
      email: form.email.trim(),
      vehicle_make: form.make,
      vehicle_model: form.make === 'Other' ? form.modelOther.trim() : form.model,
      service_type: allServices.join(' · '),
      preferred_date: selectedDate!.toISOString().split('T')[0],
      description,
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
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center pt-24 pb-24">
          <div className="max-w-md w-full mx-4 bg-[#111] border border-white/[0.08] rounded-2xl p-12 text-center shadow-2xl">
            <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 className="text-[22px] font-black text-white mb-3">Booking Submitted!</h2>
            <p className="text-[14px] text-white/50 leading-relaxed mb-6">
              Thank you for booking with WorldClass Auto.<br/>
              We&apos;ll contact you within 24 hours to confirm your appointment.
            </p>
            <div className="bg-primary/8 border border-primary/20 rounded-xl px-6 py-4 mb-8">
              <div className="text-[11px] text-primary/70 font-bold uppercase tracking-widest mb-1">Your Reference</div>
              <div className="text-[24px] font-black text-primary tracking-widest">{success}</div>
            </div>
            <a href="/" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white font-medium text-sm transition-colors">← Back to Home</a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* ===== HERO HEADER ===== */}
      <div className="relative bg-[#000] pt-40 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(rgba(245,166,35,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,166,35,.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 100%,rgba(245,166,35,.07) 0%,transparent 60%)' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/8 text-primary text-[11px] font-bold tracking-[.12em] uppercase px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            Online Booking
          </div>
          <h1 className="text-[clamp(36px,6vw,80px)] font-black text-white tracking-[-0.02em] leading-none mb-5">
            Book Your Appointment
          </h1>
          <p className="text-[16px] text-white/45 max-w-[440px] mx-auto leading-relaxed">
            Fill in the details below and we&apos;ll confirm your appointment within 24 hours.
          </p>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="form-dark bg-[#0A0A0A] py-14 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">

            {/* ===== FORM CARD ===== */}
            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-8 md:p-10">
              <div className="text-[11px] font-bold text-primary tracking-[.12em] uppercase mb-2">Step 1 of 1</div>
              <div className="text-[20px] font-black text-white mb-7">Your Booking Details</div>

              <form onSubmit={handleSubmit} noValidate>
                {/* Name */}
                <DField label="Full Name" required error={errors.name}>
                  <input className={di(errors.name)} type="text" placeholder="e.g. John Brown"
                    value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                </DField>

                {/* Email + Phone */}
                <div className="grid sm:grid-cols-2 gap-4 mb-5">
                  <DField label="Email Address" required error={errors.email}>
                    <input className={di(errors.email)} type="email" placeholder="you@example.com"
                      value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                  </DField>
                  <DField label="Phone Number" required error={errors.phone}>
                    <div className="flex gap-2">
                      <div className="relative w-[115px] flex-shrink-0">
                        <select className={di() + ' pr-8 cursor-pointer'} value={form.areaCode}
                          onChange={e => setForm(f => ({...f, areaCode: e.target.value}))}>
                          <option value="+876">🇯🇲 +876</option>
                          <option value="+658">🇯🇲 +658</option>
                        </select>
                        <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none rotate-90" />
                      </div>
                      <input className={di(errors.phone) + ' flex-1'} type="tel" placeholder="462-9709"
                        value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
                    </div>
                  </DField>
                </div>

                {/* Make + Model */}
                <div className="grid sm:grid-cols-2 gap-4 mb-5">
                  <DField label="Vehicle Make" required error={errors.make}>
                    <div className="relative">
                      <select className={di(errors.make) + ' cursor-pointer pr-8'}
                        value={form.make}
                        onChange={e => setForm(f => ({...f, make: e.target.value, model: '', modelOther: ''}))}>
                        <option value="">Select make...</option>
                        {Object.keys(MODELS).map(m => <option key={m}>{m}</option>)}
                        <option>Other</option>
                      </select>
                      <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none rotate-90" />
                    </div>
                  </DField>
                  <DField label="Vehicle Model" required error={errors.model}>
                    {form.make === 'Other' ? (
                      <input className={di(errors.model)} type="text" placeholder="Enter vehicle model"
                        value={form.modelOther} onChange={e => setForm(f => ({...f, modelOther: e.target.value}))} />
                    ) : (
                      <div className="relative">
                        <select className={di(errors.model) + ' cursor-pointer pr-8'}
                          value={form.model}
                          onChange={e => setForm(f => ({...f, model: e.target.value}))}
                          disabled={!form.make}>
                          <option value="">{form.make ? 'Select model...' : 'Select make first...'}</option>
                          {(MODELS[form.make] ?? []).map(m => <option key={m}>{m}</option>)}
                        </select>
                        <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none rotate-90" />
                      </div>
                    )}
                  </DField>
                </div>

                {/* Services — multi-select checkboxes */}
                <div className="mb-5">
                  <label className="block text-[12px] font-bold text-white/50 uppercase tracking-[.08em] mb-3">
                    Services Required <span className="text-primary">*</span>
                    <span className="text-white/25 font-normal normal-case tracking-normal ml-1">(select all that apply)</span>
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {PRESET_CATEGORIES.map(svc => {
                      const checked = selectedServices.includes(svc);
                      return (
                        <div key={svc} className="flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleService(svc)}
                            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border text-[13px] font-medium text-left transition-all ${
                              checked
                                ? 'border-primary/50 bg-primary/8 text-white'
                                : 'border-white/10 bg-[#1a1a1a] text-white/55 hover:border-white/25 hover:text-white/80'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                              checked ? 'bg-primary border-primary' : 'border-white/20'
                            }`}>
                              {checked && <Check size={10} strokeWidth={3} className="text-black" />}
                            </span>
                            {svc}
                          </button>
                          {checked && (
                            <textarea
                              rows={2}
                              placeholder={`Describe what you need for ${svc} (optional)...`}
                              value={serviceNotes[svc] ?? ''}
                              onChange={e => setServiceNotes(n => ({ ...n, [svc]: e.target.value }))}
                              className="w-full px-3 py-2 border border-primary/20 rounded-lg text-[12px] bg-primary/5 text-white placeholder:text-white/25 focus:outline-none focus:border-primary/40 transition-all resize-none"
                            />
                          )}
                        </div>
                      );
                    })}
                    {/* Other option */}
                    <div className="flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => { setOtherChecked(v => !v); setErrors(e => ({ ...e, service: '' })); }}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border text-[13px] font-medium text-left transition-all ${
                          otherChecked
                            ? 'border-primary/50 bg-primary/8 text-white'
                            : 'border-white/10 bg-[#1a1a1a] text-white/55 hover:border-white/25 hover:text-white/80'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                          otherChecked ? 'bg-primary border-primary' : 'border-white/20'
                        }`}>
                          {otherChecked && <Check size={10} strokeWidth={3} className="text-black" />}
                        </span>
                        Other
                      </button>
                      {otherChecked && (
                        <textarea
                          rows={2}
                          placeholder="Describe what you need..."
                          value={otherText}
                          onChange={e => { setOtherText(e.target.value); setErrors(er => ({ ...er, otherText: '' })); }}
                          className={`w-full px-3 py-2 border rounded-lg text-[12px] bg-primary/5 text-white placeholder:text-white/25 focus:outline-none transition-all resize-none ${errors.otherText ? 'border-red-400/60' : 'border-primary/20 focus:border-primary/40'}`}
                        />
                      )}
                      {errors.otherText && <p className="text-[12px] text-red-400">{errors.otherText}</p>}
                    </div>
                  </div>
                  {errors.service && <p className="text-[12px] text-red-400 mt-2">{errors.service}</p>}
                  {(selectedServices.length > 0 || (otherChecked && otherText.trim())) && (
                    <div className="mt-2 text-[12px] text-white/35">
                      {selectedServices.length + (otherChecked && otherText.trim() ? 1 : 0)} service{selectedServices.length + (otherChecked && otherText.trim() ? 1 : 0) !== 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>

                {/* Date picker */}
                <DField label="Preferred Date" required error={errors.date}>
                  <div className="relative" ref={calRef}>
                    <button
                      type="button"
                      onClick={() => setCalOpen(o => !o)}
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-left text-sm flex items-center justify-between transition-all bg-[#1a1a1a] text-white ${errors.date ? 'border-red-400/60' : calOpen ? 'border-primary/60 shadow-[0_0_0_3px_rgba(245,166,35,.08)]' : 'border-white/10 hover:border-white/25'}`}
                    >
                      {selectedDate
                        ? <span className="font-medium text-white">{formatDate(selectedDate)}</span>
                        : <span className="text-white/30">Choose a date (weekdays only)...</span>
                      }
                      <Calendar size={15} className="text-white/30" />
                    </button>

                    {calOpen && (
                      <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-[300px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl p-4">
                        <div className="flex items-center justify-between mb-3.5">
                          <button type="button" onClick={prevMonth} className="w-7 h-7 border border-white/10 rounded-md flex items-center justify-center text-white/50 hover:border-primary hover:text-primary transition-colors">
                            <ChevronLeft size={14} />
                          </button>
                          <span className="text-[14px] font-bold text-white">{MONTHS[viewMonth]} {viewYear}</span>
                          <button type="button" onClick={nextMonth} className="w-7 h-7 border border-white/10 rounded-md flex items-center justify-center text-white/50 hover:border-primary hover:text-primary transition-colors">
                            <ChevronRight size={14} />
                          </button>
                        </div>
                        <div className="grid grid-cols-7 mb-1.5">
                          {DAYS.map(d => <div key={d} className="text-center text-[10px] font-bold text-white/30 py-1 uppercase">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-0.5">
                          {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
                          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                            const date = new Date(viewYear, viewMonth, d); date.setHours(0,0,0,0);
                            const dow  = date.getDay();
                            const isWknd  = dow === 0 || dow === 6;
                            const isPast  = date < today;
                            const isToday = date.getTime() === today.getTime();
                            const isSel   = selectedDate?.getTime() === date.getTime();
                            const disabled = isWknd || isPast;
                            return (
                              <button
                                key={d} type="button"
                                disabled={disabled}
                                onClick={() => selectDay(d)}
                                className={`aspect-square flex items-center justify-center text-[13px] font-medium rounded-md transition-colors
                                  ${isSel ? 'bg-primary text-black' : ''}
                                  ${isToday && !isSel ? 'border border-primary text-primary font-bold' : ''}
                                  ${!disabled && !isSel && !isToday ? 'text-white/70 hover:bg-primary/15 hover:text-primary' : ''}
                                  ${disabled ? 'text-white/15 cursor-not-allowed' : 'cursor-pointer'}
                                `}
                              >{d}</button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </DField>

                {/* Notes */}
                <div className="mb-7">
                  <label className="block text-[12px] font-bold text-white/50 uppercase tracking-[.08em] mb-2">
                    Additional Notes <span className="text-white/25 font-normal normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe what you're experiencing with your vehicle..."
                    className="w-full px-3.5 py-2.5 border border-white/10 rounded-lg text-sm bg-[#1a1a1a] focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(245,166,35,.07)] transition-all resize-y min-h-[88px] placeholder:text-white/20"
                    style={{ color: 'white' }}
                    value={form.description}
                    onChange={e => setForm(f => ({...f, description: e.target.value}))}
                  />
                  <div className="text-[12px] text-white/25 mt-1">No diagnosis needed — just describe what you&apos;re experiencing.</div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary-dark text-black font-bold text-[15px] py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-primary/25 hover:-translate-y-0.5"
                >
                  {submitting
                    ? <><span className="animate-spin border-2 border-black/20 border-t-black rounded-full w-4 h-4" /> Submitting...</>
                    : <><Calendar size={16} /> Submit Booking Request</>
                  }
                </button>
              </form>
            </div>

            {/* ===== SIDEBAR ===== */}
            <div className="flex flex-col gap-4">

              {/* Contact */}
              <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6">
                <div className="text-[11px] font-bold text-white/40 uppercase tracking-[.1em] mb-5">Contact Us Directly</div>
                {[
                  { Icon: Phone,         label: '(876) 672-0125',                   sub: '(876) 254-6914'            },
                  { Icon: MessageCircle, label: '(876) 462-9709',                   sub: 'WhatsApp available'        },
                  { Icon: Mail,          label: 'worldclassautorepairs1@gmail.com', sub: 'We reply within 24 hours'  },
                  { Icon: MapPin,        label: '51B Waltham Park Rd',              sub: 'Shop 8 Padlock Plaza'      },
                ].map(({ Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3.5 mb-4 last:mb-0">
                    <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                      <Icon size={15} />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-white">{label}</div>
                      <div className="text-[12px] text-white/35">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6">
                <div className="text-[11px] font-bold text-white/40 uppercase tracking-[.1em] mb-4">Opening Hours</div>
                {[
                  { day: 'Monday – Friday', hrs: '8:00 AM – 6:00 PM', open: true  },
                  { day: 'Saturday',        hrs: '8:00 AM – 5:00 PM', open: true  },
                  { day: 'Sunday',          hrs: 'Closed',            open: false },
                ].map(({ day, hrs, open }) => (
                  <div key={day} className="flex justify-between items-center py-2.5 border-b border-white/[0.05] last:border-0">
                    <span className="text-[13px] text-white/50">{day}</span>
                    <span className={`text-[13px] font-semibold ${open ? 'text-white' : 'text-white/25'}`}>{hrs}</span>
                  </div>
                ))}
              </div>

              {/* Good to know */}
              <div className="bg-primary/8 border border-primary/20 rounded-2xl p-6">
                <div className="text-[11px] font-bold text-primary/80 uppercase tracking-[.1em] mb-3">Good to Know</div>
                <p className="text-[13px] text-white/55 leading-relaxed mb-3">
                  Bookings are confirmed within 24 hours via phone or email. For urgent same-day service, call <strong className="text-white">(876) 462-9709</strong>.
                </p>
                <p className="text-[12px] text-white/35 leading-relaxed">
                  Weekends fill up fast — book at least 2–3 days ahead for Saturday appointments.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

function DField({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-[12px] font-bold text-white/50 uppercase tracking-[.08em] mb-2">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
      {error && <p className="text-[12px] text-red-400 mt-1.5">{error}</p>}
    </div>
  );
}

function di(error?: string) {
  return `w-full px-3.5 py-2.5 border rounded-lg text-sm bg-[#1a1a1a] focus:outline-none transition-all appearance-none placeholder:text-white/20 ${error ? 'border-red-400/60 focus:border-red-400/60' : 'border-white/10 focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(245,166,35,.07)]'} disabled:opacity-40 disabled:cursor-not-allowed`;
}
