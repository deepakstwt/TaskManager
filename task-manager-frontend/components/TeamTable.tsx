"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function TeamTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, id: string | null}>({ show: false, id: null });
  const itemsPerPage = 5;

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await api.patch(`/users/${id}/role`, { role: newRole });
      toast.success('Team member role updated');
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteModal({ show: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await api.delete(`/users/${deleteModal.id}`);
      toast.success('Member removed from project');
      setDeleteModal({ show: false, id: null });
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove member');
    }
  };

  const downloadCSV = () => {
    const headers = ['Name', 'Email', 'Role'];
    const rows = users.map(u => [u.name, u.email, u.role]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `taskmanager_team_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Team list downloaded');
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
      <div className="px-8 py-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">PROJECT ACCESS</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Manage team roles and project privileges</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative group">
              <input 
                type="text" 
                placeholder="Find member..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-100 pl-10 pr-4 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-slate-300 transition-all w-64 shadow-sm"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
           </div>

           <button 
             onClick={downloadCSV}
             className="bg-white border border-slate-900 px-5 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-sm text-slate-900 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
           >
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
             <span className="text-[9px] font-black uppercase tracking-widest leading-none">Download CSV</span>
           </button>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">TEAM MEMBER</th>
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">EMAIL ADDRESS</th>
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">ROLE</th>
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentItems.map((u) => (
              <tr key={u._id} className="group hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-xs font-black text-slate-800 tracking-tight uppercase">{u.name}</p>
                  </div>
                </td>
                <td className="px-8 py-5">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.email}</p>
                </td>
                <td className="px-8 py-5">
                    <div className="relative inline-block w-full max-w-[150px]">
                      <select 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="appearance-none w-full bg-slate-50/50 border border-slate-100 px-4 py-2.5 pr-10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100 hover:border-slate-200 transition-all cursor-pointer shadow-sm text-center"
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                         <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                    </div>
                </td>
                <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleDelete(u._id)}
                      className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                      title="Remove Member"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden divide-y divide-slate-50">
        {currentItems.map((u) => (
          <div key={u._id} className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-black">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 tracking-tight uppercase">{u.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.email}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(u._id)}
                className="p-3 text-rose-500 bg-rose-50 rounded-xl active:scale-95 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ASSIGN ROLE</span>
               <div className="relative flex-1 max-w-[160px]">
                  <select 
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 px-4 py-2.5 pr-10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-indigo-200 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="px-8 py-4 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {(currentPage-1)*itemsPerPage + 1} - {Math.min(currentPage*itemsPerPage, filteredUsers.length)} of {filteredUsers.length} members
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-100 rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-100 rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      )}
      {users.length === 0 && !loading && (
        <div className="py-24 text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-sm border border-slate-100">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Personnel Roster Empty</p>
            <p className="text-[11px] font-bold text-slate-400">Invite team members to your project to see them listed here.</p>
          </div>
        </div>
      )}
      
      {deleteModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setDeleteModal({ show: false, id: null })}
          ></div>
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/20 border border-white/20 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="pt-10 pb-8 px-8 text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-rose-500 animate-bounce-subtle">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Remove Member?</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">This member will lose all access to the project workspace.</p>
            </div>
            <div className="flex border-t border-slate-50 p-6 gap-4">
              <button 
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="flex-1 py-4 rounded-2xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-4 rounded-2xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-slate-900/20 hover:bg-rose-600 transition-all active:scale-95"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
