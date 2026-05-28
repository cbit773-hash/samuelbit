import { useEffect, useState } from 'react';

/**
 * True cuando el formulario #registro está visible en viewport (sticky CTA se oculta).
 */
export function useRegistroFormVisible(targetId = 'registro') {
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [targetId]);

  return formVisible;
}

