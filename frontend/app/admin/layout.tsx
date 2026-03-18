"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect once we finish checking the local storage token
    if (!isLoading && (!isLoggedIn || user?.role !== "SUPER_ADMIN")) {
      router.push("/");
    }
  }, [isLoading, isLoggedIn, user, router]);

  // While loading auth state, show a clean loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // If we finished loading but user is still invalid, render nothing (router catches it)
  if (!isLoggedIn || user?.role !== "SUPER_ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-page-bg font-body">
      <AdminSidebar />
      <div className="ml-64 flex flex-col h-screen">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
