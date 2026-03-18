"use client";
import { Bike } from "lucide-react";

export default function AdminRidersPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center justify-center py-32 px-6 text-center">
      <div className="w-20 h-20 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-6">
        <Bike size={40} />
      </div>
      <h2 className="text-2xl font-bold font-heading text-navy mb-2">Rider Management</h2>
      <p className="text-gray-500 max-w-sm">
        The complete rider dispatch and management panel is currently under development (Phase 6). Check back soon!
      </p>
      <button className="mt-8 bg-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-navy/90 transition shadow-md">
        Notify when ready
      </button>
    </div>
  );
}
