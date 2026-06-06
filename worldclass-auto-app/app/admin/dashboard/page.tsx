'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDays, ClipboardList, Users, LogOut,
  Plus, Trash2, RefreshCw, ChevronDown,
} from 'lucide-react';
import { SERVICE_PRESETS, PRESET_CATEGORIES, formatCost } from '@/lib/presets';

/* ─── Types ─────────────────────────────────────────────── */
interface Booking { id: number; name: string; phone: string; email: string; vehicle_make: string; vehicle_model: string; service_type: string; preferred_date: string; description?: string; created_at: string; }
interface WorkOrder { id: number; title: string; vehicle?: string; customer_name?: string; service_type?: string; status: string; priority: string; assigned_to?: number; tech_name?: string; estimated_hours?: number; actual_hours?: number; base_cost?: number; labor_rate?: number; total_cost?: number; due_date?: string; notes?: string; started_at?: string; completed_at?: string; created_at: string; }
interface Technician { id: number; username: string; name: string; specialty?: string; is_active: boolean; active_wos: number; total_wos: number; }

const STATUS_COLOR: Record<string, string> = {
  pending:   'bg-white/[0.06] text-white/60',
  active:    'bg-amber-500/10 text-amber-400',
  completed: 'bg-green-500/10 text-green-400',
};
const PRIORITY_COLOR: Record<string, string> = {
  low:    'bg-white/[0.06] text-white/60',
  medium: 'bg-blue-500/10 text-blue-400',
  high:   'bg-orange-500/10 text-orange-400',
  urgent: 'bg-red-500/10 text-red-400',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab]           = useState<'bookings' | 'workorders' | 'techs'>('bookings');
  const [admin, setAdmin]       = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [workOrders, setWOs]    = useState<WorkOrder[]>([]);
  const [techs, setTechs]       = useState<Technician[]>([]);
  const [loading, setLoading]   = useState(true);

  /* Booking create form */
  const [bookingForm, setBookingForm] = useState({ name:'', phone:'', email:'', vehicle_make:'', vehicle_model:'', service_type:'', preferred_date:'', description:'' });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSaving, setBookingSaving] = useState(false);

  /* WO create form */
  const [woForm, setWoForm] = useState({ title:'', vehicle:'', customer_name:'', service_type:'', priority:'medium', assigned_to:'', estimated_hours:'', due_date:'', notes:'', base_cost:'', labor_rate:'3500' });
  const [showWoForm, setShowWoForm] = useState(false);
  const [woError, setWoError] = useState('');
  const [woSaving, setWoSaving] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('');

  /* Tech form */
  const [techForm, setTechForm] = useState({ username:'', name:'', password:'', specialty:'' });
  const [showTechForm, setShowTechForm] = useState(false);
  const [techError, setTechError] = useState('');
  const [techSaving, setTechSaving] = useState(false);

  /* ── Auth check ── */
  useEffect(() => {
    fetch('/api/admin/me')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setAdmin(d.username))
      .catch(() => router.push('/admin'));
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [b, w, t] = await Promise.all([
        fetch('/api/bookings').then(r => r.ok ? r.json() : []),
        fetch('/api/work-orders').then(r => r.ok ? r.json() : []),
        fetch('/api/technicians').then(r => r.ok ? r.json() : []),
      ]);
      setBookings(Array.isArray(b) ? b : []);
      setWOs(Array.isArray(w) ? w : []);
      setTechs(Array.isArray(t) ? t : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (admin) load(); }, [admin, load]);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  }

  async function createBooking() {
    const { name, phone, email, vehicle_make, vehicle_model, service_type, preferred_date } = bookingForm;
    if (!name.trim() || !phone.trim() || !email.trim() || !vehicle_make.trim() || !vehicle_model.trim() || !service_type.trim() || !preferred_date) {
      setBookingError('All fields except notes are required.');
      return;
    }
    setBookingSaving(true);
    setBookingError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingForm),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setBookingError(d.error ?? `Error ${res.status}`);
        return;
      }
      setShowBookingForm(false);
      setBookingForm({ name:'', phone:'', email:'', vehicle_make:'', vehicle_model:'', service_type:'', preferred_date:'', description:'' });
      await load();
    } catch {
      setBookingError('Network error.');
    } finally {
      setBookingSaving(false);
    }
  }

  async function deleteBooking(id: number) {
    if (!confirm('Delete this booking? This cannot be undone.')) return;
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    load();
  }

  function applyPreset(presetId: string) {
    setSelectedPreset(presetId);
    if (!presetId) return;
    const p = SERVICE_PRESETS.find(x => x.id === presetId);
    if (!p) return;
    setWoForm(f => ({
      ...f,
      title: p.name,
      service_type: p.category,
      estimated_hours: String(p.estimated_hours),
      base_cost: String(p.base_cost),
      labor_rate: String(p.labor_rate),
    }));
  }

  async function createWO() {
    if (!woForm.title.trim()) { setWoError('Title is required.'); return; }
    setWoSaving(true);
    setWoError('');
    try {
      const res = await fetch('/api/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...woForm,
          assigned_to: woForm.assigned_to ? Number(woForm.assigned_to) : null,
          estimated_hours: woForm.estimated_hours ? Number(woForm.estimated_hours) : null,
          base_cost: woForm.base_cost ? Number(woForm.base_cost) : null,
          labor_rate: woForm.labor_rate ? Number(woForm.labor_rate) : 3500,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setWoError(d.error ?? `Error ${res.status}`);
        return;
      }
      setShowWoForm(false);
      setSelectedPreset('');
      setWoForm({ title:'', vehicle:'', customer_name:'', service_type:'', priority:'medium', assigned_to:'', estimated_hours:'', due_date:'', notes:'', base_cost:'', labor_rate:'3500' });
      await load();
    } catch {
      setWoError('Network error — check the server is running.');
    } finally {
      setWoSaving(false);
    }
  }

  async function deleteWO(id: number) {
    if (!confirm('Delete this work order?')) return;
    await fetch(`/api/work-orders/${id}`, { method: 'DELETE' });
    load();
  }

  async function updateWOStatus(id: number, status: string) {
    await fetch(`/api/work-orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  }

  async function createTech() {
    if (!techForm.username.trim() || !techForm.name.trim() || !techForm.password.trim()) {
      setTechError('Username, full name and password are all required.');
      return;
    }
    setTechSaving(true);
    setTechError('');
    try {
      const res = await fetch('/api/technicians', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(techForm),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setTechError(d.error ?? `Error ${res.status}`);
        return;
      }
      setShowTechForm(false);
      setTechForm({ username:'', name:'', password:'', specialty:'' });
      await load();
    } catch {
      setTechError('Network error — check the server is running.');
    } finally {
      setTechSaving(false);
    }
  }

  async function deleteTech(id: number) {
    if (!confirm('Deactivate this technician?')) return;
    await fetch(`/api/technicians/${id}`, { method: 'DELETE' });
    load();
  }

  if (!admin) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]"><div className="animate-spin border-4 border-primary border-t-transparent rounded-full w-8 h-8" /></div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/[0.07] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-[16px] font-black text-white">WorldClass <span className="text-primary">Auto</span> <span className="text-white/35 font-normal text-sm">Admin</span></div>
            <div className="flex gap-1">
              {(['bookings','workorders','techs'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ${tab === t ? 'bg-primary/10 text-primary' : 'text-white/45 hover:text-white/80'}`}>
                  {t === 'bookings' ? 'Bookings' : t === 'workorders' ? 'Work Orders' : 'Technicians'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} className="p-1.5 text-white/40 hover:text-white/80 transition-colors" title="Refresh"><RefreshCw size={15} /></button>
            <span className="text-[13px] text-white/50">Hi, <strong className="text-white/80">{admin}</strong></span>
            <button onClick={logout} className="flex items-center gap-1.5 text-[13px] text-white/50 hover:text-red-400 transition-colors"><LogOut size={14} /> Sign out</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && <div className="flex justify-center py-16"><div className="animate-spin border-4 border-primary border-t-transparent rounded-full w-8 h-8" /></div>}

        {/* ========== BOOKINGS TAB ========== */}
        {!loading && tab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-white flex items-center gap-2"><CalendarDays size={20} className="text-primary" /> Bookings <span className="text-white/35 font-normal text-sm">({bookings.length})</span></h2>
              <button onClick={() => setShowBookingForm(true)} className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-black text-[13px] font-bold px-4 py-2 rounded-lg transition-colors">
                <Plus size={15} /> New Booking
              </button>
            </div>

            {/* New Booking form */}
            {showBookingForm && (
              <div className="bg-[#111] border border-white/[0.08] rounded-xl p-6 mb-6">
                <h3 className="font-bold mb-4 text-[15px] text-white">Add Booking</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input placeholder="Customer name *" className={fi()} value={bookingForm.name} onChange={e => setBookingForm(f=>({...f,name:e.target.value}))} />
                  <input placeholder="Phone *" className={fi()} value={bookingForm.phone} onChange={e => setBookingForm(f=>({...f,phone:e.target.value}))} />
                  <input placeholder="Email *" type="email" className={fi()} value={bookingForm.email} onChange={e => setBookingForm(f=>({...f,email:e.target.value}))} />
                  <input placeholder="Preferred date *" type="date" className={fi()} value={bookingForm.preferred_date} onChange={e => setBookingForm(f=>({...f,preferred_date:e.target.value}))} />
                  <input placeholder="Vehicle make (e.g. Toyota) *" className={fi()} value={bookingForm.vehicle_make} onChange={e => setBookingForm(f=>({...f,vehicle_make:e.target.value}))} />
                  <input placeholder="Vehicle model (e.g. Corolla 2020) *" className={fi()} value={bookingForm.vehicle_model} onChange={e => setBookingForm(f=>({...f,vehicle_model:e.target.value}))} />
                  <input placeholder="Service type *" className={fi()} value={bookingForm.service_type} onChange={e => setBookingForm(f=>({...f,service_type:e.target.value}))} />
                </div>
                <textarea placeholder="Notes (optional)" rows={2} className={fi() + ' w-full resize-none'} value={bookingForm.description} onChange={e => setBookingForm(f=>({...f,description:e.target.value}))} />
                {bookingError && <p className="text-red-400 text-[13px] mt-2">{bookingError}</p>}
                <div className="flex gap-2 mt-4">
                  <button onClick={createBooking} disabled={bookingSaving} className="bg-primary hover:bg-primary-dark text-black font-bold text-sm px-5 py-2 rounded-lg disabled:opacity-50 transition-colors">
                    {bookingSaving ? 'Saving…' : 'Add Booking'}
                  </button>
                  <button onClick={() => { setShowBookingForm(false); setBookingError(''); }} className="text-white/50 hover:text-white/80 text-sm px-4 py-2 border border-white/10 rounded-lg transition-colors">Cancel</button>
                </div>
              </div>
            )}

            <div className="bg-[#111] border border-white/[0.08] rounded-xl overflow-hidden">
              <table className="w-full text-[13px]">
                <thead className="bg-white/[0.03] border-b border-white/[0.06]">
                  <tr>
                    {['Date','Customer','Vehicle','Service','Phone','Email',''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-12 text-white/35">No bookings yet.</td></tr>
                  )}
                  {bookings.map(b => (
                    <tr key={b.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-semibold text-white/75 whitespace-nowrap">{new Date(b.preferred_date).toLocaleDateString('en-JM', { weekday:'short', month:'short', day:'numeric' })}</td>
                      <td className="px-4 py-3 font-medium text-white/90">{b.name}</td>
                      <td className="px-4 py-3 text-white/60">{b.vehicle_make} {b.vehicle_model}</td>
                      <td className="px-4 py-3 text-white/60 max-w-[180px] truncate">{b.service_type}</td>
                      <td className="px-4 py-3 text-white/60">{b.phone}</td>
                      <td className="px-4 py-3 text-white/50">{b.email}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteBooking(b.id)} className="text-white/20 hover:text-red-400 transition-colors" title="Delete booking">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========== WORK ORDERS TAB ========== */}
        {!loading && tab === 'workorders' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-white flex items-center gap-2"><ClipboardList size={20} className="text-primary" /> Work Orders <span className="text-white/35 font-normal text-sm">({workOrders.length})</span></h2>
              <button onClick={() => setShowWoForm(true)} className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-black text-[13px] font-bold px-4 py-2 rounded-lg transition-colors">
                <Plus size={15} /> New Work Order
              </button>
            </div>

            {/* New WO form */}
            {showWoForm && (
              <div className="bg-[#111] border border-white/[0.08] rounded-xl p-6 mb-6">
                <h3 className="font-bold mb-4 text-[15px] text-white">Create Work Order</h3>

                {/* ── Preset selector ── */}
                <div className="mb-5 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="text-[12px] font-bold text-amber-400 uppercase tracking-wide mb-2">Load from Service Preset</div>
                  <div className="relative">
                    <select
                      className={fi() + ' cursor-pointer pr-8'}
                      value={selectedPreset}
                      onChange={e => applyPreset(e.target.value)}
                    >
                      <option value="">— Select a preset to auto-fill —</option>
                      {PRESET_CATEGORIES.map(cat => (
                        <optgroup key={cat} label={cat}>
                          {SERVICE_PRESETS.filter(p => p.category === cat).map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} · {p.estimated_hours}h · {formatCost(p.base_cost)}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {selectedPreset && (
                    <div className="mt-2 text-[12px] text-amber-400/80">
                      Preset loaded — you can still edit any field below.
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input placeholder="Title *" className={fi()} value={woForm.title} onChange={e => setWoForm(f=>({...f,title:e.target.value}))} />
                  <input placeholder="Customer name" className={fi()} value={woForm.customer_name} onChange={e => setWoForm(f=>({...f,customer_name:e.target.value}))} />
                  <input placeholder="Vehicle (e.g. Toyota Corolla 2018)" className={fi()} value={woForm.vehicle} onChange={e => setWoForm(f=>({...f,vehicle:e.target.value}))} />
                  <input placeholder="Service type / category" className={fi()} value={woForm.service_type} onChange={e => setWoForm(f=>({...f,service_type:e.target.value}))} />
                  <div className="relative">
                    <select className={fi() + ' cursor-pointer'} value={woForm.priority} onChange={e => setWoForm(f=>({...f,priority:e.target.value}))}>
                      <option value="low">Low priority</option>
                      <option value="medium">Medium priority</option>
                      <option value="high">High priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="relative">
                    <select className={fi() + ' cursor-pointer'} value={woForm.assigned_to} onChange={e => setWoForm(f=>({...f,assigned_to:e.target.value}))}>
                      <option value="">Unassigned</option>
                      {techs.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <input placeholder="Estimated hours" type="number" min="0" step="0.5" className={fi()} value={woForm.estimated_hours} onChange={e => setWoForm(f=>({...f,estimated_hours:e.target.value}))} />
                  <input placeholder="Due date" type="date" className={fi()} value={woForm.due_date} onChange={e => setWoForm(f=>({...f,due_date:e.target.value}))} />
                  <input placeholder="Base cost (JMD)" type="number" min="0" step="100" className={fi()} value={woForm.base_cost} onChange={e => setWoForm(f=>({...f,base_cost:e.target.value}))} />
                  <input placeholder="Labour rate / hr (JMD)" type="number" min="0" step="100" className={fi()} value={woForm.labor_rate} onChange={e => setWoForm(f=>({...f,labor_rate:e.target.value}))} />
                </div>
                <textarea placeholder="Notes..." rows={2} className={fi() + ' w-full resize-none'} value={woForm.notes} onChange={e => setWoForm(f=>({...f,notes:e.target.value}))} />
                {woForm.base_cost && woForm.estimated_hours && (
                  <div className="mt-3 text-[12px] text-white/50 bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-2">
                    Base cost <strong className="text-white/80">{formatCost(Number(woForm.base_cost))}</strong> · Additional labour at <strong className="text-white/80">{formatCost(Number(woForm.labor_rate || 3500))}/hr</strong> if over {woForm.estimated_hours}h
                  </div>
                )}
                {woError && <p className="text-red-400 text-[13px] mt-2">{woError}</p>}
                <div className="flex gap-2 mt-4">
                  <button onClick={createWO} disabled={!woForm.title || woSaving} className="bg-primary hover:bg-primary-dark text-black font-bold text-sm px-5 py-2 rounded-lg disabled:opacity-50 transition-colors">
                    {woSaving ? 'Saving…' : 'Create'}
                  </button>
                  <button onClick={() => { setShowWoForm(false); setWoError(''); setSelectedPreset(''); }} className="text-white/50 hover:text-white/80 text-sm px-4 py-2 border border-white/10 rounded-lg transition-colors">Cancel</button>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {workOrders.length === 0 && <div className="col-span-3 text-center py-16 text-white/35 bg-[#111] border border-white/[0.07] rounded-xl">No work orders yet.</div>}
              {workOrders.map(wo => (
                <div key={wo.id} className="bg-[#111] border border-white/[0.08] rounded-xl p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="font-bold text-[14px] text-white/90 mb-0.5">{wo.title}</div>
                      {wo.customer_name && <div className="text-[12px] text-white/35">{wo.customer_name}{wo.vehicle ? ` · ${wo.vehicle}` : ''}</div>}
                    </div>
                    <button onClick={() => deleteWO(wo.id)} className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"><Trash2 size={14} /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[wo.status] ?? 'bg-white/[0.06] text-white/60'}`}>{wo.status}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_COLOR[wo.priority] ?? 'bg-white/[0.06] text-white/60'}`}>{wo.priority}</span>
                  </div>
                  {wo.tech_name && <div className="text-[12px] text-white/50 mb-1">👤 {wo.tech_name}</div>}
                  {wo.estimated_hours && <div className="text-[12px] text-white/50 mb-1">⏱ {wo.estimated_hours}h est{wo.actual_hours ? ` · ${wo.actual_hours}h actual` : ''}</div>}
                  {wo.base_cost != null && (
                    <div className="text-[12px] text-white/50 mb-1">
                      💰 Base {formatCost(wo.base_cost)}
                      {wo.total_cost != null && (
                        <span className="font-semibold text-green-400"> · Total {formatCost(wo.total_cost)}</span>
                      )}
                    </div>
                  )}
                  {wo.due_date && <div className="text-[12px] text-white/50 mb-3">📅 Due {new Date(wo.due_date).toLocaleDateString()}</div>}
                  <div className="flex gap-1.5 mt-3 pt-3 border-t border-white/[0.05]">
                    {wo.status !== 'active'    && <button onClick={() => updateWOStatus(wo.id,'active')}    className="text-[11px] px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-md font-medium hover:bg-amber-500/15 transition-colors">→ Active</button>}
                    {wo.status !== 'completed' && <button onClick={() => updateWOStatus(wo.id,'completed')} className="text-[11px] px-2.5 py-1 bg-green-500/10 text-green-400 rounded-md font-medium hover:bg-green-500/15 transition-colors">✓ Done</button>}
                    {wo.status !== 'pending'   && <button onClick={() => updateWOStatus(wo.id,'pending')}   className="text-[11px] px-2.5 py-1 bg-white/[0.06] text-white/60 rounded-md font-medium hover:bg-white/[0.10] transition-colors">↩ Pending</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== TECHNICIANS TAB ========== */}
        {!loading && tab === 'techs' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-white flex items-center gap-2"><Users size={20} className="text-primary" /> Technicians <span className="text-white/35 font-normal text-sm">({techs.length})</span></h2>
              <button onClick={() => setShowTechForm(true)} className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-black text-[13px] font-bold px-4 py-2 rounded-lg transition-colors">
                <Plus size={15} /> Add Technician
              </button>
            </div>

            {showTechForm && (
              <div className="bg-[#111] border border-white/[0.08] rounded-xl p-6 mb-6">
                <h3 className="font-bold mb-4 text-[15px] text-white">New Technician</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input placeholder="Username *" className={fi()} value={techForm.username} onChange={e => setTechForm(f=>({...f,username:e.target.value}))} />
                  <input placeholder="Full name *" className={fi()} value={techForm.name} onChange={e => setTechForm(f=>({...f,name:e.target.value}))} />
                  <input placeholder="Password *" type="password" className={fi()} value={techForm.password} onChange={e => setTechForm(f=>({...f,password:e.target.value}))} />
                  <input placeholder="Specialty (e.g. General Mechanic)" className={fi()} value={techForm.specialty} onChange={e => setTechForm(f=>({...f,specialty:e.target.value}))} />
                </div>
                {techError && <p className="text-red-400 text-[13px] mt-2">{techError}</p>}
                <div className="flex gap-2 mt-2">
                  <button onClick={createTech} disabled={!techForm.username || !techForm.name || !techForm.password || techSaving} className="bg-primary hover:bg-primary-dark text-black font-bold text-sm px-5 py-2 rounded-lg disabled:opacity-50 transition-colors">
                    {techSaving ? 'Saving…' : 'Add'}
                  </button>
                  <button onClick={() => { setShowTechForm(false); setTechError(''); }} className="text-white/50 text-sm px-4 py-2 border border-white/10 rounded-lg hover:text-white/80 transition-colors">Cancel</button>
                </div>
              </div>
            )}

            <div className="bg-[#111] border border-white/[0.08] rounded-xl overflow-hidden">
              <table className="w-full text-[13px]">
                <thead className="bg-white/[0.03] border-b border-white/[0.06]">
                  <tr>
                    {['Name','Username','Specialty','Workload',''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {techs.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-white/35">No technicians.</td></tr>}
                  {techs.map(t => (
                    <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-semibold text-white/90">{t.name}</td>
                      <td className="px-4 py-3 text-white/45 font-mono text-[12px]">{t.username}</td>
                      <td className="px-4 py-3 text-white/60">{t.specialty ?? '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full max-w-[80px]">
                            <div className="h-1.5 bg-primary rounded-full transition-all" style={{ width: t.total_wos ? `${Math.min(100,(t.active_wos / t.total_wos)*100)}%` : '0%' }} />
                          </div>
                          <span className="text-[11px] text-white/45 whitespace-nowrap">{t.active_wos} active / {t.total_wos} total</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteTech(t.id)} className="text-white/20 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function fi() {
  return 'w-full px-3.5 py-2.5 border border-white/10 rounded-lg text-sm bg-[#1a1a1a] text-white [color-scheme:dark] focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(245,166,35,.07)] transition-all appearance-none placeholder:text-white/25';
}
