'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

type ToastTone = 'success' | 'info' | 'warn';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastApi {
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

const icons = {
  success: CheckCircle2,
  info: Info,
  warn: AlertTriangle,
} as const;

const toneClasses: Record<ToastTone, string> = {
  success: 'text-ok-ink',
  info: 'text-ink',
  warn: 'text-warn-icon',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const toast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = nextId.current++;
    setItems((current) => [...current.slice(-2), { id, message, tone }]);
    window.setTimeout(() => setItems((current) => current.filter((t) => t.id !== id)), 4200);
  }, []);

  const api = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Sits above the bottom tab bar on phones. */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 z-[60] flex flex-col items-center gap-2 px-4"
        style={{ bottom: 'calc(var(--tabbar-height) + var(--safe-bottom) + 0.75rem)' }}
      >
        <AnimatePresence>
          {items.map((item) => {
            const Icon = icons[item.tone];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                className="rounded-control border-line bg-surface shadow-raised pointer-events-auto flex max-w-md items-center gap-3 border px-4 py-3 text-[0.95rem] font-medium"
              >
                <Icon className={cn('size-5 shrink-0', toneClasses[item.tone])} aria-hidden />
                {item.message}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
