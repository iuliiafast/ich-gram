"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  router.push("/login");
  const HomePage = () => {
    return (
      <div className="p-4 max-w-screen-lg mx-auto">
        {/* Заголовок страницы */}
        <h1 className="text-3xl font-bold text-center mb-6">Добро пожаловать!</h1>
        <p className="text-center text-gray-600 mb-4">
          Исследуйте мир через фотографии и делитесь своими моментами.
        </p>
      </div>
    );
  };
}