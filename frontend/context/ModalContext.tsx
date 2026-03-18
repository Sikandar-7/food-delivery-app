"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "MEAL_DEAL" | "CUSTOMIZE_PIZZA" | "SPECIAL_REQUEST" | "POSTCODE" | "ORDER_NOW" | "CHECKOUT" | "AUTH" | "CART_DRAWER" | null;

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  data: any;
}

interface ModalContextType {
  modalState: ModalState;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    data: null,
  });

  const openModal = (type: ModalType, data: any = null) => {
    setModalState({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, data: null });
  };

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
