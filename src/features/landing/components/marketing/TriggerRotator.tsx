import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { PERU_BANK_TRIGGERS } from '../../../../shared/copy/peru';

export function TriggerRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PERU_BANK_TRIGGERS.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-start gap-3 min-h-[3rem] p-4 rounded-lg bg-surface-info border border-border">
      <div className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center shrink-0">
        <TrendingUp size={20} className="text-brand" />
      </div>
      <p key={index} className="text-base md:text-lg text-[#f5f6f4] font-semibold leading-snug animate-fade-in">
        {PERU_BANK_TRIGGERS[index]}
      </p>
    </div>
  );
}
