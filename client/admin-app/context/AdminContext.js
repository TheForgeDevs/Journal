"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authAPI } from "@/lib/api";
import toast from "react-hot-toast";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get("admin_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getProfile();
      if (response.data.data.user.role === "admin") {
        setAdmin(response.data.data.user);
      } else {
        Cookies.remove("admin_token");
        toast.error("Unauthorized access");
      }
    } catch (error) {
      Cookies.remove("admin_token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, data } = response.data;

      if (data.user.role !== "admin") {
        toast.error("Admin access only");
        return false;
      }

      Cookies.set("admin_token", token, { expires: 7 });
      setAdmin(data.user);
      toast.success("Login successful");
      router.push("/dashboard");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const logout = () => {
    Cookies.remove("admin_token");
    setAdmin(null);
    router.push("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
