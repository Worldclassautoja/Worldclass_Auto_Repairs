'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Play, CheckCircle, Clock, RefreshCw, BarChart3 } from 'lucide-react';
import { formatCost } from '@/lib/presets';

interface WorkOrder {
  id: number; title: string; vehicle?: string; customer_name?: string;
  service_type?: string; status: string; priority: string;
  estimated_hours?: number; actual_hours?: number;
  base_cost?: number; labor_rate?: number; total_cost?: number;
  due_date?: string; notes?: string; started_at?: string; completed_at?: string;
}
interface TechProfile { id: number; name: string; username: string; specialty?: string; active_work_orders: number; }

const PRIORITY_COLOR: Record<string, string> = {
  low:    'bg-white/[0.06] text-white/60',
  medium: 'bg-blue-500/10 text-blue-400',
  high:   'bg-orange-500/10 text-orange-400',
  urgent: 'bg-red-500/10 text-red-400',
};

function elapsed(startedAt: string) {
  const ms = Date.now() - new Date(startedAt).getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function TechDashboard() {
  const router = useRouter();
  const [tech, setTech]   = useState<TechProfile | null>(null);
  const [wos, setWos]     = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<number | null>(null);
  const [actualHours, setActualHours] = useState('');
  const [view, setView]   = useState<'jobs' | 'timecard'>('jobs');
  const [tcFrom, setTcFrom] = useState('');
  const [tcTo, setTcTo]     = useState('');

  useEffect(() => {
    fetch('/api/technician/me')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setTech(d))
      .catch(() => router.push('/technician'));
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetch('/api/technician/work-orders').then(r => r.ok ? r.json() : []);
    setWos(data);
    setLoading(false);
  }, []);

  useEffect(() => { if (tech) load(); }, [tech, load]);

  async function start(id: number) {
    await fetch('/api/technician/work-orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'start' }),
    });
    load();
  }

  function beginComplete(wo: WorkOrder) {
    setCompleting(wo.id);
    setActualHours(wo.estimated_hours ? String(wo.estimated_hours) : '');
  }

  async function complete(id: number) {
    if (!actualHours || isNaN(Number(actualHours))) return;
    await fetch('/api/technician/work-orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'complete', actual_hours: Number(actualHours) }),
    });
    setCompleting(null);
    setActualHours('');
    load();
  }

  async function logout() {
    await fetch('/api/technician/logout', { method: 'POST' });
    window.location.href = '/technician';
  }

  const active    = wos.filter(w => w.status === 'active');
  const queued    = wos.filter(w => w.status === 'pending');
  const completed = wos.filter(w => w.status === 'completed');

  /* ── Time card calculations — filtered by optional date range ── */
  const tcFiltered = completed.filter(w => {
    if (!w.completed_at) return true;
    const d = new Date(w.completed_at);
    if (tcFrom && d < new Date(tcFrom + 'T00:00:00')) return false;
    if (tcTo   && d > new Date(tcTo   + 'T23:59:59')) return false;
    return true;
  });

  const totalHours   = tcFiltered.reduce((s, w) => s + Number(w.actual_hours ?? 0), 0);
  const totalRevenue = tcFiltered.reduce((s, w) => s + Number(w.total_cost  ?? 0), 0);

  const byCategory = tcFiltered.reduce<Record<string, { count: number; hours: number; revenue: number }>>((acc, w) => {
    const key = w.service_type ?? 'Uncategorised';
    if (!acc[key]) acc[key] = { count: 0, hours: 0, revenue: 0 };
    acc[key].count++;
    acc[key].hours   += Number(w.actual_hours ?? 0);
    acc[key].revenue += Number(w.total_cost   ?? 0);
    return acc;
  }, {});

  if (!tech) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="animate-spin border-4 border-primary border-t-transparent rounded-full w-8 h-8" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/[0.07] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <span className="font-black text-[16px] text-white">{tech.name}</span>
              {tech.specialty && <span className="text-white/40 text-[13px] ml-2">· {tech.specialty}</span>}
              {tech.active_work_orders > 0 && (
                <span className="ml-2 bg-amber-500/15 text-amber-400 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {tech.active_work_orders} active
                </span>
              )}
            </div>
            {/* View toggle */}
            <div className="flex gap-1 bg-white/[0.07] rounded-lg p-1 ml-2">
              <button
                onClick={() => setView('jobs')}
                className={`px-3 py-1 rounded-md text-[12px] font-semibold transition-colors ${view === 'jobs' ? 'bg-[#222] text-white shadow-sm' : 'text-white/45 hover:text-white/70'}`}
              >
                Jobs
              </button>
              <button
                onClick={() => setView('timecard')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-semibold transition-colors ${view === 'timecard' ? 'bg-[#222] text-white shadow-sm' : 'text-white/45 hover:text-white/70'}`}
              >
                <BarChart3 size={12} /> Time Card
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} className="p-1.5 text-white/40 hover:text-white/80 transition-colors"><RefreshCw size={15} /></button>
            <button onClick={logout} className="flex items-center gap-1.5 text-[13px] text-white/50 hover:text-red-400 transition-colors"><LogOut size={14} /> Sign out</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin border-4 border-primary border-t-transparent rounded-full w-8 h-8" />
          </div>
        )}

        {/* ── JOBS VIEW ── */}
        {!loading && view === 'jobs' && (
          <div className="grid lg:grid-cols-3 gap-6">

            {/* ACTIVE */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Play size={16} className="text-amber-400" />
                <h2 className="font-bold text-[15px] text-white">Active <span className="text-white/35 font-normal text-sm">({active.length})</span></h2>
              </div>
              {active.length === 0 && <EmptyCol text="No active jobs" />}
              {active.map(wo => (
                <WOCard key={wo.id} wo={wo} accent="amber">
                  {wo.started_at && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold mb-3">
                      <Clock size={11} /> Running {elapsed(wo.started_at)}
                    </div>
                  )}
                  {completing === wo.id ? (
                    <div className="mt-3 space-y-2">
                      <div>
                        <label className="text-[11px] text-white/50 font-semibold block mb-1">Total actual hours worked</label>
                        <div className="flex gap-2">
                          <input
                            type="number" step="0.5" min="0.5"
                            placeholder="Actual hours"
                            value={actualHours}
                            onChange={e => setActualHours(e.target.value)}
                            className="flex-1 px-2.5 py-1.5 border border-white/10 rounded-md text-sm bg-[#1a1a1a] text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                          />
                          <button onClick={() => complete(wo.id)} className="bg-green-600 hover:bg-green-700 text-white text-[12px] font-bold px-3 py-1.5 rounded-md transition-colors">Done</button>
                          <button onClick={() => { setCompleting(null); setActualHours(''); }} className="text-white/50 text-[12px] px-2 py-1.5 border border-white/10 rounded-md hover:border-white/25 transition-colors">✕</button>
                        </div>
                      </div>
                      {actualHours && wo.base_cost != null && (
                        <CostPreview wo={wo} actualHours={Number(actualHours)} />
                      )}
                      {wo.estimated_hours != null && Number(actualHours) > wo.estimated_hours && (
                        <div className="text-[11px] text-orange-400 bg-orange-500/10 border border-orange-500/15 rounded-md px-2.5 py-1.5">
                          +{(Number(actualHours) - wo.estimated_hours).toFixed(1)}h over estimate
                          {wo.labor_rate != null && ` · ${formatCost((Number(actualHours) - wo.estimated_hours) * wo.labor_rate)} additional`}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button onClick={() => beginComplete(wo)} className="mt-3 w-full flex items-center justify-center gap-1.5 bg-green-500/10 hover:bg-green-500/15 text-green-400 text-[12px] font-bold py-2 rounded-lg transition-colors">
                      <CheckCircle size={13} /> Complete Job
                    </button>
                  )}
                </WOCard>
              ))}
            </div>

            {/* QUEUED */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-white/40" />
                <h2 className="font-bold text-[15px] text-white">Queued <span className="text-white/35 font-normal text-sm">({queued.length})</span></h2>
              </div>
              {queued.length === 0 && <EmptyCol text="No queued jobs" />}
              {queued.map(wo => (
                <WOCard key={wo.id} wo={wo} accent="gray">
                  <button onClick={() => start(wo.id)} className="mt-3 w-full flex items-center justify-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 text-[12px] font-bold py-2 rounded-lg transition-colors">
                    <Play size={12} /> Start Job
                  </button>
                </WOCard>
              ))}
            </div>

            {/* COMPLETED */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={16} className="text-green-400" />
                <h2 className="font-bold text-[15px] text-white">Completed <span className="text-white/35 font-normal text-sm">({completed.length})</span></h2>
              </div>
              {completed.length === 0 && <EmptyCol text="No completed jobs" />}
              {completed.map(wo => (
                <WOCard key={wo.id} wo={wo} accent="green">
                  {wo.actual_hours != null && (
                    <div className="text-[11px] text-green-400 font-semibold mt-2">
                      ✓ {wo.actual_hours}h actual{wo.estimated_hours != null ? ` vs ${wo.estimated_hours}h est.` : ''}
                    </div>
                  )}
                  {wo.total_cost != null && (
                    <div className="text-[11px] text-white/60 font-semibold mt-0.5">
                      Total: {formatCost(wo.total_cost)}
                    </div>
                  )}
                  {wo.completed_at && (
                    <div className="text-[11px] text-white/30 mt-0.5">
                      {new Date(wo.completed_at).toLocaleString()}
                    </div>
                  )}
                </WOCard>
              ))}
            </div>

          </div>
        )}

        {/* ── TIME CARD VIEW ── */}
        {!loading && view === 'timecard' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-[18px] font-bold text-white flex items-center gap-2">
                <BarChart3 size={20} className="text-primary" /> Work Order Time Card
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] text-white/40 font-semibold">Filter:</span>
                <input
                  type="date" value={tcFrom} onChange={e => setTcFrom(e.target.value)}
                  className="px-2.5 py-1.5 border border-white/10 rounded-lg text-[12px] bg-[#1a1a1a] text-white [color-scheme:dark] focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="From"
                />
                <span className="text-[12px] text-white/30">to</span>
                <input
                  type="date" value={tcTo} onChange={e => setTcTo(e.target.value)}
                  className="px-2.5 py-1.5 border border-white/10 rounded-lg text-[12px] bg-[#1a1a1a] text-white [color-scheme:dark] focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="To"
                />
                {(tcFrom || tcTo) && (
                  <button onClick={() => { setTcFrom(''); setTcTo(''); }} className="text-[12px] text-white/40 hover:text-white/70 px-2 py-1.5 border border-white/10 rounded-lg transition-colors">
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Summary stats */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <StatCard label="Completed Jobs"          value={String(tcFiltered.length)} />
              <StatCard label="Total Hours Logged"      value={`${totalHours.toFixed(1)}h`} />
              <StatCard label="Total Revenue Generated" value={formatCost(totalRevenue)} highlight />
            </div>

            {/* Per-category breakdown */}
            {Object.keys(byCategory).length === 0 ? (
              <div className="bg-[#111] border border-white/[0.07] rounded-xl p-12 text-center text-white/35 text-[14px]">
                No completed work orders yet.
              </div>
            ) : (
              <div className="bg-[#111] border border-white/[0.07] rounded-xl overflow-hidden shadow-sm mb-8">
                <div className="px-5 py-3.5 bg-white/[0.03] border-b border-white/[0.06]">
                  <div className="text-[12px] font-bold text-white/40 uppercase tracking-wide">By Service Category</div>
                </div>
                <table className="w-full text-[13px]">
                  <thead className="border-b border-white/[0.05]">
                    <tr>
                      {['Service Category', 'Jobs', 'Hours Logged', 'Revenue'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(byCategory)
                      .sort((a, b) => b[1].hours - a[1].hours)
                      .map(([cat, stats]) => (
                        <tr key={cat} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3.5 font-semibold text-white/90">{cat}</td>
                          <td className="px-5 py-3.5 text-white/60">{stats.count}</td>
                          <td className="px-5 py-3.5 text-white/60">{stats.hours.toFixed(1)}h</td>
                          <td className="px-5 py-3.5 font-semibold text-green-400">{stats.revenue > 0 ? formatCost(stats.revenue) : '—'}</td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot className="bg-white/[0.03] border-t border-white/[0.06]">
                    <tr>
                      <td className="px-5 py-3 font-black text-white/60 text-[11px] uppercase tracking-wide">Total</td>
                      <td className="px-5 py-3 font-bold text-white">{completed.length}</td>
                      <td className="px-5 py-3 font-bold text-white">{totalHours.toFixed(1)}h</td>
                      <td className="px-5 py-3 font-bold text-green-400">{formatCost(totalRevenue)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* Completed work orders log */}
            {tcFiltered.length > 0 && (
              <div className="bg-[#111] border border-white/[0.07] rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 bg-white/[0.03] border-b border-white/[0.06]">
                  <div className="text-[12px] font-bold text-white/40 uppercase tracking-wide">Completed Work Orders</div>
                </div>
                <table className="w-full text-[13px]">
                  <thead className="border-b border-white/[0.05]">
                    <tr>
                      {['Service', 'Vehicle / Customer', 'Est. Hrs', 'Actual Hrs', 'Base Cost', 'Total Cost', 'Completed'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tcFiltered.map(wo => {
                      const actualH = wo.actual_hours != null ? Number(wo.actual_hours) : null;
                      const estH    = wo.estimated_hours != null ? Number(wo.estimated_hours) : null;
                      const overEst = actualH != null && estH != null && actualH > estH;
                      return (
                        <tr key={wo.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-white/90">{wo.title}</div>
                            {wo.service_type && <div className="text-[11px] text-white/35">{wo.service_type}</div>}
                          </td>
                          <td className="px-4 py-3 text-white/55 text-[12px]">
                            {[wo.customer_name, wo.vehicle].filter(Boolean).join(' · ') || '—'}
                          </td>
                          <td className="px-4 py-3 text-white/50">{estH != null ? `${estH}h` : '—'}</td>
                          <td className={`px-4 py-3 font-semibold ${overEst ? 'text-orange-400' : 'text-white/80'}`}>
                            {actualH != null ? `${actualH}h` : '—'}
                            {overEst && estH != null && actualH != null && (
                              <span className="text-[10px] font-normal block text-orange-400/70">+{(actualH - estH).toFixed(1)}h over</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-white/55">{wo.base_cost != null ? formatCost(wo.base_cost) : '—'}</td>
                          <td className="px-4 py-3 font-semibold text-green-400">{wo.total_cost != null ? formatCost(wo.total_cost) : '—'}</td>
                          <td className="px-4 py-3 text-white/35 text-[12px]">
                            {wo.completed_at ? new Date(wo.completed_at).toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CostPreview({ wo, actualHours }: { wo: WorkOrder; actualHours: number }) {
  const base  = wo.base_cost ?? 0;
  const est   = wo.estimated_hours ?? 0;
  const rate  = wo.labor_rate ?? 3500;
  const extra = Math.max(0, actualHours - est);
  const total = base + extra * rate;
  return (
    <div className="text-[11px] bg-white/[0.03] border border-white/[0.07] rounded-md px-2.5 py-2 text-white/55 space-y-0.5">
      <div className="flex justify-between"><span>Base cost</span><span className="font-semibold text-white/75">{formatCost(base)}</span></div>
      {extra > 0 && <div className="flex justify-between text-orange-400"><span>+{extra.toFixed(1)}h × {formatCost(rate)}</span><span className="font-semibold">{formatCost(extra * rate)}</span></div>}
      <div className="flex justify-between font-bold text-white pt-1 border-t border-white/[0.07]"><span>Estimated total</span><span>{formatCost(total)}</span></div>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-5 border ${highlight ? 'bg-green-500/10 border-green-500/20' : 'bg-[#111] border-white/[0.07]'}`}>
      <div className={`text-[28px] font-black leading-none mb-1 ${highlight ? 'text-green-400' : 'text-white'}`}>{value}</div>
      <div className="text-[12px] text-white/45 font-medium">{label}</div>
    </div>
  );
}

function WOCard({ wo, accent, children }: { wo: WorkOrder; accent: string; children: React.ReactNode }) {
  const border = accent === 'amber' ? 'border-l-amber-500' : accent === 'green' ? 'border-l-green-500' : 'border-l-white/20';
  return (
    <div className={`bg-[#111] border border-white/[0.08] border-l-4 ${border} rounded-xl p-4 mb-3`}>
      <div className="font-bold text-[14px] text-white mb-0.5">{wo.title}</div>
      {(wo.customer_name || wo.vehicle) && (
        <div className="text-[12px] text-white/35 mb-2">{[wo.customer_name, wo.vehicle].filter(Boolean).join(' · ')}</div>
      )}
      {wo.service_type && <div className="text-[12px] text-white/50 mb-1.5">{wo.service_type}</div>}
      <div className="flex flex-wrap gap-1.5">
        {wo.priority !== 'medium' && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PRIORITY_COLOR[wo.priority]}`}>{wo.priority}</span>
        )}
        {wo.due_date && <span className="text-[10px] text-white/35 bg-white/[0.05] px-2 py-0.5 rounded-full">Due {new Date(wo.due_date).toLocaleDateString()}</span>}
        {wo.estimated_hours != null && <span className="text-[10px] text-white/35 bg-white/[0.05] px-2 py-0.5 rounded-full">{wo.estimated_hours}h est.</span>}
        {wo.base_cost != null && <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">{formatCost(wo.base_cost)}</span>}
      </div>
      {wo.notes && <div className="text-[12px] text-white/30 mt-2 italic">&ldquo;{wo.notes}&rdquo;</div>}
      {children}
    </div>
  );
}

function EmptyCol({ text }: { text: string }) {
  return <div className="bg-[#111] border border-white/[0.07] rounded-xl p-8 text-center text-white/35 text-[13px]">{text}</div>;
}
