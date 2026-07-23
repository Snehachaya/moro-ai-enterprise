import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { routes } from "@/routes/paths";
import { authService } from "@/services/authService";

export function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>();
  const submit = handleSubmit(async ({ email }) => {
    try {
      setServerError("");
      const { error } = await authService.requestPasswordReset(email);
      if (error) throw error;
      setMessage("If this email belongs to an account, a password-reset link has been sent.");
    } catch (cause) {
      setServerError(cause instanceof Error ? cause.message : "Unable to request a password reset.");
    }
  });

  return <form className="space-y-5 p-6 sm:p-8" onSubmit={submit}>
    <div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Account recovery</p><h1 className="mt-3 text-3xl font-semibold text-white">Reset your password</h1><p className="mt-2 text-sm text-slate-400">We will send a secure, time-limited recovery link.</p></div>
    <FormField label="Email address" htmlFor="recoveryEmail" error={errors.email?.message}>
      <div className="relative"><Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" /><Input id="recoveryEmail" type="email" autoComplete="email" className="pl-10" {...register("email", { required: "Email is required.", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." } })} /></div>
    </FormField>
    <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>Send reset link</Button>
    {message ? <p className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">{message}</p> : null}
    {serverError ? <p className="rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-200">{serverError}</p> : null}
    <Link className="block text-center text-sm text-cyan-200" to={routes.login}>Return to sign in</Link>
  </form>;
}
