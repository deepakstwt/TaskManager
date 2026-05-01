"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PriorityData {
  priority: string;
  total: number;
}

interface TaskPriorityBarChartProps {
  data: PriorityData[];
}

const COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#a855f7", // Purple
  "#d946ef", // Fuchsia
  "#ec4899", // Pink
  "#f43f5e", // Rose
];

export default function TaskPriorityBarChart({ data }: TaskPriorityBarChartProps) {
  const isEmpty = !data || data.length === 0 || data.every(d => d.total === 0);

  if (isEmpty) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-slate-300 bg-slate-50/20 rounded-[2.5rem] border border-dashed border-slate-100 p-8 animate-in fade-in duration-700">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-slate-200">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20v-4"></path></svg>
        </div>
        <p className="text-[9px] uppercase tracking-[0.25em] font-black text-slate-400">Distribution Void</p>
        <p className="text-[10px] font-bold text-slate-400/60 mt-1">Allocation data will appear here.</p>
      </div>
    );
  }

  const topData = [...data]
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 ring-1 ring-slate-900/5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            {payload[0].payload.priority}
          </p>
          <p className="text-sm font-black text-slate-900 tracking-tighter">
            {payload[0].value.toLocaleString('en-US')} units
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={topData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
      >
        <defs>
          {COLORS.map((color, index) => (
            <linearGradient key={`grad-${index}`} id={`barGrad-${index}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={color} stopOpacity={1} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
        <XAxis type="number" hide />
        <YAxis
          dataKey="priority"
          type="category"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fontWeight: 900, fill: "#64748b" }}
          width={70}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
        <Bar
          dataKey="total"
          radius={[0, 12, 12, 0]}
          barSize={32}
          animationDuration={1500}
        >
          {topData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`url(#barGrad-${index % COLORS.length})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
