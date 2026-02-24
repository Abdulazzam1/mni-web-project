import { createContext, useContext } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const ToastCtx = createContext(null);
export const useToastCtx = () => useContext(ToastCtx);

const ICONS = {
  success: <CheckCircle size={16} className="text-emerald-500 shrink-0" />,
  error:   <XCircle    size={16} className="text-crimson-500 shrink-0" />,
  info:    <Info       size={16} className="text-blue-500 shrink-0" />,
  warning: <AlertTriangle size={16} className="text-amber-500 shrink-0" />,
};

const BG = {
  success: 'border-l-emerald-500',
  error:   'border-l-crimson-500',
  info:    'border-l-blue-500',
  warning: 'border-l-amber-500',
};

export function ToastProvider({ children }) {
  const { toasts, toast } = useToast();

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 w-80">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 bg-white rounded-lg shadow-lg border-l-4 ${BG[t.type]} px-4 py-3 animate-fade-in`}
          >
            {ICONS[t.type]}
            <p className="text-sm text-obsidian-700 font-body flex-1 leading-snug">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
