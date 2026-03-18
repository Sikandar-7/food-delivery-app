"use client";

import { useModal } from "@/context/ModalContext";
import { useState } from "react";

export function SpecialRequestModal() {
  const { closeModal } = useModal();
  const [request, setRequest] = useState("");

  const handleApply = () => {
    // In a real flow, this could update the cart or the current item's instructions.
    // For now, it simply closes the modal logic-wise according to the design.
    console.log("Special request:", request);
    closeModal();
  };

  return (
    <div className="w-full">
      <div className="p-8 pb-4">
        <h2 className="text-3xl font-heading font-bold text-navy mb-2">Special Request</h2>
        <p className="text-gray-600 font-medium">Please let us know if you have any allergies or dietary requirements, or any other instructions for the restaurant.</p>
      </div>

      <div className="p-8 pt-0">
          <textarea 
             value={request}
             onChange={(e) => setRequest(e.target.value)}
             placeholder="e.g. Please leave out the onions, no cutlery needed..."
             className="w-full h-40 border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-primary transition resize-none font-medium text-navy"
          ></textarea>
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
         <button 
            onClick={closeModal}
            className="px-6 py-3 font-bold text-gray-500 hover:text-navy transition"
         >
            Cancel
         </button>
         <button 
            onClick={handleApply}
            className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary/90 transition shadow-md"
         >
            Apply Notes
         </button>
      </div>
    </div>
  );
}
