'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = JSON.stringify({ username, password });
      const headers = { 'Content-Type': 'application/json' };

      // Try admin first
      const adminRes = await fetch('/api/admin/login', { method: 'POST', headers, body });
      if (adminRes.ok) {
        router.push('/admin/dashboard');
        return;
      }

      // If admin credentials didn't match, try technician
      const techRes = await fetch('/api/technician/login', { method: 'POST', headers, body });
      if (techRes.ok) {
        router.push('/technician/dashboard');
        return;
      }

      // Both failed
      const data = await techRes.json().catch(() => ({}));
      setError(data.error ?? 'Invalid credentials.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center p-4"
      style={{ backgroundImage: 'linear-gradient(rgba(245,166,35,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(245,166,35,.025) 1px,transparent 1px)', backgroundSize: '60px 60px' }}>

      {/* Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(245,166,35,.06) 0%,transparent 65%)' }} />

      <div className="relative z-10 w-full max-w-[400px]">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-white text-[24px] font-black tracking-tight">
            WorldClass <span className="text-primary">Auto</span>
          </div>
          <div className="inline-flex items-center gap-2 mt-2 border border-primary/25 bg-primary/8 text-primary text-[10px] font-bold tracking-[.12em] uppercase px-3 py-1.5 rounded-full">
            Staff Portal
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/60">
          <h1 className="text-[20px] font-black text-white mb-1">Sign In</h1>
          <p className="text-[13px] text-white/35 mb-7">Sign in with your admin or technician credentials.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-[13px] px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-white/40 uppercase tracking-[.1em] mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(245,166,35,.08)] transition-all"
                style={{ color: 'white' }}
                placeholder="username"
                autoComplete="username"
                required
              />
            </div>

            <div className="mb-7">
              <label className="block text-[11px] font-bold text-white/40 uppercase tracking-[.1em] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 bg-[#1a1a1a] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(245,166,35,.08)] transition-all"
                  style={{ color: 'white' }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-3.5 rounded-xl text-[15px] flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              {loading
                ? <span className="animate-spin border-2 border-black/20 border-t-black rounded-full w-4 h-4" />
                : <><LogIn size={16} /> Sign In</>
              }
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-white/25 text-[12px] hover:text-white/55 transition-colors">← Back to website</a>
        </div>
      </div>
    </div>
  );
}
