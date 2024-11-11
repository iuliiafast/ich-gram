"use client";
import React, { createContext, useState, useContext } from 'react';

interface ModalContextType {
  showModal: boolean;
  modalMessage: string;
  setModalMessage: (message: string) => void;
  setShowModal: (show: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  return (
    <ModalContext.Provider value={{ showModal, modalMessage, setShowModal, setModalMessage }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
