import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "@/App";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { MarketplacePage } from "@/pages/MarketplacePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RegisterPage } from "@/pages/RegisterPage";
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
            { path: routes.welcome, element: <WelcomePage /> },
          ],
        },
        {
          element: <DashboardLayout />,
          children: [
            { path: routes.dashboard, element: <RouteShellPage title="Dashboard" area="Operations" /> },
            { path: routes.analytics, element: <RouteShellPage title="Analytics" area="Operations" /> },
            { path: routes.alerts, element: <RouteShellPage title="Alerts" area="Operations" /> },
            { path: routes.devices, element: <RouteShellPage title="Devices" area="Operations" /> },
            { path: routes.auditLogs, element: <RouteShellPage title="Audit Logs" area="Operations" /> },
            { path: routes.marketplace, element: <MarketplacePage /> },
            { path: routes.subscription, element: <SubscriptionPage /> },
            { path: routes.account, element: <Navigate to={routes.profile} replace /> },
            { path: routes.profile, element: <RouteShellPage title="Profile" area="Account" /> },
            { path: routes.billing, element: <RouteShellPage title="Billing" area="Account" /> },
            { path: routes.settings, element: <RouteShellPage title="Settings" area="Account" /> },
            { path: routes.users, element: <RouteShellPage title="Users" area="Account" /> },
            { path: routes.rbac, element: <RouteShellPage title="RBAC" area="Account" /> },
            { path: routes.humanDetection, element: <RouteShellPage title="Human Detection" area="Modules" /> },
            { path: routes.objectDetection, element: <RouteShellPage title="Object Detection" area="Modules" /> },
            { path: routes.threatDetection, element: <RouteShellPage title="Threat Detection" area="Modules" /> },
            { path: routes.weaponDetection, element: <RouteShellPage title="Weapon Detection" area="Modules" /> },
            { path: routes.accidentDetection, element: <RouteShellPage title="Accident Detection" area="Modules" /> },
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
