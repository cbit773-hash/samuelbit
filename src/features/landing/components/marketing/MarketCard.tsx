import { ArrowRight, Bitcoin, Globe2, LineChart, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const ICONS: Record<string, LucideIcon> = {
  Bitcoin,
  Globe2,
  LineChart,
};

interface MarketCardProps {
  icon: keyof typeof ICONS;
  title: string;
  desc: string;
  items: readonly string[];
  utmTerm: string;
}

export function MarketCard({ icon, title, desc, items, utmTerm }: MarketCardProps) {
  const Icon = ICONS[icon] ?? LineChart;
  const registroUrl = `/registro?utm_term=${utmTerm}`;

  return (
    <div className="bg-surface border border-border rounded-card p-[22px] flex flex-col h-full hover:border-primary/40 transition-colors">
      <div className="w-12 h-12 rounded-card bg-primary-soft flex items-center justify-center mb-4">
        <Icon size={24} className="text-primary" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted text-sm leading-relaxed mb-6 flex-1">{desc}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {items.map((item) => (
          <span
            key={item}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary-soft text-primary border border-primary/20"
          >
            {item}
          </span>
        ))}
      </div>
      <Link
        to={registroUrl}
        className="bolt-btn-primary inline-flex items-center justify-center gap-2 text-sm w-full"
      >
        Operar {title.split(' ')[0]}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
