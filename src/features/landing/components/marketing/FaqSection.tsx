import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BoltSection } from '../../../../shared/ui';
import { PERU_FAQ } from '../../../../shared/copy/peru';

type FaqItem = { readonly q: string; readonly a: string };

interface FaqSectionProps {
  tone?: 'canvas' | 'alt' | 'white';
  items?: readonly FaqItem[];
}

export function FaqSection({ tone = 'canvas', items = PERU_FAQ }: FaqSectionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <BoltSection tone={tone}>
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="font-display text-3xl font-bold text-center text-foreground mb-10">
          Preguntas <span className="text-primary">frecuentes</span>
        </h2>
        <div className="space-y-3">
          {items.map((faq, i) => (
            <div key={faq.q} className="border border-border rounded-card overflow-hidden bg-surface">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-surface-inset transition-colors"
              >
                <span className="font-semibold text-foreground text-sm pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-muted shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-muted text-sm leading-relaxed border-t border-border bg-surface-inset">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </BoltSection>
  );
}
