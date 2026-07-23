import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { routes } from "@/routes/paths";
import { authService } from "@/services/authService";

export function OTPForm() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? "";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  async function resend() {
    if (!email) { setError("Return to registration and enter your email address again."); return; }
    try {
      setSending(true); setError("");
      const { error: resendError } = await authService.resendSignupVerification(email);
      if (resendError) throw resendError;
      setMessage("A new verification email has been sent.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to resend verification."); }
    finally { setSending(false); }
  }
  return <section className="space-y-6 p-6 text-center sm:p-8">
    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-accentSoft text-accent"><MailCheck className="h-7 w-7" /></span>
    <div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Email verification</p><h1 className="mt-3 text-3xl font-semibold text-white">Check your inbox</h1><p className="mt-3 text-sm leading-6 text-slate-400">Open the confirmation email sent by MoroAI, then return here and sign in. This protects shared organization data from unverified accounts.</p></div>
    <Link to={routes.login} className="block"><Button className="w-full" size="lg">Continue to sign in</Button></Link>
    <Button variant="secondary" className="w-full" type="button" disabled={sending} onClick={() => void resend()}>Resend verification email</Button>
    {message ? <p className="text-sm text-emerald-200">{message}</p> : null}
    {error ? <p className="text-sm text-rose-200">{error}</p> : null}
    <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white" to={routes.register}><ArrowLeft className="h-4 w-4" />Change registration details</Link>
  </section>;
}
