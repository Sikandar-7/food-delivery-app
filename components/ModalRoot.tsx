"use client";

import { useModal } from "@/context/ModalContext";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

import { PostcodeModal } from "./modals/PostcodeModal";
import { OrderNowModal } from "./modals/OrderNowModal";
import { MealDealModal } from "./modals/MealDealModal";
import { CustomizeModal } from "./modals/CustomizeModal";
import { SpecialRequestModal } from "./modals/SpecialRequestModal";
import { AuthModal } from "./modals/AuthModal";
import { CartDrawer } from "./modals/CartDrawer";
import { CheckoutModal } from "./modals/CheckoutModal";

export default function ModalRoot() {
  const { modalState, closeModal } = useModal();

  useEffect(() => {
    if (modalState.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalState.isOpen]);

  if (!modalState.isOpen) return null;

  // Cart drawer has its own full-screen layout - render separately
  if (modalState.type === "CART_DRAWER") {
    return <CartDrawer />;
  }

  const renderModalContent = () => {
    switch (modalState.type) {
      case "AUTH":
        return <AuthModal />;
      case "POSTCODE":
        return <PostcodeModal />;
      case "ORDER_NOW":
        return <OrderNowModal />;
      case "MEAL_DEAL":
        return <MealDealModal />;
      case "CUSTOMIZE_PIZZA":
        return <CustomizeModal />;
      case "SPECIAL_REQUEST":
        return <SpecialRequestModal />;
      case "CHECKOUT":
        return <CheckoutModal />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 bg-gray-100 text-navy p-2 rounded-full hover:bg-gray-200 transition shadow"
            >
              <X size={20} />
            </button>

            <div className="w-full bg-white flex-grow overflow-y-auto">
              {renderModalContent()}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
