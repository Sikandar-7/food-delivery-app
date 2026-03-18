"use client";

import { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

export function AuthModal() {
  const { closeModal, openModal } = useModal();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = mode === "login"
      ? await login(form.email, form.password)
      : await signup(form.name, form.email, form.password);

    setLoading(false);

    if (result.success) {
      closeModal();
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-navy text-white p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary p-2 rounded-full">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold">
              {mode === "login" ? "Welcome back!" : "Create account"}
            </h2>
            <p className="text-white/80 text-sm">
              {mode === "login" ? "Login to track orders and more" : "Join Order.pk today"}
            </p>
          </div>
        </div>

        {/* Mode toggle tabs */}
        <div className="grid grid-cols-2 bg-white/10 rounded-pill p-1">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`rounded-pill py-2 font-bold text-sm transition ${mode === "login" ? "bg-white text-navy" : "text-white/80 hover:text-white"}`}
          >
            Login
          </button>
          <button
            onClick={() => { setMode("signup"); setError(""); }}
            className={`rounded-pill py-2 font-bold text-sm transition ${mode === "signup" ? "bg-white text-navy" : "text-white/80 hover:text-white"}`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
        {mode === "signup" && (
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <User size={18} />
            </div>
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required={mode === "signup"}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl outline-none focus:border-primary transition font-medium"
            />
          </div>
        )}

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Mail size={18} />
          </div>
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl outline-none focus:border-primary transition font-medium"
          />
        </div>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Lock size={18} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl outline-none focus:border-primary transition font-medium"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-error text-sm font-medium p-3 rounded-lg border border-red-200">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            mode === "login" ? "Login to my account" : "Create my account"
          )}
        </button>

        <p className="text-center text-gray-500 text-sm">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-primary font-bold hover:underline"
          >
            {mode === "login" ? "Sign up" : "Login"}
          </button>
        </p>

        <p className="text-center text-xs text-gray-400">
          Demo Customer: customer@test.com / Test@123
        </p>
      </form>
    </div>
  );
}
