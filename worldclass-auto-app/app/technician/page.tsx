'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, Wrench } from 'lucide-react';

export default function TechnicianLogin() {
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
      const res = await fetch('/api/technician/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push('/technician/dashboard');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Invalid credentials.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#0A0A0A' }}
    >
      {/* Amber grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(245,166,35,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(245,166,35,.04) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Top glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(245,166,35,.10) 0%,transparent 60%)' }}
      />

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/15 border border-primary/30 rounded-xl mb-3">
            <Wrench size={22} className="text-primary" />
          </div>
          <div className="text-white text-[22px] font-black tracking-tight">
            WorldClass <span className="text-primary">Auto</span>
          </div>
          <div className="text-white/35 text-[13px] mt-1 tracking-wide">Technician Portal</div>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          <h1 className="text-[20px] font-bold text-white mb-1">Sign In</h1>
          <p className="text-white/35 text-[13px] mb-6">Use your workshop credentials</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-[13px] px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-white/50 uppercase tracking-[.08em] mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(245,166,35,.08)] transition-all placeholder:text-white/20"
                style={{ color: 'white' }}
                placeholder="tech1"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-white/50 uppercase tracking-[.08em] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(245,166,35,.08)] transition-all placeholder:text-white/20"
                  style={{ color: 'white' }}
                  placeholder="••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-3 rounded-lg text-[15px] flex items-center justify-center gap-2 transition-all disabled:opacity-60 mt-2"
            >
              {loading
                ? <span className="animate-spin border-2 border-black/30 border-t-black rounded-full w-4 h-4" />
                : <><LogIn size={16} /> Sign In</>
              }
            </button>
          </form>
        </div>

        <div className="text-center mt-5">
          <a href="/" className="text-white/25 text-[12px] hover:text-white/50 transition-colors">
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
