import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "../features/landing/pages/LandingPage";
import { MarketsPage } from "../features/landing/pages/MarketsPage";
import { MainLayout, RoleRedirect } from "../shared/components/layout/MainLayout";
import { TradingTerminal } from "../features/trading/pages/TradingTerminal";
import { WalletDashboard } from "../features/wallet/pages/WalletDashboard";
import { LegalView } from "../features/legal/pages/LegalView";
import { TerminosPage } from "../features/legal/pages/TerminosPage";
import { PrivacidadPage } from "../features/legal/pages/PrivacidadPage";
import { LoginView } from "../features/auth/pages/LoginView";
import { AdvisorDashboard } from "../features/advisor/pages/AdvisorDashboard";
import { AgentDashboard } from "../features/crm/pages/AgentDashboard";
import { TeamLeaderDashboard } from "../features/crm/pages/TeamLeaderDashboard";
import { FloorDashboard } from "../features/crm/pages/FloorDashboard";
import { HeadDashboard } from "../features/crm/pages/HeadDashboard";
import { ChiefDashboard } from "../features/crm/pages/ChiefDashboard";
import { ManagerDashboard } from "../features/crm/pages/ManagerDashboard";
import { ClientDashboard } from "../features/client/pages/ClientDashboard";
import { CaptacionLanding } from "../features/landing/pages/CaptacionLanding";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/registro",
    element: <CaptacionLanding />,
  },
  {
    path: "/mercados",
    element: <MarketsPage />,
  },
  // ── Páginas Legales Públicas (requeridas por Google Ads) ───
  {
    path: "/legal/terminos",
    element: <TerminosPage />,
  },
  {
    path: "/legal/privacidad",
    element: <PrivacidadPage />,
  },
  {
    path: "/auth/login",
    element: <LoginView />,
  },
  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      // Index → redirige automáticamente al home del rol autenticado
      { index: true, element: <RoleRedirect /> },

      // ── Rutas Cliente / Inversor ────────────────────────
      { path: "client",   element: <ClientDashboard /> },
      { path: "trading",  element: <TradingTerminal /> },
      { path: "wallet",   element: <WalletDashboard /> },
      { path: "legal",    element: <LegalView /> },
      { path: "advisor",  element: <AdvisorDashboard /> },

      // ── Rutas Jerarquía Institucional ───────────────────
      { path: "agent",        element: <AgentDashboard /> },
      { path: "team-leader",  element: <TeamLeaderDashboard /> },
      { path: "floor",        element: <FloorDashboard /> },
      { path: "manager",      element: <ManagerDashboard /> },
      { path: "chief",        element: <ChiefDashboard /> },
      { path: "head",         element: <HeadDashboard /> },
    ],
  },
]);

