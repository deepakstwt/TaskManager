"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

function RegisterPageContent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCodeLocked, setIsCodeLocked] = useState(false);
  const [isRoleLocked, setIsRoleLocked] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [paramsLoaded, setParamsLoaded] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          await api.get('/auth/profile');
          router.push('/dashboard');
          return;
        } catch (err) {
          localStorage.removeItem('access_token');
        }
      }
      setCheckingSession(false);
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    const roleFromUrl = searchParams.get('role');

    if (codeFromUrl) {
      setInviteCode(codeFromUrl);
      setIsCodeLocked(true);
      setRole('member');
      setIsRoleLocked(true);
    } else {
      setRole('admin');
    }
    setParamsLoaded(true);
  }, [searchParams]);

  useEffect(() => {
    if (paramsLoaded && !isRoleLocked) {
      if (inviteCode && (role === 'admin' || !role)) {
        setRole('member');
      } else if (!inviteCode && role !== 'admin') {
        setRole('admin');
      }
    }
  }, [inviteCode, isRoleLocked, role, paramsLoaded]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (role !== 'admin' && !inviteCode) {
      setError('Member roles require a Project Invite Code to join an existing project.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = { name, email, password, role, inviteCode };
      await api.post('/auth/register', data);
      router.push('/login');
    } catch (err: unknown) {
      const errorData = (err as any).response?.data;
      if (errorData?.message) {
        const msg = errorData.message;
        setError(Array.isArray(msg) ? msg[0] : msg);
      } else {
        setError('Failed to register account. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-emerald-100">
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
      
      {!paramsLoaded || checkingSession ? (
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4 font-sans animate-in fade-in duration-500">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
             <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {checkingSession ? 'Verifying Session...' : 'Preparing Invitation...'}
          </p>
        </div>
      ) : (
        <>
          <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md opacity-0 animate-fade-up">
            <div className="flex justify-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-gray-900 uppercase">
              {inviteCode ? 'Join Project' : 'Create Account'}
            </h2>
            <p className="mt-2 text-center text-sm font-medium text-gray-500">
              {inviteCode ? `You've been invited to join project ${inviteCode}` : 'Launch your own project workspace.'}
            </p>
          </div>

          <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md opacity-0 animate-fade-up delay-100">
            <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-200/60">
              <form className="space-y-5" onSubmit={handleRegister}>
                {error && (
                  <div className="p-3 bg-red-50/80 backdrop-blur-sm text-red-600 border border-red-100 rounded-xl text-sm font-semibold flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold tracking-wide text-gray-700">Full Name</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

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
                      minLength={6}
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

                <div className="animate-in fade-in slide-in-from-top-2 duration-500 delay-200">
                  <label className="block text-sm font-bold tracking-wide text-gray-700 group flex items-center gap-2">
                    Project Invite Code 
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">(Optional)</span>
                  </label>
                  <div className="mt-2 text-center">
                    <input
                      type="text"
                      value={inviteCode}
                      disabled={isCodeLocked}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      className={`appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm tracking-widest selection:bg-emerald-600 selection:text-white ${isCodeLocked ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''}`}
                      placeholder="TASKMANAGER-XXXX"
                    />
                  </div>
                  <p className="mt-2 text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    {isCodeLocked ? 'Locked for your invitation' : 'Leave blank to start a new project'}
                  </p>
                  {inviteCode && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-500 mt-4">
                      <div className="p-4 rounded-xl border border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600 shadow-sm flex items-center justify-between">
                         <div>
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Account Role</p>
                            <p className="text-sm font-bold text-emerald-900">Project Member</p>
                         </div>
                         <div className="w-5 h-5 bg-emerald-600 rounded-full text-white flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                         </div>
                      </div>
                      <p className="mt-3 text-[10px] text-gray-500 font-medium italic flex items-center gap-1.5 px-1 opacity-80">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        You are joining as a member. Roles can be adjusted later by the admin.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : 'Sign Up'}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center">
                <p className="text-sm font-medium text-gray-500">
                  Already have an account?{' '}
                  <Link href="/login" className="font-bold text-black hover:text-gray-700 transition hover:underline underline-offset-4">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  );
}
