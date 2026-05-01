"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import CreateTaskModal from '@/components/CreateTaskModal';
import TaskTable from '@/components/TaskTable';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
  const [summary, setSummary] = useState({ totalCompleted: 0, totalPending: 0, overallProgress: 0 });
  const [userRole, setUserRole] = useState('member');
  const [userInfo, setUserInfo] = useState<{name: string, email: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();

  const fetchDashboardData = useCallback(async () => {
    try {
      const [summaryRes, profileRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/auth/profile')
      ]);

      setSummary(summaryRes.data);
      setUserRole(profileRes.data.role);
      setUserInfo({ name: profileRes.data.name, email: profileRes.data.email });
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.push('/login');
      } else {
        console.error('Failed to fetch dashboard data', err);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    const savedState = localStorage.getItem('sidebar_collapsed');
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === 'true');
    }
    return () => clearInterval(interval);
  }, [fetchDashboardData, refreshCounter]);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', String(newState));
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold tracking-tight">Syncing workspace...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-indigo-100 flex overflow-hidden">
      <Sidebar 
        userName={userInfo?.name || 'User'} 
        userRole={userRole} 
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        onNewEntry={() => setIsModalOpen(true)}
      />

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }} 
        onSuccess={() => setRefreshCounter(c => c + 1)} 
        initialData={editingTask}
        userRole={userRole}
      />

      <div className={`flex-1 flex flex-col h-screen transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20 ml-0' : 'lg:ml-72 ml-0'}`}>
        
        <header className="sticky top-0 z-30 bg-[#f8fafc]/90 backdrop-blur-md flex items-center px-6 md:px-8 py-3.5 gap-4 md:gap-8">
           <button 
             onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
             className="lg:hidden p-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600"
           >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
           </button>

           <div className="hidden lg:block w-48">
              <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase">Project Overview</h1>
           </div>

           <div className="flex items-center gap-4 ml-auto">
              <div className="hidden md:flex items-center gap-2.5 bg-white border border-slate-100 px-4 py-2 rounded-full shadow-sm">
                 <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 whitespace-nowrap">
                   {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                 </span>
              </div>
              <div className="h-8 px-4 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[9px] font-black text-slate-900 cursor-pointer hover:border-indigo-200 transition-all uppercase tracking-widest">
                {userRole?.replace('_', ' ')}
              </div>
           </div>
        </header>

        <main className="flex-1 lg:mr-6 lg:mb-6 lg:ml-6 bg-white lg:rounded-[2rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-y-auto">
          <div className="p-4 md:p-8 space-y-8 md:space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                { 
                  label: 'TASKS COMPLETED', 
                  value: summary.totalCompleted, 
                  suffix: ' Units',
                  color: 'text-emerald-700',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
                  bgColor: 'bg-emerald-50/40'
                },
                { 
                  label: 'TASKS PENDING', 
                  value: summary.totalPending, 
                  suffix: ' Units',
                  color: 'text-rose-600',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
                  bgColor: 'bg-rose-50/40'
                },
                { 
                  label: 'OVERALL PROGRESS', 
                  value: summary.overallProgress, 
                  suffix: '%',
                  color: 'text-indigo-700',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
                  bgColor: 'bg-indigo-50/40'
                },
              ].map((card, i) => (
                <div 
                  key={i} 
                  className={`group relative p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 transition-all duration-300 ${card.bgColor} hover:bg-white hover:shadow-xl shadow-sm`}
                >
                   <div className="flex items-center justify-between mb-4 md:mb-5">
                     <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">{card.label}</span>
                     <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl bg-white shadow-md border border-slate-50 flex items-center justify-center ${card.color}`}>
                       {card.icon}
                     </div>
                   </div>
                   <h3 className={`text-2xl md:text-3xl font-black tabular-nums tracking-tighter leading-none ${card.color}`}>
                     {card.value.toLocaleString('en-US')}{card.suffix}
                   </h3>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                 <div className="w-5 h-5 bg-slate-900 rounded-md flex items-center justify-center text-white">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line></svg>
                 </div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">RECENT ACTIVITY</h3>
              </div>
              <div className="mt-4">
                <TaskTable 
                  refreshTrigger={refreshCounter} 
                  onUpdate={() => setRefreshCounter(c => c + 1)} 
                  onEdit={(t: any) => {
                    setEditingTask(t);
                    setIsModalOpen(true);
                  }}
                  onAdd={() => setIsModalOpen(true)}
                  userRole={userRole}
                  showViewAll={true}
                />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
