import { AlertTriangle } from 'lucide-react';
import { createContext, useContext } from 'react';
import { useConfirm } from '@/hooks/useConfirm';

const ConfirmCtx = createContext(null);
export const useConfirmCtx = () => useContext(ConfirmCtx);

export function ConfirmProvider({ children }) {
  const { confirmState, confirm, handleClose } = useConfirm();

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {confirmState.open && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-obsidian-900/50 backdrop-blur-sm"
            onClick={() => handleClose(false)}
          />
          {/* Dialog */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 animate-fade-in">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-crimson-100 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-crimson-500" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-obsidian-800 text-base mb-1">
                  Konfirmasi Aksi
                </h3>
                <p className="text-sm text-obsidian-500 leading-relaxed">
                  {confirmState.message}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <button
                onClick={() => handleClose(false)}
                className="btn btn-outline btn-sm"
              >
                Batal
              </button>
              <button
                onClick={() => handleClose(true)}
                className="btn btn-danger btn-sm"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmCtx.Provider>
  );
}
