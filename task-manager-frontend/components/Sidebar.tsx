"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ConfirmationModal from './ui/ConfirmationModal';

interface SidebarProps {
  userName?: string;
  userRole?: string;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
  onNewEntry?: () => void;
}

export default function Sidebar({ userName, userRole, onLogout, isCollapsed, onToggle, onNewEntry }: SidebarProps) {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    )},
    { label: 'Task Board', href: '/dashboard/board', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
    )},
    ...(userRole?.toLowerCase() === 'admin' ? [{ label: 'Project Team', href: '/dashboard/users', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
    )}] : [])
  ];

  return (
    <>
      {/* Mobile Overlay Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      <aside className={`h-screen fixed left-0 top-0 bg-[#fbfbfb] flex flex-col z-[60] transition-all duration-500 ease-in-out selection:bg-slate-200 border-r border-slate-100/50 
        ${isCollapsed ? 'w-20 -translate-x-full lg:translate-x-0' : 'w-72 translate-x-0'} 
        shadow-2xl lg:shadow-none`}>
        
        {/* Brand Header */}
        <div className={`p-8 flex items-center transition-all duration-500 ${isCollapsed ? 'justify-center border-b border-transparent' : 'gap-4 border-b border-slate-100/30'}`}>
          <button 
            onClick={onToggle}
            className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 ${isCollapsed ? 'bg-indigo-50/50 text-indigo-600 ring-1 ring-indigo-200 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <div className={`flex items-center gap-2 transition-all duration-500 origin-left ${isCollapsed ? 'opacity-0 scale-90 w-0 -translate-x-4 pointer-events-none' : 'opacity-100 scale-100 w-auto translate-x-0'}`}>
             <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
             </div>
             <span className="text-xl font-black tracking-tighter text-slate-900 leading-none whitespace-nowrap">TaskManagerOS</span>
          </div>
        </div>

      {/* Primary Action Section (Gmail Style Layout) */}
      {userRole?.toLowerCase() === 'admin' && (
        <div className={`px-4 mt-2 mb-8 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={onNewEntry}
            className={`group flex items-center bg-white border border-slate-200/60 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 active:scale-95 text-slate-800 overflow-hidden ${
              isCollapsed 
                ? 'w-14 h-14 justify-center rounded-2xl shadow-sm' 
                : 'px-6 py-4 rounded-[1.5rem] w-full gap-4'
            }`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 shrink-0"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 origin-left ${isCollapsed ? 'opacity-0 scale-90 w-0 pointer-events-none' : 'opacity-100 scale-100 w-auto'}`}>
              Create Task
            </span>
          </button>
        </div>
      )}

      {/* Project Navigation Rail */}
      <nav className={`flex-1 px-3 space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);
          
          return (
            <Link 
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`flex items-center rounded-2xl transition-all duration-500 group relative ${
                isCollapsed ? 'w-12 h-12 justify-center mx-auto' : 'px-6 py-3.5 w-full gap-4'
              } ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                  : 'text-slate-400 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <div className={`shrink-0 transition-all duration-500 flex items-center justify-center ${isActive ? 'scale-110' : 'scale-100'}`}>
                {item.icon}
              </div>
              <span className={`text-xs font-black uppercase tracking-widest leading-none whitespace-nowrap transition-all duration-500 origin-left ${isCollapsed ? 'opacity-0 scale-90 translate-x-4 pointer-events-none absolute invisible' : 'opacity-100 scale-100 translate-x-0 relative visible'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className={`ml-auto items-center justify-center transition-all duration-500 ${isCollapsed ? 'opacity-0 scale-0 absolute' : 'flex opacity-100 scale-100 relative'}`}>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Contextual Profile Section */}
      <div className={`p-4 border-t border-slate-100/60 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex flex-col gap-2 ${isCollapsed ? 'items-center' : ''}`}>
          
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'p-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm'}`}>
            <div className={`shrink-0 w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white text-[10px] font-black transition-all duration-500 ${isCollapsed ? 'scale-110' : 'scale-100'}`}>
              {userName?.charAt(0).toUpperCase()}
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-500 origin-left ${isCollapsed ? 'opacity-0 scale-90 w-0 pointer-events-none' : 'opacity-100 scale-100 w-auto'}`}>
              <p className="text-[10px] font-black text-slate-800 truncate uppercase tracking-tighter whitespace-nowrap">{userName}</p>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1 whitespace-nowrap">{userRole?.replace('_', ' ')} access</p>
            </div>
          </div>

          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className={`flex items-center transition-all duration-500 hover:text-rose-600 overflow-hidden ${
              isCollapsed ? 'px-0 p-3 justify-center rounded-full hover:bg-rose-50 text-slate-300 w-12 h-12' : 'px-4 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 rounded-2xl hover:bg-rose-50 w-full gap-3'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span className={`transition-all duration-500 origin-left whitespace-nowrap ${isCollapsed ? 'opacity-0 scale-90 w-0 pointer-events-none' : 'opacity-100 scale-100 w-auto'}`}>Sign Out</span>
          </button>

        </div>
      </div>
    </aside>

    <ConfirmationModal 
      isOpen={isLogoutModalOpen}
      onClose={() => setIsLogoutModalOpen(false)}
      onConfirm={() => {
        setIsLogoutModalOpen(false);
        onLogout();
      }}
      title="Confirm Sign Out"
      message="Are you sure you want to end your session? You will need to login again to access your project dashboard."
      confirmLabel="Sign Out"
      cancelLabel="Stay Logged In"
      variant="danger"
    />
    </>
  );
}
