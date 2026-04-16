import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstances";
import { API_PATHS } from "../utils/apiPaths";

const AuthContext = createContext();

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
};
export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   useEffect(() => {
      checkAuthStatus();
   }, []);

   const checkAuthStatus = async () => {
      try {
         const token = localStorage.getItem("token");
         const userStr = localStorage.getItem("user");

         if (!token || !userStr) {
            setLoading(false);
            return;
         }

         //Optimistic hydrate from localStorage
         setUser(JSON.parse(userStr));
         setIsAuthenticated(true);

         //Verify token is still valid with the server
         const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
         const fresh = response.data;
         localStorage.setItem("user", JSON.stringify(fresh));
         setUser(fresh);
      } catch (error) {
         console.error("Auth check failed", error);
         localStorage.removeItem("token");
         localStorage.removeItem("user");
         setUser(null);
         setIsAuthenticated(false);
      } finally {
         setLoading(false);
      }
   };

   const login = (userData, token) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
   };

   const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/";
   };

   const updateUser = (updatedUserData) => {
      const newUserData = { ...user, ...updatedUserData };
      localStorage.setItem("user", JSON.stringify(newUserData));
      setUser(newUserData);
   };

   const value = {
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      updateUser,
      checkAuthStatus,
   };
   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
