"use client";

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import RoleBadge from './ui/RoleBadge';
import toast from 'react-hot-toast';

export interface Task {
  _id: string;
  weight: number;
  priority: string;
  status: string;
  title: string;
  notes: string;
  date: string;
  assignedTo?: { _id: string; name: string; email: string };
}

const getStatusConfig = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'done':
      return { label: 'DONE', dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' };
    case 'todo':
      return { label: 'TODO', dot: 'bg-slate-400', text: 'text-slate-500', bg: 'bg-slate-50' };
    case 'in_progress':
      return { label: 'IN PROGRESS', dot: 'bg-indigo-500', text: 'text-indigo-600', bg: 'bg-indigo-50' };
    case 'in_dev':
      return { label: 'IN DEVELOPMENT', dot: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' };
    case 'in_review':
      return { label: 'IN REVIEW', dot: 'bg-purple-500', text: 'text-purple-600', bg: 'bg-purple-50' };
    case 'deployed':
      return { label: 'DEPLOYED', dot: 'bg-sky-500', text: 'text-sky-600', bg: 'bg-sky-50' };
    default:
      return { label: 'PENDING', dot: 'bg-slate-400', text: 'text-slate-500', bg: 'bg-slate-50' };
  }
};

interface TaskTableProps {
  refreshTrigger?: number;
  onUpdate?: () => void;
  onEdit?: (task: Task) => void;
  onAdd?: () => void;
  userRole?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  filterStatus?: string;
  filterPriority?: string;
  sortBy?: string;
  showViewAll?: boolean;
}

export default function TaskTable({ 
  refreshTrigger, 
  onUpdate, 
  onEdit, 
  onAdd,
  userRole, 
  startDate, 
  endDate,
  searchQuery = '',
  filterStatus = 'All Status',
  filterPriority = 'All Priorities',
  sortBy = 'Newest First',
  showViewAll = false
}: TaskTableProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res = await api.get('/tasks', { params });
      
      if (res.data && Array.isArray(res.data.data)) {
        setTasks(res.data.data);
      } else if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger, startDate, endDate]);

  const handleDelete = async (id: string) => {
    toast.dismiss();
    
    toast((t) => (
      <div className="flex items-center gap-4">
        <span className="text-[11px] font-black uppercase tracking-tight">Archive task?</span>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const deletePromise = api.delete(`/tasks/${id}`);
                await toast.promise(deletePromise, {
                  loading: 'Processing archival...',
                  success: 'Task successfully archived',
                  error: 'Error during archival sequence',
                });
                fetchTasks();
                if (onUpdate) onUpdate();
              } catch (err) {
                console.error(err);
              }
            }}
            className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors"
          >
            Confirm
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: {
        minWidth: '350px',
        padding: '12px 16px'
      }
    });
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const updatePromise = api.patch(`/tasks/${taskId}`, { status: newStatus });
      await toast.promise(updatePromise, {
        loading: 'Updating status...',
        success: 'Status updated',
        error: 'Failed to update status',
      });
      fetchTasks();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks.filter(t => {
      const matchesSearch = 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.priority.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.weight.toString().includes(searchQuery);
      
      const matchesStatus = 
        filterStatus === 'All Status' || 
        t.status.toLowerCase() === filterStatus.toLowerCase();

      const matchesPriority = 
        filterPriority === 'All Priorities' || 
        t.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    result.sort((a, b) => {
      if (sortBy === 'Newest First') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'Oldest First') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'Highest Effort') return b.weight - a.weight;
      return 0;
    });

    return showViewAll ? result.slice(0, 5) : result;
  }, [tasks, searchQuery, filterStatus, filterPriority, sortBy, showViewAll]);

  if (loading) return (
    <div className="py-12 flex justify-center items-center">
      <div className="w-6 h-6 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
      <div className="px-8 py-8 border-b border-slate-50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">RECENT ACTIVITY</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Task activity stream</p>
        </div>
        {showViewAll && (
           <button onClick={() => window.location.href = '/dashboard/board'} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 transition-all">View Full Board</button>
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">DATE</th>
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">PRIORITY/TYPE</th>
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">STATUS</th>
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">TITLE / NOTES</th>
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">ASSIGNEE</th>
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 text-right">WEIGHT</th>
              {(userRole?.toLowerCase() === 'admin' || userRole?.toLowerCase() === 'member') && !showViewAll && (
                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 text-right">ACTIONS</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredAndSortedTasks.map((t) => (
              <tr key={t._id} className="group hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-5">
                  <p className="text-xs font-black text-slate-800 tracking-tight">{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p className="text-[8px] font-black text-slate-300 uppercase mt-0.5 tracking-widest">{new Date(t.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-600 uppercase tracking-widest">{t.priority}</span>
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center gap-2 group/status relative">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusConfig(t.status).dot} ${t.status === 'done' ? 'animate-pulse' : ''}`}></div>
                      <select 
                        value={t.status}
                        onChange={(e) => handleStatusChange(t._id, e.target.value)}
                        className={`bg-transparent border-none p-0 text-[9px] font-black uppercase tracking-widest cursor-pointer outline-none appearance-none hover:opacity-70 transition-opacity ${getStatusConfig(t.status).text}`}
                      >
                        <option value="todo">TODO</option>
                        <option value="in_progress">IN PROGRESS</option>
                        <option value="in_dev">IN DEVELOPMENT</option>
                        <option value="in_review">IN REVIEW</option>
                        <option value="deployed">DEPLOYED</option>
                        <option value="done">DONE</option>
                      </select>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover/status:opacity-100 transition-opacity"><polyline points="6 9 12 15 18 9"></polyline></svg>
                   </div>
                </td>
                <td className="px-8 py-5">
                  <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate max-w-[180px]">{t.title}</p>
                  <p className="text-[9px] font-bold text-slate-400 max-w-[180px] truncate mt-0.5">{t.notes || 'No additional notes'}</p>
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[8px] font-black text-indigo-600 uppercase">
                        {t.assignedTo?.name ? t.assignedTo.name.substring(0, 2) : '??'}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">
                        {t.assignedTo?.name || 'Unassigned'}
                      </span>
                   </div>
                </td>
                <td className={`px-8 py-5 text-right text-xs font-black tracking-tight ${t.status === 'done' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {t.weight.toLocaleString('en-US')}
                </td>
                {(userRole?.toLowerCase() === 'admin' || userRole?.toLowerCase() === 'member') && !showViewAll && (
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      <button 
                        onClick={() => onEdit && onEdit(t)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Update Status / Edit"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      {userRole?.toLowerCase() === 'admin' && (
                        <button 
                          onClick={() => handleDelete(t._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Archive Task"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-px bg-slate-50">
        {filteredAndSortedTasks.map((t) => (
          <div key={t._id} className="bg-white p-6 flex flex-col gap-5 active:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${getStatusConfig(t.status).dot} ${t.status === 'done' ? 'animate-pulse' : ''}`}></div>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">{t.priority}</h3>
                </div>
              </div>
              <p className={`text-sm font-black tracking-tighter ${getStatusConfig(t.status).text}`}>
                {t.weight.toLocaleString('en-US')}
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">{t.title}</h3>
              {t.notes && (
                <p className="text-[10px] font-bold text-slate-500 line-clamp-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  {t.notes}
                </p>
              )}
            </div>

            {userRole?.toLowerCase() === 'admin' && !showViewAll && (
              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={() => onEdit && onEdit(t)}
                  className="flex-1 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-indigo-100 active:scale-95 transition-all shadow-sm shadow-indigo-100"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  Edit Task
                </button>
                <button 
                  onClick={() => handleDelete(t._id)}
                  className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-100 active:scale-95 transition-all shadow-sm shadow-rose-100"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAndSortedTasks.length === 0 && (
        <div className="py-24 text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-sm border border-slate-100">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Task Board Empty</p>
            <p className="text-[11px] font-bold text-slate-400">No tasks match your current filter parameters.</p>
          </div>
          {!searchQuery && filterStatus === 'All Status' && filterPriority === 'All Priorities' && userRole?.toLowerCase() === 'admin' && (
            <div className="pt-4">
               <button 
                 onClick={onAdd}
                 className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
               >
                 Create First Task
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
