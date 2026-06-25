import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircleUserRound, KeyRound, Mail, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { getLoggedInLandingRoute } from "@/routes/getLoggedInLandingRoute";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

interface RedirectLocationState {
  from?: {
    pathname: string;
  };
}

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "", remember: true },
  });

  const from = (location.state as RedirectLocationState | null)?.from?.pathname ?? getLoggedInLandingRoute();
  const onSubmit = handleSubmit((values) => {
    login(values.email);
    navigate(from, { replace: true });
  });

  const handleSocialLogin = () => {
    login("security.admin@moroai.com");
    navigate(getLoggedInLandingRoute(), { replace: true });
  };

  return (
    <form className="space-y-5 p-6 sm:p-8" onSubmit={onSubmit}>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Welcome back</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Sign in to MoroAI</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Access your AI surveillance command center.</p>
      </div>

      <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" aria-hidden="true" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="pl-10"
            hasError={Boolean(errors.email)}
            {...register("email", {
              required: "Email is required.",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." },
            })}
          />
        </div>
      </FormField>

      <FormField label="Password" htmlFor="password" error={errors.password?.message}>
        <div className="relative">
          <KeyRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" aria-hidden="true" />
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            className="pl-10"
            hasError={Boolean(errors.password)}
            {...register("password", {
              required: "Password is required.",
              minLength: { value: 8, message: "Password must be at least 8 characters." },
            })}
          />
        </div>
      </FormField>

      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="flex items-center gap-2 text-slate-300">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-borderSubtle bg-white/[0.03] text-accent focus:ring-cyan-300/20"
            {...register("remember")}
          />
          Remember me
        </label>
        <Link to={routes.verify} className="font-medium text-cyan-200 transition hover:text-cyan-100">
          Forgot password?
        </Link>
      </div>

      <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
        <Shield className="h-5 w-5" aria-hidden="true" />
        Sign in
      </Button>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="secondary" type="button" className="w-full" onClick={handleSocialLogin}>
          <CircleUserRound className="h-4 w-4" aria-hidden="true" />
          Google
        </Button>
        <Button variant="secondary" type="button" className="w-full" onClick={handleSocialLogin}>
          <span className="grid h-4 w-4 grid-cols-2 gap-0.5" aria-hidden="true">
            <span className="bg-cyan-300" />
            <span className="bg-sky-500" />
            <span className="bg-blue-400" />
            <span className="bg-indigo-400" />
          </span>
          Microsoft
        </Button>
      </div>

      <p className="text-center text-sm text-slate-400">
        New to MoroAI?{" "}
        <Link className={cn("font-semibold text-cyan-200 transition hover:text-cyan-100")} to={routes.register}>
          Create account
        </Link>
      </p>
    </form>
  );
}
