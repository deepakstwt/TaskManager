"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Verify token is still valid
          await api.get('/auth/profile');
          router.push('/dashboard');
          return; // Don't stop loading if redirecting
        } catch (err) {
          // Token invalid, clear it
          localStorage.removeItem('access_token');
        }
      }
      setCheckingSession(false);
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        router.push('/dashboard');
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4 font-sans">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md">
           <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verifying Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-gray-200">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-100 { animation-delay: 100ms; }
        .bg-grid {
          background-size: 50px 50px;
          background-image: linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
        }
      `}} />
      <div className="absolute inset-0 z-0 bg-grid justify-center [mask-image:radial-gradient(ellipse_at_top,black,transparent_80%)]"></div>
      
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md opacity-0 animate-fade-up">
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-gray-500">
          Enter your credentials to access your dashboard
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md opacity-0 animate-fade-up delay-100">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-200/60">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 bg-red-50/80 backdrop-blur-sm text-red-600 border border-red-100 rounded-xl text-sm font-semibold flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold tracking-wide text-gray-700">Email Address</label>
              <div className="mt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
                  placeholder="name@example.com"
                  spellCheck="false"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold tracking-wide text-gray-700">Password</label>
              <div className="mt-2 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-black hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center">
            <p className="text-sm font-medium text-gray-500">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-black hover:text-gray-700 transition hover:underline underline-offset-4">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
