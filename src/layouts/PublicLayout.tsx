import { Outlet } from "react-router-dom";
import { AppLogo } from "@/components/common/AppLogo";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <AppLogo />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
