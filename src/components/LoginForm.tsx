"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

type LoginFormProps = {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
};

const LoginForm = ({ setError, setIsLoading, isLoading }: LoginFormProps) => {
  const [userObject, setUserObject] = useState<{ login: string; password: string }>({
    login: "",
    password: "",
  });
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  const initializeWebSocket = (token: string) => {
    const socketConnection = io("http://localhost:3000", {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socketConnection.on("connect", () => {
      console.log("WebSocket: Connection successfully established!");
    });

    socketConnection.on("message", (data) => {
      console.log("WebSocket message:", data);
    });

    socketConnection.on("connect_error", (err) => {
      console.log("WebSocket connection error:", err.message);
    });

    return socketConnection;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Сброс ошибки при отправке формы

    const { login, password } = userObject;
    const isEmail = login.includes("@");

    try {
      const response = await axios.post(
        "/api/auth/login",
        {
          [isEmail ? "email" : "username"]: login,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 7 });

        const socketConnection = initializeWebSocket(response.data.token);
        setSocket(socketConnection);

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

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
        console.log("WebSocket: Connection closed.");
      }
    };
  }, [socket]);

  return (
    <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
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
        {isLoading ? "Загрузка..." : "Log in"}
      </button>
    </form>
  );
};

export default LoginForm;
