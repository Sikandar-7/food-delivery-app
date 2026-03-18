"use client";

import { ReactNode } from "react";
import { ModalProvider } from "@/context/ModalContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";
import { OrderProvider } from "@/context/OrderContext";
import ModalRoot from "@/components/ModalRoot";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <OrderProvider>
        <SearchProvider>
          <ModalProvider>
            <CartProvider>
              {children}
              <ModalRoot />
              <Toaster position="bottom-center" toastOptions={{ className: 'font-sans font-medium' }} />
            </CartProvider>
          </ModalProvider>
        </SearchProvider>
      </OrderProvider>
    </AuthProvider>
  );
}
