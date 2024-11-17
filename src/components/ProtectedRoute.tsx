"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../utils/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login"); // Перенаправляем на логин, если не авторизован
    }
  }, [token, router]);

  if (!token) {
    return null; // Показываем пустую страницу или индикатор загрузки до перенаправления
  }

  return <>{children}</>;
}
