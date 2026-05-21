import { Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#050505]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 cursor-pointer">
            <span className="text-2xl font-black text-primary tracking-tighter">InvestPRO</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavItem href="/#mercados" text="Cuentas de Trading" />
            <Link to="/mercados" className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-primary transition-colors">Mercados</Link>
            <NavItem href="/#plataformas" text="Plataformas" />
            <Link to="/auth/login" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">Hazte socio</Link>
            <NavItem href="/#empresa" text="Empresa" />
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/auth/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
              Iniciar sesión
            </Link>
            <Link to="/auth/login" className="text-sm font-bold bg-primary hover:bg-amber-600 text-background px-5 py-2.5 rounded-full transition-all active:scale-95">
              Abrir cuenta
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#050505] border-b border-white/10 px-4 pt-2 pb-6 space-y-4 shadow-2xl">
          <MobileNavItem href="/#mercados" text="Cuentas de Trading" onClick={() => setIsOpen(false)} />
          <Link to="/mercados" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md cursor-pointer" onClick={() => setIsOpen(false)}>Mercados</Link>
          <MobileNavItem href="/#plataformas" text="Plataformas" onClick={() => setIsOpen(false)} />
          <Link to="/auth/login" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md cursor-pointer" onClick={() => setIsOpen(false)}>Hazte socio</Link>
          <MobileNavItem href="/#empresa" text="Empresa" onClick={() => setIsOpen(false)} />
          <div className="pt-4 flex flex-col gap-3 border-t border-white/10">
            <Link to="/auth/login" className="w-full text-center text-sm font-semibold text-gray-300 py-2 border border-white/20 rounded-full">
              Iniciar sesión
            </Link>
            <Link to="/auth/login" className="w-full text-center text-sm font-bold bg-primary text-background py-2 rounded-full">
              Abrir cuenta
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavItem({ text, href }: { text: string, href: string }) {
  return (
    <a href={href} className="flex items-center space-x-1 cursor-pointer group">
      <span className="text-sm font-medium text-gray-300 group-hover:text-primary transition-colors">
        {text}
      </span>
      <ChevronDown size={14} className="text-gray-500 group-hover:text-primary transition-colors" />
    </a>
  );
}

function MobileNavItem({ text, href, onClick }: { text: string, href: string, onClick?: () => void }) {
  return (
    <a href={href} onClick={onClick} className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md cursor-pointer">
      {text}
    </a>
  );
}
