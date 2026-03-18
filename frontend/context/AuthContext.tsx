"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated user database (in a real app, this would be a real backend)
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "demo@order.uk": {
    password: "password123",
    user: { id: "1", name: "Demo User", email: "demo@order.uk", avatar: "D" },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise((res) => setTimeout(res, 800));

    const record = DEMO_USERS[email.toLowerCase()];
    if (record && record.password === password) {
      setUser(record.user);
      return { success: true };
    }

    // Auto-register any new user for demo purposes
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email: email.toLowerCase(),
      avatar: email[0].toUpperCase(),
    };
    setUser(newUser);
    return { success: true };
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((res) => setTimeout(res, 800));
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      avatar: name[0].toUpperCase(),
    };
    setUser(newUser);
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be within AuthProvider");
  return context;
}
