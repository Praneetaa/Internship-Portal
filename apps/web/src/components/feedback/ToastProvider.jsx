import {
   createContext,
   useCallback,
   useContext,
   useMemo,
   useState,
} from "react";

const ToastContext = createContext(null);

export const useToast = () => {
   const context = useContext(ToastContext);
   if (!context) {
      throw new Error("useToast must be used inside ToastProvider");
   }
   return context;
};

export const ToastProvider = ({ children }) => {
   const [toasts, setToasts] = useState([]);

   const pushToast = useCallback((message, variant = "success") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => {
         setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 4200);
   }, []);

   const removeToast = useCallback((id) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
   }, []);

   const value = useMemo(() => ({ toast: pushToast }), [pushToast]);

   return (
      <ToastContext.Provider value={value}>
         {children}
         <div className="fixed right-4 top-4 z-50 flex max-w-sm flex-col gap-3">
            {toasts.map((item) => (
               <div
                  key={item.id}
                  className={`rounded-2xl border px-4 py-3 shadow-lg shadow-slate-900/10 transition-all duration-300 ${
                     item.variant === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : item.variant === "error"
                          ? "border-rose-200 bg-rose-50 text-rose-800"
                          : "border-slate-200 bg-white text-slate-900"
                  }`}
               >
                  <div className="flex items-center justify-between gap-3">
                     <p className="text-sm font-semibold">{item.message}</p>
                     <button
                        type="button"
                        className="text-xs font-semibold opacity-70 transition hover:opacity-100"
                        onClick={() => removeToast(item.id)}
                     >
                        Close
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </ToastContext.Provider>
   );
};
