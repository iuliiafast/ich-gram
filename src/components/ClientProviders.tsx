"use client";
import { Provider as ReduxProvider } from "react-redux";
import React from "react";
import { ModalProvider } from "./ModalContext";
import Modal from "./Modal";
import { AuthProvider } from "../utils/AuthContext";
import TokenInitializer from '../components/TokenInitializer';
import { store } from "../utils/store/store";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <ModalProvider>
          <TokenInitializer /> {/* Инициализатор токена */}
          {children}
          <Modal />
        </ModalProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}