"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "@/lib/api";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profilePhoto?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-login on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        console.error("Failed to restore session", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { user, accessToken, refreshToken } = res.data.data;
        
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        setUser(user);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.message || err.message || 'Error connecting to server'
      };
    }
  };

  const signup = async (fullName: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.post('/auth/register', { fullName, email, password });
      if (res.data.success) {
        const { user, accessToken, refreshToken } = res.data.data;
        
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        setUser(user);
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.message || err.message || 'Error connecting to server'
      };
    }
  };

  const logout = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            await api.post('/auth/logout', { refreshToken });
        }
    } catch (err) {
        console.error("Logout API failed", err);
    } finally {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be within AuthProvider");
  return context;
}
