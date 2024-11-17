"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { registerStart, registerSuccess, registerFailure, clearError } from "../utils/store/slices/authSlice";
import { LoginFormProps } from "../utils/types";
import { RootState } from "../utils/store/index";

const LoginForm = ({ setIsLoading, isLoading }: LoginFormProps) => {
  const [userObject, setUserObject] = useState<{ login: string; password: string }>({
    login: "",
    password: "",
  });
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const { errorMessage, isLoading: reduxIsLoading } = useSelector((state: RootState) => state.auth);

  const initializeWebSocket = (token: string) => {
    const socket = io("/", {
      auth: {
        token: `Bearer ${token}`,
      },
    });

    socket.on("connect", () => {
      console.log("WebSocket: Connection successfully established!");
    });

    socket.on("message", (data) => {
      console.log("WebSocket message:", data);
    });

    socket.on("connect_error", (err) => {
      console.log("WebSocket connection error:", err.message);
    });

    return socket;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerStart()); // Начало регистрации

    const { login, password } = userObject;
    const isEmail = login.includes("@");

    if (!login || !password) {
      dispatch(registerFailure("Введите email/username и пароль."));
      return;
    }

    try {
      const response = await axios.post(
        "/api/auth/login",
        {
          [isEmail ? "email" : "userName"]: login,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 7 });

        // Диспатчим успех регистрации с полученными данными
        dispatch(registerSuccess({ user: response.data.user, token: response.data.token }));

        const socketConnection = initializeWebSocket(response.data.token);
        setSocket(socketConnection);

        router.push(`/profile/${response.data.user._id}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        const message = err.message || "Ошибка авторизации. Проверьте правильность данных.";
        dispatch(registerFailure(message)); // Ошибка
      } else {
        // Если ошибка не является экземпляром Error
        dispatch(registerFailure("Произошла ошибка при авторизации."));
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Очистка сокета при размонтировании компонента
  useEffect(() => {
    return () => {
      if (socket && socket.connected) {
        socket.disconnect(); // Закрытие соединения при размонтировании
        console.log("WebSocket: Connection closed.");
      }
    };
  }, [socket]); // Слежение за изменением сокета
  // Функция для очистки ошибки при изменении данных в поле ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserObject((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Очистка ошибки при изменении данных
    dispatch(clearError());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
      <input
        name="login"
        value={userObject.login}
        onChange={handleInputChange}
        type="text"
        placeholder="Имя пользователя или email"
        className="p-2 border rounded w-full"
        required
        disabled={reduxIsLoading || isLoading}
      />

      <input
        name="password"
        value={userObject.password}
        onChange={handleInputChange}
        type="password"
        placeholder="Пароль"
        className="p-2 border rounded w-full"
        required
        disabled={reduxIsLoading || isLoading}
      />

      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
        disabled={reduxIsLoading || isLoading}
      >
        {reduxIsLoading ? "Загрузка..." : "Log in"}
      </button>

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </form>
  );
};

export default LoginForm;
