interface RoleBadgeProps {
  role: string;
}

const roleConfig: Record<string, { bg: string; text: string; dot: string }> = {
  admin:  { bg: 'bg-indigo-50', text: 'text-indigo-600', dot: 'bg-indigo-400' },
  member: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400' },
};

export default function RoleBadge({ role }: RoleBadgeProps) {
  const config = roleConfig[role?.toLowerCase()] ?? roleConfig.member;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {role?.replace('_', ' ')}
    </span>
  );
}
