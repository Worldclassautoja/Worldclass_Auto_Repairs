'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Play, CheckCircle, Clock, RefreshCw } from 'lucide-react';

interface WorkOrder {
  id: number; title: string; vehicle?: string; customer_name?: string;
  service_type?: string; status: string; priority: string;
  estimated_hours?: number; actual_hours?: number;
  due_date?: string; notes?: string; started_at?: string; completed_at?: string;
}
interface TechProfile { id: number; name: string; username: string; specialty?: string; active_count: number; }

const PRIORITY_COLOR: Record<string, string> = {
  low:    'bg-gray-100 text-gray-600',
  medium: 'bg-blue-50 text-blue-700',
  high:   'bg-orange-50 text-orange-700',
  urgent: 'bg-red-50 text-red-700',
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
  const [now, setNow]     = useState(Date.now());

  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    fetch('/api/technician/me')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setTech(d))
      .catch(() => router.push('/technician'));
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    const wos = await fetch('/api/technician/work-orders').then(r => r.ok ? r.json() : []);
    setWos(wos);
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
    router.push('/technician');
  }

  const active    = wos.filter(w => w.status === 'active');
  const queued    = wos.filter(w => w.status === 'pending');
  const completed = wos.filter(w => w.status === 'completed');

  if (!tech) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin border-4 border-primary border-t-transparent rounded-full w-8 h-8" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div>
            <span className="font-black text-[16px]">{tech.name}</span>
            {tech.specialty && <span className="text-gray-400 text-[13px] ml-2">· {tech.specialty}</span>}
            {tech.active_count > 0 && <span className="ml-2 bg-amber-100 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{tech.active_count} active</span>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"><RefreshCw size={15} /></button>
            <button onClick={logout} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-red-600 transition-colors"><LogOut size={14} /> Sign out</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && <div className="flex justify-center py-16"><div className="animate-spin border-4 border-primary border-t-transparent rounded-full w-8 h-8" /></div>}

        {!loading && (
          <div className="grid lg:grid-cols-3 gap-6">

            {/* ACTIVE JOBS */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Play size={16} className="text-amber-600" />
                <h2 className="font-bold text-[15px]">Active <span className="text-gray-400 font-normal text-sm">({active.length})</span></h2>
              </div>
              {active.length === 0 && <EmptyCol text="No active jobs" />}
              {active.map(wo => (
                <WOCard key={wo.id} wo={wo} accent="amber">
                  {wo.started_at && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mb-3">
                      <Clock size={11} /> Running {elapsed(wo.started_at)}
                    </div>
                  )}
                  {completing === wo.id ? (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="number" step="0.5" min="0.5" placeholder="Actual hours"
                        value={actualHours}
                        onChange={e => setActualHours(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-primary"
                      />
                      <button onClick={() => complete(wo.id)} className="bg-green-600 hover:bg-green-700 text-white text-[12px] font-bold px-3 py-1.5 rounded-md transition-colors">Done</button>
                      <button onClick={() => { setCompleting(null); setActualHours(''); }} className="text-gray-500 text-[12px] px-2 py-1.5 border border-gray-200 rounded-md">✕</button>
                    </div>
                  ) : (
                    <button onClick={() => setCompleting(wo.id)} className="mt-3 w-full flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-[12px] font-bold py-2 rounded-lg transition-colors">
                      <CheckCircle size={13} /> Complete Job
                    </button>
                  )}
                </WOCard>
              ))}
            </div>

            {/* QUEUED */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-gray-500" />
                <h2 className="font-bold text-[15px]">Queued <span className="text-gray-400 font-normal text-sm">({queued.length})</span></h2>
              </div>
              {queued.length === 0 && <EmptyCol text="No queued jobs" />}
              {queued.map(wo => (
                <WOCard key={wo.id} wo={wo} accent="gray">
                  <button onClick={() => start(wo.id)} className="mt-3 w-full flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[12px] font-bold py-2 rounded-lg transition-colors">
                    <Play size={12} /> Start Job
                  </button>
                </WOCard>
              ))}
            </div>

            {/* COMPLETED */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={16} className="text-green-600" />
                <h2 className="font-bold text-[15px]">Completed <span className="text-gray-400 font-normal text-sm">({completed.length})</span></h2>
              </div>
              {completed.length === 0 && <EmptyCol text="No completed jobs" />}
              {completed.map(wo => (
                <WOCard key={wo.id} wo={wo} accent="green">
                  {wo.actual_hours && (
                    <div className="text-[11px] text-green-600 font-semibold mt-2">
                      ✓ {wo.actual_hours}h actual{wo.estimated_hours ? ` vs ${wo.estimated_hours}h est.` : ''}
                    </div>
                  )}
                  {wo.completed_at && (
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {new Date(wo.completed_at).toLocaleString()}
                    </div>
                  )}
                </WOCard>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

function WOCard({ wo, accent, children }: { wo: WorkOrder; accent: string; children: React.ReactNode }) {
  const border = accent === 'amber' ? 'border-l-amber-400' : accent === 'green' ? 'border-l-green-400' : 'border-l-gray-300';
  return (
    <div className={`bg-white border border-gray-200 border-l-4 ${border} rounded-xl p-4 mb-3 shadow-sm`}>
      <div className="font-bold text-[14px] mb-0.5">{wo.title}</div>
      {(wo.customer_name || wo.vehicle) && (
        <div className="text-[12px] text-gray-400 mb-2">{[wo.customer_name, wo.vehicle].filter(Boolean).join(' · ')}</div>
      )}
      {wo.service_type && <div className="text-[12px] text-gray-500 mb-1.5">{wo.service_type}</div>}
      <div className="flex flex-wrap gap-1.5">
        {wo.priority !== 'medium' && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PRIORITY_COLOR[wo.priority]}`}>{wo.priority}</span>
        )}
        {wo.due_date && <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Due {new Date(wo.due_date).toLocaleDateString()}</span>}
        {wo.estimated_hours && <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{wo.estimated_hours}h est.</span>}
      </div>
      {wo.notes && <div className="text-[12px] text-gray-400 mt-2 italic">"{wo.notes}"</div>}
      {children}
    </div>
  );
}

function EmptyCol({ text }: { text: string }) {
  return <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-[13px]">{text}</div>;
}
