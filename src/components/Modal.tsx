"use client";
import React from 'react';
import { useModal } from './ModalContext';

const Modal = () => {
  const { isModalOpen, modalMessage, closeModal } = useModal();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl">{modalMessage}</h2>
        <button onClick={closeModal} className="mt-4 bg-blue-500 text-white p-2 rounded">
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default Modal;
