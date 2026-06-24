import { X } from "lucide-react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface DialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Dialog({ open, title, children, onClose }: DialogProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-lg"
          >
            <Card>
              <div className="flex items-center justify-between border-b border-borderSubtle p-5">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <Button aria-label="Close dialog" variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              <div className="p-5">{children}</div>
            </Card>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
