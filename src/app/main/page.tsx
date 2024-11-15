"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import PostFeed from '../../components/PostFeed';
import Footer from '../../components/Footer';
import AvatarUpload from '../../components/AvatarUpload';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Main = () => {
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true); // Устанавливаем состояние загрузки

    try {
      const response = await axios.post(
        "/api/auth/login",
        {
          [isEmail ? "email" : "username"]: login, // Выбор email или username
          password,
        },
        { withCredentials: true }
      );

      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 7 }); // Сохраняем токен в куки

        const socketConnection = initializeWebSocket(response.data.token);
        setSocket(socketConnection);

        router.push("/profile"); // Переход на страницу профиля
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Ошибка авторизации. Проверьте правильность данных.");
      } else {
        setError("Произошла ошибка. Попробуйте позже.");
      }
    } finally {
      setIsLoading(false); // Отключаем состояние загрузки
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
    <>
      <div className="flex h-screen bg-gray-100">
        <div className="flex h-screen">
          <Sidebar />
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleLogin}
          >
            <AvatarUpload />
            <span>Profile</span>
          </button>
        </div>
        <div className="flex-grow p-6"> {/* Добавим класс для отступов */}</div>
        <PostFeed />
      </div>
      <Footer />
    </>
  );
};

export default Main;
