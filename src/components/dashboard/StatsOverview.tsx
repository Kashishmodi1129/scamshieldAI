interface Props {
  total: number;
  safe: number;
  suspicious: number;
  highRisk: number;
}

export function StatsOverview({ total, safe, suspicious, highRisk }: Props) {
  const cards = [
    { label: 'Total Analyses', value: total, color: 'text-white', border: 'border-white/10' },
    { label: 'Safe', value: safe, color: 'text-green-400', border: 'border-green-500/30' },
    { label: 'Suspicious', value: suspicious, color: 'text-yellow-400', border: 'border-yellow-500/30' },
    { label: 'High Risk', value: highRisk, color: 'text-red-400', border: 'border-red-500/30' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {cards.map((c, i) => (
        <div key={i} className={`glass-card rounded-2xl p-6 text-center ${c.border}`}>
          <p className="text-3xl font-extrabold mb-1 {c.color}">{c.value}</p>
          <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
