'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDays, ClipboardList, Users, LogOut,
  Plus, Trash2, RefreshCw,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────── */
interface Booking { id: number; name: string; phone: string; email: string; vehicle_make: string; vehicle_model: string; service_type: string; preferred_date: string; description?: string; created_at: string; }
interface WorkOrder { id: number; title: string; vehicle?: string; customer_name?: string; service_type?: string; status: string; priority: string; assigned_to?: number; tech_name?: string; estimated_hours?: number; actual_hours?: number; due_date?: string; notes?: string; started_at?: string; completed_at?: string; created_at: string; }
interface Technician { id: number; username: string; name: string; specialty?: string; is_active: boolean; active_wos: number; total_wos: number; }

const STATUS_COLOR: Record<string, string> = {
  pending:   'bg-gray-100 text-gray-600',
  active:    'bg-amber-50 text-amber-700',
  completed: 'bg-green-50 text-green-700',
};
const PRIORITY_COLOR: Record<string, string> = {
  low:    'bg-gray-100 text-gray-600',
  medium: 'bg-blue-50 text-blue-700',
  high:   'bg-orange-50 text-orange-700',
  urgent: 'bg-red-50 text-red-700',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab]           = useState<'bookings' | 'workorders' | 'techs'>('bookings');
  const [admin, setAdmin]       = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [workOrders, setWOs]    = useState<WorkOrder[]>([]);
  const [techs, setTechs]       = useState<Technician[]>([]);
  const [loading, setLoading]   = useState(true);

  /* WO create form */
  const [woForm, setWoForm] = useState({ title:'', vehicle:'', customer_name:'', service_type:'', priority:'medium', assigned_to:'', estimated_hours:'', due_date:'', notes:'' });
  const [showWoForm, setShowWoForm] = useState(false);
  const [woError, setWoError] = useState('');
  const [woSaving, setWoSaving] = useState(false);

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

  async function createWO() {
    if (!woForm.title.trim()) { setWoError('Title is required.'); return; }
    setWoSaving(true);
    setWoError('');
    try {
      const res = await fetch('/api/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...woForm, assigned_to: woForm.assigned_to ? Number(woForm.assigned_to) : null, estimated_hours: woForm.estimated_hours ? Number(woForm.estimated_hours) : null }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setWoError(d.error ?? `Error ${res.status}`);
        return;
      }
      setShowWoForm(false);
      setWoForm({ title:'', vehicle:'', customer_name:'', service_type:'', priority:'medium', assigned_to:'', estimated_hours:'', due_date:'', notes:'' });
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

  if (!admin) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin border-4 border-primary border-t-transparent rounded-full w-8 h-8" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-[16px] font-black">WorldClass <span className="text-primary">Auto</span> <span className="text-gray-400 font-normal text-sm">Admin</span></div>
            <div className="flex gap-1">
              {(['bookings','workorders','techs'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ${tab === t ? 'bg-red-50 text-primary' : 'text-gray-500 hover:text-gray-800'}`}>
                  {t === 'bookings' ? 'Bookings' : t === 'workorders' ? 'Work Orders' : 'Technicians'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors" title="Refresh"><RefreshCw size={15} /></button>
            <span className="text-[13px] text-gray-500">Hi, <strong>{admin}</strong></span>
            <button onClick={logout} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-red-600 transition-colors"><LogOut size={14} /> Sign out</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && <div className="flex justify-center py-16"><div className="animate-spin border-4 border-primary border-t-transparent rounded-full w-8 h-8" /></div>}

        {/* ========== BOOKINGS TAB ========== */}
        {!loading && tab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold flex items-center gap-2"><CalendarDays size={20} className="text-primary" /> Bookings <span className="text-gray-400 font-normal text-sm">({bookings.length})</span></h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-[13px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Date','Customer','Vehicle','Service','Phone','Email'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No bookings yet.</td></tr>
                  )}
                  {bookings.map(b => (
                    <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">{new Date(b.preferred_date).toLocaleDateString('en-JM', { weekday:'short', month:'short', day:'numeric' })}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{b.name}</td>
                      <td className="px-4 py-3 text-gray-600">{b.vehicle_make} {b.vehicle_model}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{b.service_type}</td>
                      <td className="px-4 py-3 text-gray-600">{b.phone}</td>
                      <td className="px-4 py-3 text-gray-500">{b.email}</td>
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
              <h2 className="text-[18px] font-bold flex items-center gap-2"><ClipboardList size={20} className="text-primary" /> Work Orders <span className="text-gray-400 font-normal text-sm">({workOrders.length})</span></h2>
              <button onClick={() => setShowWoForm(true)} className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-[13px] font-bold px-4 py-2 rounded-lg transition-colors">
                <Plus size={15} /> New Work Order
              </button>
            </div>

            {/* New WO form */}
            {showWoForm && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
                <h3 className="font-bold mb-4 text-[15px]">Create Work Order</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input placeholder="Title *" className={fi()} value={woForm.title} onChange={e => setWoForm(f=>({...f,title:e.target.value}))} />
                  <input placeholder="Customer name" className={fi()} value={woForm.customer_name} onChange={e => setWoForm(f=>({...f,customer_name:e.target.value}))} />
                  <input placeholder="Vehicle (e.g. Toyota Corolla 2018)" className={fi()} value={woForm.vehicle} onChange={e => setWoForm(f=>({...f,vehicle:e.target.value}))} />
                  <input placeholder="Service type" className={fi()} value={woForm.service_type} onChange={e => setWoForm(f=>({...f,service_type:e.target.value}))} />
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
                </div>
                <textarea placeholder="Notes..." rows={2} className={fi() + ' w-full resize-none'} value={woForm.notes} onChange={e => setWoForm(f=>({...f,notes:e.target.value}))} />
                {woError && <p className="text-red-600 text-[13px] mt-2">{woError}</p>}
                <div className="flex gap-2 mt-4">
                  <button onClick={createWO} disabled={!woForm.title || woSaving} className="bg-primary hover:bg-primary-dark text-white font-bold text-sm px-5 py-2 rounded-lg disabled:opacity-50 transition-colors">
                    {woSaving ? 'Saving…' : 'Create'}
                  </button>
                  <button onClick={() => { setShowWoForm(false); setWoError(''); }} className="text-gray-500 hover:text-gray-700 text-sm px-4 py-2 border border-gray-200 rounded-lg transition-colors">Cancel</button>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {workOrders.length === 0 && <div className="col-span-3 text-center py-16 text-gray-400 bg-white border border-gray-200 rounded-xl">No work orders yet.</div>}
              {workOrders.map(wo => (
                <div key={wo.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="font-bold text-[14px] mb-0.5">{wo.title}</div>
                      {wo.customer_name && <div className="text-[12px] text-gray-400">{wo.customer_name}{wo.vehicle ? ` · ${wo.vehicle}` : ''}</div>}
                    </div>
                    <button onClick={() => deleteWO(wo.id)} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"><Trash2 size={14} /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[wo.status] ?? 'bg-gray-100'}`}>{wo.status}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_COLOR[wo.priority] ?? 'bg-gray-100'}`}>{wo.priority}</span>
                  </div>
                  {wo.tech_name && <div className="text-[12px] text-gray-500 mb-1">👤 {wo.tech_name}</div>}
                  {wo.estimated_hours && <div className="text-[12px] text-gray-500 mb-1">⏱ {wo.estimated_hours}h estimated{wo.actual_hours ? ` · ${wo.actual_hours}h actual` : ''}</div>}
                  {wo.due_date && <div className="text-[12px] text-gray-500 mb-3">📅 Due {new Date(wo.due_date).toLocaleDateString()}</div>}
                  <div className="flex gap-1.5 mt-3 pt-3 border-t border-gray-100">
                    {wo.status !== 'active'    && <button onClick={() => updateWOStatus(wo.id,'active')}    className="text-[11px] px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md font-medium hover:bg-amber-100 transition-colors">→ Active</button>}
                    {wo.status !== 'completed' && <button onClick={() => updateWOStatus(wo.id,'completed')} className="text-[11px] px-2.5 py-1 bg-green-50 text-green-700 rounded-md font-medium hover:bg-green-100 transition-colors">✓ Done</button>}
                    {wo.status !== 'pending'   && <button onClick={() => updateWOStatus(wo.id,'pending')}   className="text-[11px] px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md font-medium hover:bg-gray-200 transition-colors">↩ Pending</button>}
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
              <h2 className="text-[18px] font-bold flex items-center gap-2"><Users size={20} className="text-primary" /> Technicians <span className="text-gray-400 font-normal text-sm">({techs.length})</span></h2>
              <button onClick={() => setShowTechForm(true)} className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-[13px] font-bold px-4 py-2 rounded-lg transition-colors">
                <Plus size={15} /> Add Technician
              </button>
            </div>

            {showTechForm && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
                <h3 className="font-bold mb-4 text-[15px]">New Technician</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input placeholder="Username *" className={fi()} value={techForm.username} onChange={e => setTechForm(f=>({...f,username:e.target.value}))} />
                  <input placeholder="Full name *" className={fi()} value={techForm.name} onChange={e => setTechForm(f=>({...f,name:e.target.value}))} />
                  <input placeholder="Password *" type="password" className={fi()} value={techForm.password} onChange={e => setTechForm(f=>({...f,password:e.target.value}))} />
                  <input placeholder="Specialty (e.g. General Mechanic)" className={fi()} value={techForm.specialty} onChange={e => setTechForm(f=>({...f,specialty:e.target.value}))} />
                </div>
                {techError && <p className="text-red-600 text-[13px] mt-2">{techError}</p>}
                <div className="flex gap-2 mt-2">
                  <button onClick={createTech} disabled={!techForm.username || !techForm.name || !techForm.password || techSaving} className="bg-primary hover:bg-primary-dark text-white font-bold text-sm px-5 py-2 rounded-lg disabled:opacity-50 transition-colors">
                    {techSaving ? 'Saving…' : 'Add'}
                  </button>
                  <button onClick={() => { setShowTechForm(false); setTechError(''); }} className="text-gray-500 text-sm px-4 py-2 border border-gray-200 rounded-lg hover:text-gray-700 transition-colors">Cancel</button>
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-[13px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Name','Username','Specialty','Workload',''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {techs.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">No technicians.</td></tr>}
                  {techs.map(t => (
                    <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">{t.name}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-[12px]">{t.username}</td>
                      <td className="px-4 py-3 text-gray-600">{t.specialty ?? '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-[80px]">
                            <div className="h-1.5 bg-primary rounded-full transition-all" style={{ width: t.total_wos ? `${Math.min(100,(t.active_wos / t.total_wos)*100)}%` : '0%' }} />
                          </div>
                          <span className="text-[11px] text-gray-500 whitespace-nowrap">{t.active_wos} active / {t.total_wos} total</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteTech(t.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
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
  return 'w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-all appearance-none';
}
