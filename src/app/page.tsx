"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "../utils/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      router.push("/login"); // Перенаправляем на страницу логина, если пользователь не авторизован
    }
  }, [token, router]);
  if (!token) {
    return null; // Показываем пустую страницу или индикатор загрузки до перенаправления
  }

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      {/* Заголовок страницы */}
      <h1 className="text-3xl font-bold text-center mb-6">Добро пожаловать!</h1>
      <p className="text-center text-gray-600 mb-4">
        Исследуйте мир через фотографии и делитесь своими моментами.
      </p>
    </div>
  );
}
