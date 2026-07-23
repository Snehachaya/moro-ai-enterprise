import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { routes } from "@/routes/paths";
import { authService } from "@/services/authService";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const callbackError = searchParams.get("error_description") || searchParams.get("error");
        if (callbackError) throw new Error(callbackError);
        const code = searchParams.get("code");
        if (code) {
          const { error: exchangeError } = await authService.exchangeCode(code);
          if (exchangeError) throw exchangeError;
        }
        const { data: { session } } = await authService.getSession();
        if (!session) throw new Error("The verification link is invalid or has expired.");
        if (active) navigate(routes.welcome, { replace: true });
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to verify this link.");
      }
    })();
    return () => { active = false; };
  }, [navigate, searchParams]);

  if (error) return <section className="space-y-5 p-6 text-center sm:p-8"><h1 className="text-3xl font-semibold text-white">Link could not be verified</h1><p className="text-sm text-rose-200">{error}</p><Link className="text-sm text-cyan-200" to={routes.verify}>Resend verification</Link></section>;
  return <section className="grid min-h-72 place-items-center p-8 text-center"><div><Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-200" /><p className="mt-4 text-sm text-slate-300">Verifying your secure link...</p></div></section>;
}
