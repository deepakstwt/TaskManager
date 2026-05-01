"use client";

import { XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xl p-6 border border-slate-100 shadow-2xl rounded-2xl min-w-[180px]">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 border-b border-slate-50 pb-2">{label} Analytics</p>
        <div className="space-y-3">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">{entry.name}</span>
              </div>
              <span className="text-[13px] font-black tabular-nums" style={{ color: entry.color }}>
                {entry.value.toLocaleString('en-US')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function MonthlyTrendsChart({ data }: { data: any[] }) {
  const isEmpty = !data || data.length === 0 || data.every(d => d.completed === 0 && d.pending === 0);

  if (isEmpty) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-slate-300 bg-slate-50/20 rounded-[2.5rem] border border-dashed border-slate-100 p-10 animate-in fade-in duration-700">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 text-slate-200">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] font-black">Performance Data Empty</p>
        <p className="text-[11px] font-bold text-slate-400 mt-2">Historical trends require active task entries.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <defs>
          <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.12}/>
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f5f9" strokeWidth={1} />
        <XAxis 
          dataKey="month" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 900 }}
          dy={10}
          interval="preserveStartEnd"
          minTickGap={5}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }}
          tickFormatter={(val) => `${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000000', strokeWidth: 1, strokeDasharray: '4 4' }} />
        <Area 
          type="monotone" 
          dataKey="completed" 
          stroke="#10b981" 
          strokeWidth={3}
          fill="url(#completedGradient)" 
          name="Completed"
          animationDuration={2200}
        />
        <Area 
          type="monotone" 
          dataKey="pending" 
          stroke="#f43f5e" 
          strokeWidth={3}
          fill="url(#pendingGradient)" 
          name="Pending"
          animationDuration={2200}
          strokeDasharray="6 6"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
