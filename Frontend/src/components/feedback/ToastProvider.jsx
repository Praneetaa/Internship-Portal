import {
   createContext,
   useCallback,
   useContext,
   useMemo,
   useState,
} from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
   const context = useContext(ToastContext);
   if (!context) {
      throw new Error("useToast must be used inside ToastProvider");
   }
   return context;
};

const TOAST_STYLES = {
   success: {
      wrapper: "border-success/30 bg-white",
      icon: "bg-success/10 text-success",
      IconComponent: CheckCircle2,
   },
   error: {
      wrapper: "border-error/30 bg-white",
      icon: "bg-error/10 text-error",
      IconComponent: XCircle,
   },
   info: {
      wrapper: "border-accent/30 bg-white",
      icon: "bg-accent/10 text-accent",
      IconComponent: Info,
   },
};

export const ToastProvider = ({ children }) => {
   const [toasts, setToasts] = useState([]);

   const pushToast = useCallback((message, variant = "success") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => {
         setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
   }, []);

   const removeToast = useCallback((id) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
   }, []);

   const value = useMemo(() => ({ toast: pushToast }), [pushToast]);

   return (
      <ToastContext.Provider value={value}>
         {children}
         <div
            aria-live="polite"
            className="fixed right-4 top-4 z-[100] flex max-w-sm flex-col gap-2.5"
         >
            {toasts.map((item) => {
               const styles =
                  TOAST_STYLES[item.variant] || TOAST_STYLES.info;
               const { IconComponent } = styles;
               return (
                  <div
                     key={item.id}
                     role="alert"
                     className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-lg shadow-slate-900/8 ${styles.wrapper}`}
                  >
                     <span
                        className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
                     >
                        <IconComponent className="h-3.5 w-3.5" />
                     </span>
                     <p className="flex-1 text-sm font-medium text-text">
                        {item.message}
                     </p>
                     <button
                        type="button"
                        onClick={() => removeToast(item.id)}
                        className="mt-0.5 flex-shrink-0 cursor-pointer rounded-md p-0.5 text-muted transition hover:text-text"
                        aria-label="Dismiss"
                     >
                        <X className="h-3.5 w-3.5" />
                     </button>
                  </div>
               );
            })}
         </div>
      </ToastContext.Provider>
   );
};
