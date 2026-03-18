"use client";

import { useState } from "react";
import { useModal } from "@/context/ModalContext";

export function PostcodeModal() {
  const { closeModal } = useModal();
  const [postcode, setPostcode] = useState("");
  const [state, setState] = useState<"DEFAULT" | "SUCCESS" | "ERROR">("DEFAULT");

  const handleCheck = () => {
    if (postcode.trim() === "EC4R 3TE") {
      setState("SUCCESS");
      setTimeout(() => closeModal(), 2000);
    } else {
      setState("ERROR");
    }
  };

  return (
    <div className="p-8 md:p-12 text-center max-w-lg mx-auto w-full">
      <div className="mb-6 flex justify-center">
        {state === "DEFAULT" && <div className="text-6xl">📍</div>}
        {state === "ERROR" && <div className="text-6xl">❌</div>}
        {state === "SUCCESS" && <div className="text-6xl">✅</div>}
      </div>
      
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy mb-2">Check delivery availability</h2>
      <p className="text-gray-600 mb-8">Enter your postcode to see if we deliver to your area.</p>

      <div className="flex flex-col gap-4">
        <div className={`flex border rounded-xl overflow-hidden ${state === "ERROR" ? "border-error" : state === "SUCCESS" ? "border-success" : "border-gray-300"}`}>
            <input 
              type="text" 
              placeholder="e.g. EC4R 3TE" 
              value={postcode}
              onChange={(e) => {
                  setPostcode(e.target.value.toUpperCase());
                  if(state !== "DEFAULT") setState("DEFAULT");
              }}
              className="flex-grow px-4 py-3 outline-none text-navy font-bold text-center"
            />
        </div>
        
        {state === "ERROR" && <p className="text-error font-medium text-sm text-center">Sorry, we don&apos;t deliver to this area yet.</p>}
        {state === "SUCCESS" && <p className="text-success font-medium text-sm text-center">Great news! We deliver to your area.</p>}

        <button 
            onClick={handleCheck}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors mt-2"
        >
            Check Postcode
        </button>
      </div>
    </div>
  );
}
