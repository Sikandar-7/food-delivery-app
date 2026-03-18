"use client";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center justify-center py-32 px-6 text-center">
      <div className="w-20 h-20 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mb-6">
        <Settings size={40} />
      </div>
      <h2 className="text-2xl font-bold font-heading text-navy mb-2">Platform Settings</h2>
      <p className="text-gray-500 max-w-sm">
        Global application settings, payment gateways, and email configurations will be available here soon.
      </p>
    </div>
  );
}
