import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, hasError, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-lg border bg-white/[0.03] px-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-accent focus:ring-2 focus:ring-cyan-300/15",
      hasError ? "border-rose-400/60" : "border-borderSubtle",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";
