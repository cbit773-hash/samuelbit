import { Navigate, createBrowserRouter } from "react-router-dom";
import { LandingPage } from "../features/landing/pages/LandingPage";
import { MarketsPage } from "../features/landing/pages/MarketsPage";
import { MainLayout, RoleRedirect } from "../shared/components/layout/MainLayout";
import { RouteErrorPage } from "../shared/components/RouteErrorPage";
import { TradingWorkspace } from "../features/trading/layout/TradingWorkspace";
import { LegalView } from "../features/legal/pages/LegalView";
import { TerminosPage } from "../features/legal/pages/TerminosPage";
import { PrivacidadPage } from "../features/legal/pages/PrivacidadPage";
import { RiesgosPage } from "../features/legal/pages/RiesgosPage";
import { RegulacionPage } from "../features/legal/pages/RegulacionPage";
import { KycAmlPage } from "../features/legal/pages/KycAmlPage";
import { LoginView } from "../features/auth/pages/LoginView";
import { AdvisorDashboard } from "../features/advisor/pages/AdvisorDashboard";
import { AgentDashboard } from "../features/crm/pages/AgentDashboard";
import { TeamLeaderDashboard } from "../features/crm/pages/TeamLeaderDashboard";
import { FloorDashboard } from "../features/crm/pages/FloorDashboard";
import { HeadDashboard } from "../features/crm/pages/HeadDashboard";
import { ChiefDashboard } from "../features/crm/pages/ChiefDashboard";
import { ManagerDashboard } from "../features/crm/pages/ManagerDashboard";
import { ClientAccountPage } from "../features/client/pages/ClientAccountPage";
import { LegacyClientRedirect } from "../features/client/components/LegacyClientRedirect";
import { SupervisorMarketPage } from "../features/trading/pages/SupervisorMarketPage";
import { CaptacionLanding } from "../features/landing/pages/CaptacionLanding";
import { CLIENT_PATHS } from "../shared/routing/paths";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/registro",
    element: <CaptacionLanding />,
  },
  {
    path: "/mercados",
    element: <MarketsPage />,
  },
  {
    path: "/legal/terminos",
    element: <TerminosPage />,
  },
  {
    path: "/legal/privacidad",
    element: <PrivacidadPage />,
  },
  {
    path: "/legal/riesgos",
    element: <RiesgosPage />,
  },
  {
    path: "/legal/regulacion",
    element: <RegulacionPage />,
  },
  {
    path: "/legal/kyc-aml",
    element: <KycAmlPage />,
  },
  {
    path: "/auth/login",
    element: <LoginView />,
  },
  {
    path: "/dashboard",
    element: <MainLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <RoleRedirect /> },

      // ── Cliente / inversor ─────────────────────────────────────
      { path: "account", element: <ClientAccountPage /> },
      { path: "client", element: <LegacyClientRedirect /> },
      { path: "trade", element: <TradingWorkspace /> },
      {
        path: "trading",
        element: <Navigate to={CLIENT_PATHS.trade} replace />,
      },
      {
        path: "wallet",
        element: <Navigate to={CLIENT_PATHS.accountTab("depositar")} replace />,
      },
      { path: "legal", element: <LegalView /> },
      { path: "advisor", element: <AdvisorDashboard /> },

      // ── Staff ──────────────────────────────────────────────────
      { path: "supervisor-market", element: <SupervisorMarketPage /> },
      { path: "agent", element: <AgentDashboard /> },
      { path: "team-leader", element: <TeamLeaderDashboard /> },
      { path: "floor", element: <FloorDashboard /> },
      { path: "manager", element: <ManagerDashboard /> },
      { path: "chief", element: <ChiefDashboard /> },
      { path: "head", element: <HeadDashboard /> },

      { path: "*", element: <RouteErrorPage /> },
    ],
  },
  { path: "*", element: <RouteErrorPage /> },
]);
