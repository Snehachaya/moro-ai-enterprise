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
import { AuthCallbackPage } from "@/pages/AuthCallbackPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { RequireAuth } from "@/routes/RequireAuth";
import { SubscriptionPage } from "@/pages/SubscriptionPage";
import { VerifyOTPPage } from "@/pages/VerifyOTPPage";
import { WelcomePage } from "@/pages/WelcomePage";
import { AssetRegistrationPage } from "@/pages/AssetRegistrationPage";
import { LiveObjectDetectionPage } from "@/pages/LiveObjectDetectionPage";
import { routes } from "@/routes/paths";

export const router = createBrowserRouter(
  [
    {
      element: <App />,
      children: [
        {
          element: <PublicLayout />,
          children: [
            { path: routes.landing, element: <LandingPage /> },
            { path: routes.home, element: <LandingPage /> },
          ],
        },
        {
          element: <AuthLayout />,
          children: [
            { path: routes.login, element: <LoginPage /> },
            { path: routes.register, element: <RegisterPage /> },
            { path: routes.verify, element: <VerifyOTPPage /> },
            { path: routes.authCallback, element: <AuthCallbackPage /> },
            { path: routes.forgotPassword, element: <ForgotPasswordPage /> },
            { path: routes.resetPassword, element: <ResetPasswordPage /> },
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
            { path: routes.marketplace, element: <MarketplacePage /> },
            { path: routes.subscription, element: <SubscriptionPage /> },
            { path: routes.account, element: <AccountPage /> },
            { path: routes.profile, element: <Navigate to={routes.account} replace /> },
            { path: routes.billing, element: <Navigate to={routes.account} replace /> },
            { path: routes.settings, element: <Navigate to={routes.account} replace /> },
            { path: routes.users, element: <Navigate to={routes.account} replace /> },
            { path: routes.rbac, element: <Navigate to={routes.account} replace /> },
            { path: routes.humanDetection, element: <Navigate to={routes.marketplace} replace /> },
            { path: routes.objectDetection, element: <ModuleDetailPage module={moduleById.object} /> },
            { path: routes.assetOwnerIdentification, element: <Navigate to={routes.objectDetection} replace /> },
            { path: routes.assetRegistration, element: <AssetRegistrationPage /> },
            { path: routes.liveObjectDetection, element: <LiveObjectDetectionPage /> },
            { path: routes.threatDetection, element: <Navigate to={routes.marketplace} replace /> },
            { path: routes.weaponDetection, element: <Navigate to={routes.marketplace} replace /> },
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
