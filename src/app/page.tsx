"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Перенаправляем на /login при монтировании компонента
    router.push("/login");
  }, [router]);

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
