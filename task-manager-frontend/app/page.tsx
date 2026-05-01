"use client";

import Link from 'next/link';
import { useState } from 'react';

const ACCORDION_DATA = [
  {
    id: 1,
    title: "Role-Based Access Controls",
    content: "Secure project boundaries with dedicated Observer, Team Member, and Project Manager permissions integrated entirely into the backend logic. Ensure compliance and strict workspace governance automatically."
  },
  {
    id: 2,
    title: "Real-time Metrics & Insights",
    content: "Rapidly interact with aggregated task completion trends and priority breakdowns through dynamically generated visualizations powered by high-performance native MongoDB pipelines."
  },
  {
    id: 3,
    title: "Advanced Task Management",
    content: "Add, review, and securely maintain historical task records with fully authenticated CRUD controls. Enjoy archive architectures and advanced dynamic filtering by priority and status."
  }
];

export default function LandingPage() {
  const [openId, setOpenId] = useState(1);

  return (
    <div className="min-h-screen bg-[#F2F2F7] selection:bg-emerald-100 font-sans text-[#1C1C1E] overflow-x-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes iosFadeUp {
          from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-ios { 
          animation: iosFadeUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; 
          opacity: 0;
        }
        .delay-1 { animation-delay: 100ms; }
        .delay-2 { animation-delay: 200ms; }
        .delay-3 { animation-delay: 300ms; }
        
        .ios-blur {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }
      `}} />

      {/* iOS Floating Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-center animate-ios delay-1">
        <div className="ios-blur px-6 py-3 rounded-full border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex items-center justify-between w-full max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
            </div>
            <span className="text-sm font-black tracking-tight uppercase">TaskManagerOS</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[11px] font-black uppercase tracking-widest text-[#8E8E93] hover:text-emerald-600 transition-colors">SignIn</Link>
            <Link href="/register" className="px-5 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-emerald-700 active:scale-95 transition-all shadow-md">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* iOS Hero Section */}
        <section className="text-center mb-16 animate-ios delay-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-white/60 shadow-sm text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Team Project Management Made Simple
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[1.1] mb-6">
            Track your Tasks,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Perfectly Organized.</span>
          </h1>
          <p className="max-w-xl mx-auto text-[13px] md:text-base font-bold text-[#8E8E93] leading-relaxed mb-10 px-4">
            A simple and secure way to manage your project workflows. See where your effort goes with clear progress charts and interactive task boards.
          </p>
        </section>

        {/* iOS Bento Box Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 animate-ios delay-3">
          {/* Large Core Feature Box */}
          <div className="md:col-span-4 lg:col-span-4 bg-white rounded-[2.5rem] p-10 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] group hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all duration-700">
            <div className="flex flex-col h-full justify-between gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h3 className="text-2xl font-black tracking-tight">Stay Secure</h3>
                <p className="text-sm font-bold text-[#8E8E93] leading-relaxed max-w-sm">
                  Your project data is protected with limited access based on your team role. Only authorized members can modify critical task sequences.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="px-4 py-2 bg-emerald-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-emerald-600">Private & Safe</div>
                <div className="px-4 py-2 bg-teal-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-teal-600">Access Control</div>
              </div>
            </div>
          </div>

          {/* Side Box 1 */}
          <div className="md:col-span-2 lg:col-span-2 bg-emerald-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-emerald-100 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl transition-all duration-700 group-hover:scale-150"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <h3 className="text-xl font-black tracking-tight">Project Pulse</h3>
              <p className="text-sm font-bold text-white/70 leading-relaxed">
                Monitor task completion trends and team performance metrics at a single glance.
              </p>
            </div>
            <div className="relative z-10 pt-8">
              <Link href="/login" className="inline-flex items-center gap-2 group/btn">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">View Your Summary</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/btn:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>
          </div>

          {/* Wide Box Bottom */}
          <div className="md:col-span-3 lg:col-span-3 bg-white rounded-[2.5rem] p-10 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col h-full justify-between gap-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line></svg>
                </div>
                <h3 className="text-lg font-black tracking-tight">Active Task Board</h3>
              </div>
              <p className="text-[13px] font-bold text-[#8E8E93] leading-relaxed mb-6">
                Maintain a high-fidelity record of all project tasks. Quickly pivot using dynamic priority filtering and smart keyword search.
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="w-2/3 h-full bg-emerald-500"></div></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="w-1/2 h-full bg-teal-500"></div></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="w-4/5 h-full bg-emerald-400"></div></div>
              </div>
            </div>
          </div>

          {/* Ready for Deployment Card */}
          <div className="md:col-span-1 lg:col-span-3 bg-white rounded-[2.5rem] p-10 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-center items-center text-center group">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 className="text-base font-black tracking-tight mb-2 uppercase">Ready for Deployment</h3>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Optimized & Scalable</p>
          </div>
        </div>
      </main>

      {/* Footer Minimalist */}
      <footer className="py-12 text-center animate-ios delay-3">
        <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.3em]">
          Powered by Enterprise Task Management Architecture
        </p>
      </footer>
    </div>
  );
}
