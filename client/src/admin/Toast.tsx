import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import styles from "./Admin.module.css";

// Avisos breves del panel ("Modifiche salvate", errores…), abajo en la pantalla.
//
//   const showToast = useToast();
//   showToast(it.admin.common.saved);
//   showToast(error.message, "error");

type ToastKind = "success" | "error";
type ShowToast = (message: string, kind?: ToastKind) => void;

const ToastContext = createContext<ShowToast>(() => {});

const VISIBLE_MS = 6000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; kind: ToastKind; id: number } | null>(null);

  const showToast = useCallback<ShowToast>((message, kind = "success") => {
    // El id cambia en cada aviso para reiniciar el temporizador aunque el texto se repita.
    setToast({ message, kind, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {/* La región existe siempre: así el lector de pantalla anuncia lo que aparezca dentro. */}
      <div className={styles.toastRegion} role="status" aria-live="polite">
        {toast && (
          <p className={toast.kind === "error" ? styles.toastError : styles.toastSuccess}>
            {toast.message}
          </p>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ShowToast {
  return useContext(ToastContext);
}
