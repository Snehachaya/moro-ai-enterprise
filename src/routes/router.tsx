import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "@/App";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { moduleById } from "@/data/modules";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AccountPage } from "@/pages/AccountPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { MarketplacePage } from "@/pages/MarketplacePage";
import { ModuleDetailPage } from "@/pages/ModuleDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { RequireAuth } from "@/routes/RequireAuth";
import { RouteShellPage } from "@/pages/RouteShellPage";
import { SubscriptionPage } from "@/pages/SubscriptionPage";
import { VerifyOTPPage } from "@/pages/VerifyOTPPage";
import { WelcomePage } from "@/pages/WelcomePage";
import { routes } from "@/routes/paths";

export const router = createBrowserRouter(
  [
    {
      element: <App />,
      children: [
        {
          element: <PublicLayout />,
          children: [{ path: routes.landing, element: <LandingPage /> }],
        },
        {
          element: <AuthLayout />,
          children: [
            { path: routes.login, element: <LoginPage /> },
            { path: routes.register, element: <RegisterPage /> },
            { path: routes.verify, element: <VerifyOTPPage /> },
            { path: routes.otp, element: <Navigate to={routes.verify} replace /> },
            {
              path: routes.welcome,
              element: (
                <RequireAuth>
                  <WelcomePage />
                </RequireAuth>
              ),
            },
          ],
        },
        {
          element: (
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          ),
          children: [
            { path: routes.dashboard, element: <DashboardPage /> },
            { path: routes.analytics, element: <RouteShellPage title="Analytics" area="Operations" /> },
            { path: routes.alerts, element: <RouteShellPage title="Alerts" area="Operations" /> },
            { path: routes.devices, element: <RouteShellPage title="Devices" area="Operations" /> },
            { path: routes.auditLogs, element: <RouteShellPage title="Audit Logs" area="Operations" /> },
            { path: routes.marketplace, element: <MarketplacePage /> },
            { path: routes.subscription, element: <SubscriptionPage /> },
            { path: routes.account, element: <AccountPage /> },
            { path: routes.profile, element: <RouteShellPage title="Profile" area="Account" /> },
            { path: routes.billing, element: <RouteShellPage title="Billing" area="Account" /> },
            { path: routes.settings, element: <RouteShellPage title="Settings" area="Account" /> },
            { path: routes.users, element: <RouteShellPage title="Users" area="Account" /> },
            { path: routes.rbac, element: <RouteShellPage title="RBAC" area="Account" /> },
            { path: routes.humanDetection, element: <ModuleDetailPage module={moduleById.human} /> },
            { path: routes.objectDetection, element: <ModuleDetailPage module={moduleById.object} /> },
            { path: routes.threatDetection, element: <ModuleDetailPage module={moduleById.threat} /> },
            { path: routes.weaponDetection, element: <ModuleDetailPage module={moduleById.weapon} /> },
            { path: routes.accidentDetection, element: <ModuleDetailPage module={moduleById.accident} /> },
          ],
        },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
