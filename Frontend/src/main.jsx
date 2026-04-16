import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <AuthProvider>
         <App />
         <Toaster
            position="top-center"
            toastOptions={{
               duration: 3000,
               success: { style: { background: "#ECFDF5", color: "#065F46" } },
               error: { style: { background: "#FEF2F2", color: "#991B1B" } },
            }}
         />
      </AuthProvider>
   </StrictMode>,
);
