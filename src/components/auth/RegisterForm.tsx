import { Link, useNavigate } from "react-router-dom";
import { CircleUserRound, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export function RegisterForm() {
  const navigate = useNavigate();
  const prepareRegistration = useAuthStore((state) => state.prepareRegistration);
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "", terms: false },
  });

  const onSubmit = handleSubmit((values) => {
    prepareRegistration({ name: values.fullName, email: values.email });
    navigate(routes.verify);
  });

  const handleSocialRegistration = () => {
    login();
    navigate(routes.welcome, { replace: true });
  };

  return (
    <form className="space-y-5 p-6 sm:p-8" onSubmit={onSubmit}>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Create workspace</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Register for MoroAI</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Start securing your sites with intelligent detection.</p>
      </div>

      <FormField label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" aria-hidden="true" />
          <Input id="fullName" className="pl-10" hasError={Boolean(errors.fullName)} {...register("fullName", { required: "Full name is required." })} />
        </div>
      </FormField>

      <FormField label="Email address" htmlFor="registerEmail" error={errors.email?.message}>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" aria-hidden="true" />
          <Input
            id="registerEmail"
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

      <FormField label="Password" htmlFor="registerPassword" error={errors.password?.message}>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" aria-hidden="true" />
          <Input
            id="registerPassword"
            type="password"
            autoComplete="new-password"
            className="pl-10"
            hasError={Boolean(errors.password)}
            {...register("password", {
              required: "Password is required.",
              minLength: { value: 8, message: "Use at least 8 characters." },
            })}
          />
        </div>
      </FormField>

      <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          hasError={Boolean(errors.confirmPassword)}
          {...register("confirmPassword", {
            required: "Confirm your password.",
            validate: (value) => value === getValues("password") || "Passwords do not match.",
          })}
        />
      </FormField>

      <label className="flex items-start gap-3 text-sm leading-6 text-slate-400">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-borderSubtle bg-white/[0.03] text-accent focus:ring-cyan-300/20"
          {...register("terms", { required: "You must accept the terms." })}
        />
        <span>I agree to the MoroAI terms, privacy policy, and security processing agreement.</span>
      </label>
      {errors.terms ? <p className="text-sm text-rose-300">{errors.terms.message}</p> : null}

      <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
        Create account
      </Button>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="secondary" type="button" className="w-full" onClick={handleSocialRegistration}>
          <CircleUserRound className="h-4 w-4" aria-hidden="true" />
          Google
        </Button>
        <Button variant="secondary" type="button" className="w-full" onClick={handleSocialRegistration}>
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
        Already have an account?{" "}
        <Link className="font-semibold text-cyan-200 transition hover:text-cyan-100" to={routes.login}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
