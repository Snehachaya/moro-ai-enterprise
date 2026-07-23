import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { routes } from "@/routes/paths";
import { authService } from "@/services/authService";

type Values = { password: string; confirmation: string };

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { register, getValues, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>();
  const submit = handleSubmit(async ({ password }) => {
    try {
      setServerError("");
      const { data: { session } } = await authService.getSession();
      if (!session) throw new Error("This reset link is invalid or has expired. Request a new link.");
      const { error } = await authService.updatePassword(password);
      if (error) throw error;
      await authService.signOut("global");
      navigate(routes.login, { replace: true, state: { message: "Password updated. Sign in with your new password." } });
    } catch (cause) {
      setServerError(cause instanceof Error ? cause.message : "Unable to update the password.");
    }
  });

  return <form className="space-y-5 p-6 sm:p-8" onSubmit={submit}>
    <div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Secure recovery</p><h1 className="mt-3 text-3xl font-semibold text-white">Choose a new password</h1></div>
    <FormField label="New password" htmlFor="newPassword" error={errors.password?.message}><Input id="newPassword" type="password" autoComplete="new-password" {...register("password", { required: "Password is required.", minLength: { value: 12, message: "Use at least 12 characters." } })} /></FormField>
    <FormField label="Confirm password" htmlFor="confirmNewPassword" error={errors.confirmation?.message}><Input id="confirmNewPassword" type="password" autoComplete="new-password" {...register("confirmation", { required: "Confirm your password.", validate: (value) => value === getValues("password") || "Passwords do not match." })} /></FormField>
    <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>Update password</Button>
    {serverError ? <p className="rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-200">{serverError}</p> : null}
    <Link className="block text-center text-sm text-cyan-200" to={routes.forgotPassword}>Request another link</Link>
  </form>;
}
