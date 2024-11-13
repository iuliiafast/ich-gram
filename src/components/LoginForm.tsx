"use client";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { io } from "socket.io-client"; // Импортируем socket.io-client

export const LoginForm = () => {
  const [userObject, setUserObject] = useState<{ login: string; password: string }>({ login: "", password: "" });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Функция для инициализации WebSocket
  const initializeWebSocket = (token: string) => {
    const socket = io("http://localhost:3000", {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socket.on("connect", () => {
      console.log("WebSocket: Подключение успешно установлено!");
    });

    socket.on("message", (data) => {
      console.log("WebSocket message:", data);
    });

    socket.on("connect_error", (err) => {
      console.log("WebSocket ошибка подключения:", err.message);
    });

    return socket;
  };

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Очистить ошибку перед новым запросом

    const { login, password } = userObject;

    // Проверяем, является ли введенное значение email
    const isEmail = login.includes("@");

    try {
      // Запрос на сервер с проверкой, что передается email или username
      const response = await axios.post("/api/auth/login", {
        [isEmail ? "email" : "username"]: login,
        password,
      }, { withCredentials: true });

      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 7 });

        // Инициализация WebSocket после логина
        initializeWebSocket(response.data.token);

        router.push("/profile");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Ошибка авторизации. Проверьте правильность данных.");
      } else {
        setError("Произошла ошибка. Попробуйте позже.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <input
        onChange={(e) => setUserObject({ ...userObject, login: e.target.value })}
        type="text"
        placeholder="Имя пользователя или email"
        className="p-2 border rounded w-full"
        required
      />
      <input
        onChange={(e) => setUserObject({ ...userObject, password: e.target.value })}
        type="password"
        placeholder="Пароль"
        className="p-2 border rounded w-full"
        required
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
        disabled={isLoading}
      >
        {isLoading ? 'Загрузка...' : 'Log in'}
      </button>
      <div className="flex items-center mt-6">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="px-2 text-gray-500">OR</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>
      <Link href="/reset" className="text-blue-600 hover:underline">Forgot password?</Link>
    </form>
  );
};
