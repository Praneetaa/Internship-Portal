import axios from "axios";
import { BASE_URL } from "./apiPaths.js";

const axiosInstance = axios.create({
   baseURL: BASE_URL,
   timeout: 80000,
   headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
   },
});

//Request Interceptor
axiosInstance.interceptors.request.use(
   (config) => {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
         config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   },
);

//Response Interceptor
const AUTH_BYPASS_PATHS = [
   "/api/auth/login",
   "/api/auth/register",
   "/api/auth/me",
];

axiosInstance.interceptors.response.use(
   (response) => {
      return response;
   },
   (error) => {
      //Handle common errors globally
      if (error.response) {
         const requestUrl = error.config?.url || "";
         const isAuthRequest = AUTH_BYPASS_PATHS.some((p) =>
            requestUrl.includes(p),
         );

         if (error.response.status === 401 && !isAuthRequest) {
            //Drop stale credentials and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (window.location.pathname !== "/Login") {
               window.location.href = "/Login";
            }
         } else if (error.response.status === 500) {
            console.error("Server error. Please try again later");
         }
      } else if (error.code === "ECONNABORTED") {
         console.error("Request timeout. Please try again.");
      }
      return Promise.reject(error);
   },
);

export default axiosInstance;
