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
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push('/admin/dashboard');
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
    <div className="min-h-screen bg-gradient-to-br from-[#0c0c0c] via-[#1a0404] to-[#230808] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-8">
          <div className="text-white text-[22px] font-black">WorldClass <span className="text-primary">Auto</span></div>
          <div className="text-white/40 text-[13px] mt-1">Admin Portal</div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h1 className="text-[20px] font-bold mb-6">Sign In</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(220,38,38,.09)] transition-all"
                placeholder="admin"
                autoComplete="username"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-[13px] font-semibold mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(220,38,38,.09)] transition-all"
                  placeholder="••••••"
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg text-[15px] flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {loading
                ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" />
                : <><LogIn size={16} /> Sign In</>
              }
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <a href="/" className="text-white/30 text-[12px] hover:text-white/60 transition-colors">← Back to website</a>
        </div>
      </div>
    </div>
  );
}
