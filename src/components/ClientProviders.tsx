"use client";

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../utils/store/store";
import { ModalProvider } from "./ModalContext";
import Modal from "./Modal";
import { AuthProvider } from "../utils/AuthContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <ModalProvider>
          {children}
          <Modal />
        </ModalProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
