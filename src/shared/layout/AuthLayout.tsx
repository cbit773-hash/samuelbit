import type { ReactNode } from 'react';
import { BrandLogo } from '../components/BrandLogo';
import { BoltHeading } from '../ui';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div
      data-theme="invest-dark"
      className="min-h-screen bg-[#1a1d21] flex flex-col items-center justify-center p-4"
    >
      <div className="text-center mb-8 max-w-md">
        <div className="inline-block mb-6">
          <BrandLogo size="lg" />
        </div>
        <BoltHeading as="h1" level="heading" className="text-2xl md:text-3xl mb-2 text-foreground">
          {title}
        </BoltHeading>
        {subtitle && <p className="text-muted text-sm">{subtitle}</p>}
      </div>
      <div className="w-full max-w-md bolt-card-form mb-8">{children}</div>
      {footer}
    </div>
  );
}
