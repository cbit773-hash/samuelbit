import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#020202] pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Risk Warning Box */}
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 mb-12">
          <h4 className="text-rose-500 font-bold mb-2 uppercase text-sm tracking-wider">Advertencia de Riesgo Alto</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            Los CFDs son instrumentos complejos y vienen con un alto riesgo de perder dinero rápidamente debido al apalancamiento. 
            El 71% de las cuentas de inversores minoristas pierden dinero al operar CFDs con este proveedor. 
            Deberías considerar si comprendes cómo funcionan los CFDs y si puedes permitirte asumir el alto riesgo de perder tu dinero. 
            Por favor, lee nuestra <Link to="/legal/terminos" className="text-primary hover:underline">Declaración de Riesgos</Link> completa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <span className="text-2xl font-black text-primary tracking-tighter">InvestPRO</span>
            <p className="mt-4 text-gray-500 text-sm">
              Una plataforma galardonada para el comercio global de derivados financieros.
            </p>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-4">Mercados</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#mercados" className="hover:text-primary">Forex</a></li>
              <li><a href="#mercados" className="hover:text-primary">Acciones</a></li>
              <li><a href="#mercados" className="hover:text-primary">Índices</a></li>
              <li><a href="#mercados" className="hover:text-primary">Materias Primas</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-4">Soporte</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/auth/login" className="hover:text-primary">Centro de Ayuda</a></li>
              <li><a href="mailto:soporte@investpro.com" className="hover:text-primary">Contáctenos</a></li>
              <li><a href="tel:+525518370627" className="hover:text-primary">+52 55 1837 0627</a></li>
              <li><a href="mailto:soporte@investpro.com" className="hover:text-primary">soporte@investpro.com</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-4">InvestPRO Legal</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/legal/terminos" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
              <li><Link to="/legal/privacidad" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
              <li><a href="/auth/login" className="hover:text-primary">KYC & AML</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8 text-xs text-gray-500 leading-relaxed text-justify">
          <p className="mb-4">
            INFORMACIÓN LEGAL: Este sitio web (InvestPRO.com) es operado por la entidad corporativa central. InvestPRO es autorizado y regulado internacionalmente.
            La empresa actúa como proveedor de servicios tecnológicos y motores de liquidez. La entidad no ofrece asesoramiento de inversión directo sin la intermediación de un Asesor (`ADVISOR`) registrado en la plataforma.
          </p>
          <p className="text-center mt-8">
            &copy; {new Date().getFullYear()} InvestPRO. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
