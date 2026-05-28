import { Link } from 'react-router-dom';

import { PERU_HERO_CTA } from '../../../../shared/copy/peru';



interface StickyCtaBarProps {

  hidden?: boolean;

}



export function StickyCtaBar({ hidden = false }: StickyCtaBarProps) {

  if (hidden) return null;



  return (

    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-[#232629]">

      <div className="flex gap-2 p-3 max-w-lg mx-auto">

        <Link to="/mercados" className="bolt-btn-ghost flex-1 text-center text-xs py-3 border border-border rounded-pill">

          {PERU_HERO_CTA.secondary}

        </Link>

        <Link to="/registro#registro" className="bolt-btn-primary flex-[2] text-center text-xs py-3">

          {PERU_HERO_CTA.primary}

        </Link>

      </div>

    </div>

  );

}


