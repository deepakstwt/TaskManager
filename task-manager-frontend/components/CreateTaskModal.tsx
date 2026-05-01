"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Task {
  _id: string;
  weight: number;
  status: string;
  priority: string;
  date: string;
  title: string;
  notes: string;
  assignedTo?: { _id: string; name: string; email: string } | string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Task | null;
  userRole?: string;
}

export default function CreateTaskModal({ isOpen, onClose, onSuccess, initialData, userRole }: CreateTaskModalProps) {
  const isMember = userRole?.toLowerCase() === 'member';
  const [formData, setFormData] = useState({
    weight: '',
    status: 'todo',
    priority: '',
    date: new Date().toISOString().split('T')[0],
    title: '',
    notes: '',
    assignedTo: ''
  });
  const [teamMembers, setTeamMembers] = useState<{_id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        weight: (initialData.weight || 0).toString(),
        status: initialData.status,
        priority: initialData.priority,
        date: new Date(initialData.date).toISOString().split('T')[0],
        title: initialData.title || '',
        notes: initialData.notes || '',
        assignedTo: typeof initialData.assignedTo === 'object' ? initialData.assignedTo?._id : (initialData.assignedTo || '')
      });
    } else {
      setFormData({
        weight: '',
        status: 'todo',
        priority: '',
        date: new Date().toISOString().split('T')[0],
        title: '',
        notes: '',
        assignedTo: ''
      });
    }

    if (isOpen) {
      fetchTeamMembers();
    }
  }, [initialData, isOpen]);

  const fetchTeamMembers = async () => {
    try {
      const res = await api.get('/users');
      setTeamMembers(res.data);
    } catch (err) {
      console.error('Failed to fetch team members', err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        weight: Number(formData.weight),
        date: new Date(formData.date).toISOString()
      };

      if (initialData?._id) {
        await api.patch(`/tasks/${initialData._id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Insufficient permissions. Admin role required for this action.');
      } else {
        setError('Validation failed. Please verify inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 md:p-10 shadow-2xl relative border border-slate-100 overflow-y-auto max-h-[90vh] custom-scrollbar">
        <button 
           onClick={onClose} 
           className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-full transition-all cursor-pointer group"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <header className="mb-6 md:mb-8">
           <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{initialData ? 'Update Task' : 'New Task'}</h2>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Define task details below</p>
        </header>

        {error && (
            <div className="mb-8 p-4 bg-rose-50 text-rose-500 border border-rose-100 font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center gap-3">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
               {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Status</label>
              <div className="relative">
                <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-5 py-4 border border-slate-100 bg-slate-50/50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none font-bold text-slate-900 transition-all appearance-none cursor-pointer"
                >
                    <option value="todo">Pending (Todo)</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_dev">In Development</option>
                    <option value="in_review">In Review</option>
                    <option value="deployed">Deployed</option>
                    <option value="done">Completed (Done)</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Effort / Weight</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  disabled={isMember}
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full px-5 py-4 border border-slate-100 bg-slate-50/50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none font-bold text-slate-900 transition-all placeholder-slate-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="e.g. 5"
                />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Assign To Team Member</label>
            <div className="relative">
              <select
                value={formData.assignedTo}
                disabled={isMember}
                onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                className="w-full px-5 py-4 border border-slate-100 bg-slate-50/50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none font-bold text-slate-900 transition-all appearance-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <option value="">Unassigned</option>
                {teamMembers.map(member => (
                  <option key={member._id} value={member._id}>{member.name}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Priority / Type</label>
                <div className="relative">
                  <select
                      required
                      disabled={isMember}
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-5 py-4 border border-slate-100 bg-slate-50/50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none font-bold text-slate-900 transition-all appearance-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                      <option value="">Select Priority</option>
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                      <option value="Bug">Bug / Issue</option>
                      <option value="Feature">New Feature</option>
                      <option value="Refactor">Refactor</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Date</label>
                <input
                    type="date"
                    required
                    disabled={isMember}
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-5 py-4 border border-slate-100 bg-slate-50/50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none font-bold text-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                />
             </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Task Title</label>
              <input
                type="text"
                required
                disabled={isMember}
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-5 py-4 border border-slate-100 bg-slate-50/50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none font-bold text-slate-900 transition-all placeholder-slate-300 disabled:opacity-70 disabled:cursor-not-allowed"
                placeholder="e.g. Design Landing Page"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Additional Notes</label>
              <textarea
                disabled={isMember}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-5 py-4 border border-slate-100 bg-slate-50/50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none font-bold text-slate-900 transition-all placeholder-slate-300 min-h-[80px] resize-none disabled:opacity-70 disabled:cursor-not-allowed"
                placeholder="Describe the task objective..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-black/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : initialData ? 'Update Task' : 'Save Task'}
          </button>
        </form>
      </div>
    </div>
  );
}
