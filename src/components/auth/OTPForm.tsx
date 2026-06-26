import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

interface OTPFormValues {
  digit0: string;
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
}

const otpFields: Array<keyof OTPFormValues> = ["digit0", "digit1", "digit2", "digit3", "digit4", "digit5"];

export function OTPForm() {
  const navigate = useNavigate();
  const pendingRegistration = useAuthStore((state) => state.pendingRegistration);
  const completeRegistration = useAuthStore((state) => state.completeRegistration);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OTPFormValues>({
    defaultValues: { digit0: "", digit1: "", digit2: "", digit3: "", digit4: "", digit5: "" },
  });

  const onSubmit = handleSubmit(() => {
    completeRegistration();
    navigate(routes.welcome, { replace: true });
  });
  const hasError = otpFields.some((field) => Boolean(errors[field]));

  return (
    <form className="space-y-6 p-6 sm:p-8" onSubmit={onSubmit}>
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-accentSoft text-accent">
          <MailCheck className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-accent">Verification</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Enter security code</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          We sent a six digit code to{" "}
          <span className="text-slate-200">{pendingRegistration?.email ?? "your registered email"}</span>.
        </p>
      </div>

      <div className="grid grid-cols-6 gap-2 sm:gap-3" aria-label="Six digit verification code">
        {otpFields.map((field, index) => (
          <input
            key={field}
            aria-label={`Digit ${index + 1}`}
            inputMode="numeric"
            maxLength={1}
            className={cn(
              "h-12 rounded-xl border bg-white/[0.03] text-center text-xl font-semibold text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-cyan-300/15 sm:h-14",
              errors[field] ? "border-rose-400/60" : "border-borderSubtle",
            )}
            {...register(field, {
              required: true,
              pattern: /^[0-9]$/,
            })}
          />
        ))}
      </div>
      {hasError ? <p className="text-center text-sm text-rose-300">Enter the complete six digit verification code.</p> : null}

      <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
        <KeyRound className="h-5 w-5" aria-hidden="true" />
        Verify account
      </Button>

      <div className="space-y-3 text-center text-sm">
        <p className="text-slate-400">
          Resend code in <span className="font-semibold text-cyan-200">00:42</span>
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <Link className="font-medium text-cyan-200 transition hover:text-cyan-100" to={routes.register}>
            Change email
          </Link>
          <Link className="inline-flex items-center gap-2 font-medium text-slate-300 transition hover:text-white" to={routes.login}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to login
          </Link>
        </div>
      </div>
    </form>
  );
}
